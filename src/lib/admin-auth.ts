import "server-only";
import { NextResponse } from "next/server";
import {
  findAdminByToken,
  isLiveAdminToken,
  readAdminRecord,
  type AdminUser,
} from "@/lib/admin-store";

export const ADMIN_SESSION_COOKIE_NAME = "kitonga_admin";
const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

/**
 * Reads the legacy bootstrap admin token from the environment. Once
 * `data/admin.json` has been provisioned, the env value is treated as a
 * recovery-only fallback (used by `requireAdmin` when no admin record
 * exists yet, so the very first admin can claim the studio before
 * `scripts/init-admin.mjs` has been run).
 */
export function getEnvAdminToken(): string {
  return (
    process.env.ADMIN_API_TOKEN ??
    process.env.ADMIN_PASSWORD ??
    ""
  );
}

/** Backwards-compatible alias kept for other callers in the code-base. */
export function getAdminToken(): string {
  return getEnvAdminToken();
}

export function extractBearer(req: Request): string {
  const header = req.headers.get("authorization") ?? "";
  return header.toLowerCase().startsWith("bearer ")
    ? header.slice(7).trim()
    : "";
}

function extractCookie(req: Request, name: string): string {
  const header = req.headers.get("cookie") ?? "";
  if (!header) return "";
  const prefix = `${name}=`;
  const part = header
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(prefix));
  if (!part) return "";
  try {
    return decodeURIComponent(part.slice(prefix.length));
  } catch {
    return part.slice(prefix.length);
  }
}

export function extractAdminToken(req: Request): string {
  return (
    extractBearer(req) ||
    extractCookie(req, ADMIN_SESSION_COOKIE_NAME)
  );
}

function cookieMaxAge(expiresAt?: string): number {
  if (!expiresAt) return ADMIN_SESSION_TTL_SECONDS;
  const seconds = Math.floor((Date.parse(expiresAt) - Date.now()) / 1000);
  return Number.isFinite(seconds) && seconds > 0
    ? seconds
    : ADMIN_SESSION_TTL_SECONDS;
}

export function setAdminSessionCookie(
  res: NextResponse,
  token: string,
  expiresAt?: string,
) {
  res.cookies.set({
    name: ADMIN_SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: cookieMaxAge(expiresAt),
  });
}

export function clearAdminSessionCookie(res: NextResponse) {
  res.cookies.set({
    name: ADMIN_SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function isAdminTokenAccepted(presented: string): Promise<boolean> {
  if (!presented) return false;
  if (await isLiveAdminToken(presented)) return true;

  // Recovery fallback: if no admin record exists yet, accept the env
  // bootstrap token. Login now provisions a real owner account, so this
  // path is only for legacy direct API calls during first setup.
  const record = await readAdminRecord();
  if (!record) {
    const envToken = getEnvAdminToken();
    if (envToken && presented === envToken) return true;
  }

  return false;
}

/**
 * Guard helper for /api/media/*, /api/portfolio (POST), and other
 * routes that just need "any signed-in admin".
 *
 * Returns `null` on success (request is admin-authenticated), or a 401
 * NextResponse on failure.
 */
export async function requireAdmin(
  req: Request,
): Promise<NextResponse | null> {
  const presented = extractAdminToken(req);
  if (!presented) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized." },
      { status: 401 },
    );
  }

  if (await isAdminTokenAccepted(presented)) return null;

  return NextResponse.json(
    { ok: false, error: "Unauthorized." },
    { status: 401 },
  );
}

/**
 * Returns the AdminUser whose Bearer token was presented on the request,
 * or null when the request is unauthenticated. Use this when a route
 * needs to know WHICH admin is calling (e.g. change-password).
 */
export async function getAuthenticatedAdmin(
  req: Request,
): Promise<AdminUser | null> {
  const presented = extractAdminToken(req);
  if (!presented) return null;
  return findAdminByToken(presented);
}

/**
 * Owner-only guard. Returns either a NextResponse to short-circuit the
 * route, or `{ admin }` with the authenticated owner. Used by the
 * /api/admins family of routes.
 */
export async function requireOwner(
  req: Request,
): Promise<NextResponse | { admin: AdminUser }> {
  const admin = await getAuthenticatedAdmin(req);
  if (!admin) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized." },
      { status: 401 },
    );
  }
  if (admin.role !== "owner") {
    return NextResponse.json(
      { ok: false, error: "Owner role required." },
      { status: 403 },
    );
  }
  return { admin };
}
