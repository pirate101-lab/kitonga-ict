import { NextResponse } from "next/server";
import {
  extractAdminToken,
  getAuthenticatedAdmin,
  setAdminSessionCookie,
} from "@/lib/admin-auth";
import { changeOwnPassword, validatePassword } from "@/lib/admin-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/admin/change-password
 * Body: { currentPassword: string, newPassword: string }
 *
 * Lets the signed-in admin rotate their OWN password. Requires a valid
 * Bearer token AND the correct current password (so a stolen token
 * alone cannot lock the legitimate admin out).
 *
 * On success returns a freshly-minted Bearer token. The presenter's
 * existing token stays valid; tokens for OTHER devices on the same
 * account are revoked.
 */
export async function POST(req: Request) {
  const admin = await getAuthenticatedAdmin(req);
  if (!admin) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized." },
      { status: 401 },
    );
  }

  let body: { currentPassword?: unknown; newPassword?: unknown } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }
  const currentPassword =
    typeof body.currentPassword === "string" ? body.currentPassword : "";
  const newPassword =
    typeof body.newPassword === "string" ? body.newPassword : "";

  const passwordError = validatePassword(newPassword);
  if (passwordError) {
    return NextResponse.json(
      { ok: false, error: passwordError },
      { status: 400 },
    );
  }

  const presented = extractAdminToken(req);
  const next = await changeOwnPassword(
    admin.id,
    currentPassword,
    newPassword,
    presented || null,
  );
  if (!next) {
    return NextResponse.json(
      { ok: false, error: "Current password is incorrect." },
      { status: 401 },
    );
  }
  const res = NextResponse.json({ ok: true, token: next.token });
  setAdminSessionCookie(res, next.token, next.expiresAt);
  return res;
}
