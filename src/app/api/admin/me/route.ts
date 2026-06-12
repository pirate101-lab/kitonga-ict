import { NextResponse } from "next/server";
import {
  extractAdminToken,
  getAuthenticatedAdmin,
  setAdminSessionCookie,
} from "@/lib/admin-auth";
import { toSafeAdmin } from "@/lib/admin-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/me
 *
 * Returns the SafeAdmin (no password hash) corresponding to the
 * presented Bearer token. Used by the AdminShell sidebar to render the
 * signed-in user's name + role and to decide whether to show the "Team"
 * link (owners only).
 */
export async function GET(req: Request) {
  const admin = await getAuthenticatedAdmin(req);
  if (!admin) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized." },
      { status: 401 },
    );
  }
  const res = NextResponse.json({ ok: true, admin: toSafeAdmin(admin) });
  const token = extractAdminToken(req);
  if (token) setAdminSessionCookie(res, token);
  return res;
}
