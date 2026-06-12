import { NextResponse } from "next/server";
import { normaliseKenyanPhone } from "@/lib/phone";
import { createUser } from "@/lib/users-db";
import { SESSION_COOKIE_NAME, sessionCookieOptions, signSession } from "@/lib/session";

export const dynamic = "force-dynamic";

const MIN_PASSWORD_LENGTH = 6;

/**
 * POST /api/auth/signup
 * Body: { phone: string, password: string }
 *
 * Silently normalises the phone to E.164 (07.../011.../7.../+254... all
 * accepted) and creates a new user with a scrypt-hashed password. On
 * success, sets the `kitonga_session` cookie and returns 201.
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
  if (!phone) {
    return NextResponse.json(
      { ok: false, error: "Invalid phone number." },
      { status: 400 },
    );
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { ok: false, error: "Password too short." },
      { status: 400 },
    );
  }

  try {
    await createUser(phone, password);
  } catch (err) {
    if (err instanceof Error && err.message === "USER_EXISTS") {
      return NextResponse.json(
        { ok: false, error: "An account with that phone already exists." },
        { status: 409 },
      );
    }
    console.error("[/api/auth/signup] failed", err);
    return NextResponse.json(
      { ok: false, error: "Could not create the account." },
      { status: 500 },
    );
  }

  const token = signSession(phone);
  const res = NextResponse.json({ ok: true, phone }, { status: 201 });
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
