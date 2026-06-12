import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/admin-auth";
import { changeOwnUsername } from "@/lib/admin-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/admin/change-username
 * Body: { currentPassword: string, newUsername: string }
 *
 * Lets the signed-in admin rename themselves. Requires the current
 * password as a safety check.
 */
export async function POST(req: Request) {
  const admin = await getAuthenticatedAdmin(req);
  if (!admin) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized." },
      { status: 401 },
    );
  }

  let body: { currentPassword?: unknown; newUsername?: unknown } = {};
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
  const newUsername =
    typeof body.newUsername === "string" ? body.newUsername : "";

  const result = await changeOwnUsername(admin.id, currentPassword, newUsername);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: result.error.toLowerCase().includes("password") ? 401 : 400 },
    );
  }
  return NextResponse.json({ ok: true, admin: result.admin });
}
