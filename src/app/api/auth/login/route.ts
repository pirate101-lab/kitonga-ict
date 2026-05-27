import { NextResponse } from "next/server";
import { normaliseKenyanPhone } from "@/lib/phone";
import { findUserByPhone, verifyPassword } from "@/lib/users-db";
import { SESSION_COOKIE_NAME, sessionCookieOptions, signSession } from "@/lib/session";

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/login
 * Body: { phone: string, password: string }
 *
 * Silently normalises the phone, verifies the scrypt password, and on
 * success sets the `kitonga_session` cookie. Always returns the same
 * generic error on 401 to avoid user-enumeration.
 */
export async function POST(req: Request) {
  let body: { phone?: unknown; password?: unknown } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const phoneRaw = typeof body.phone === "string" ? body.phone : "";
  const password = typeof body.password === "string" ? body.password : "";

  const phone = normaliseKenyanPhone(phoneRaw);
  const generic401 = NextResponse.json(
    { ok: false, error: "Invalid phone or password." },
    { status: 401 },
  );

  if (!phone || !password) return generic401;

  const user = await findUserByPhone(phone);
  if (!user) return generic401;

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return generic401;

  const token = signSession(phone);
  const res = NextResponse.json({ ok: true, phone });
  const opts = sessionCookieOptions();
  res.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: opts.httpOnly,
    sameSite: opts.sameSite,
    secure: opts.secure,
    path: opts.path,
    maxAge: opts.maxAge,
  });
  return res;
}
