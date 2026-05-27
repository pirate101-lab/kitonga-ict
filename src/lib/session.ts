import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Tiny session-token implementation.
 *
 * Token shape:  base64url(payloadJSON) + "." + base64url(HMAC_SHA256)
 *
 * Payload:      { phone: string, exp: number }   // exp = unix seconds
 *
 * The HMAC is computed over the base64url-encoded payload using
 * `SESSION_SECRET` from the environment. All crypto runs through
 * `node:crypto`, which is fine in both route handlers (Node default)
 * and `proxy.ts` (also Node-only in Next 16 — the `runtime` config is
 * not allowed on Proxy). No third-party JWT library required.
 */

export const SESSION_COOKIE_NAME = "kitonga_session";
const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

export type SessionPayload = {
  phone: string;
  exp: number;
};

function getSecret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) {
    // Loud failure on the server only — never leak this through the wire.
    throw new Error(
      "SESSION_SECRET env var is missing or too short (need ≥16 chars).",
    );
  }
  return s;
}

function b64urlEncode(input: Buffer | string): string {
  const buf = typeof input === "string" ? Buffer.from(input, "utf8") : input;
  return buf
    .toString("base64")
    .replace(/=+$/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function b64urlDecode(input: string): Buffer {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return Buffer.from(b64, "base64");
}

/** Sign a session token good for `ttlSeconds` (default 30 days). */
export function signSession(
  phone: string,
  ttlSeconds: number = DEFAULT_TTL_SECONDS,
): string {
  const payload: SessionPayload = {
    phone,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };
  const payloadB64 = b64urlEncode(JSON.stringify(payload));
  const sigB64 = b64urlEncode(
    createHmac("sha256", getSecret()).update(payloadB64).digest(),
  );
  return `${payloadB64}.${sigB64}`;
}

/**
 * Verify a session token. Returns the decoded payload on success or
 * `null` for any failure (bad shape, bad signature, expired).
 */
export function verifySession(token: string | undefined | null): SessionPayload | null {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, sigB64] = parts;

  let expected: Buffer;
  try {
    expected = createHmac("sha256", getSecret()).update(payloadB64).digest();
  } catch {
    return null;
  }
  let supplied: Buffer;
  try {
    supplied = b64urlDecode(sigB64);
  } catch {
    return null;
  }
  if (supplied.length !== expected.length) return null;
  if (!timingSafeEqual(supplied, expected)) return null;

  let payload: SessionPayload;
  try {
    const decoded = b64urlDecode(payloadB64).toString("utf8");
    payload = JSON.parse(decoded) as SessionPayload;
  } catch {
    return null;
  }

  if (typeof payload.phone !== "string" || typeof payload.exp !== "number") {
    return null;
  }
  if (payload.exp * 1000 < Date.now()) return null;
  return payload;
}

/** Cookie options used everywhere we write the session cookie. */
export const sessionCookieOptions = (ttlSeconds: number = DEFAULT_TTL_SECONDS) =>
  ({
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ttlSeconds,
  }) as const;
