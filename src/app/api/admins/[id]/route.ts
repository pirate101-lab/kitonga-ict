import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/admin-auth";
import { deleteAdminById, updateAdminById } from "@/lib/admin-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

/**
 * PATCH /api/admins/<id>
 * Body: { username?: string, newPassword?: string, role?: "owner"|"manager" }
 *
 * Owner-only. Update any subset of fields on the target admin. Resets
 * the target's tokens whenever the password changes.
 */
export async function PATCH(req: Request, ctx: Params) {
  const guard = await requireOwner(req);
  if (guard instanceof Response) return guard;
  const owner = guard.admin;

  const { id } = await ctx.params;
  let body: {
    username?: unknown;
    newPassword?: unknown;
    role?: unknown;
  } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const patch: {
    username?: string;
    newPassword?: string;
    role?: "owner" | "manager";
  } = {};
  if (typeof body.username === "string") patch.username = body.username;
  if (typeof body.newPassword === "string" && body.newPassword.length > 0) {
    patch.newPassword = body.newPassword;
  }
  if (body.role === "owner" || body.role === "manager") {
    // Block owners from accidentally demoting themselves below the
    // store's "last owner" guardrail; the store enforces this too,
    // but bailing early gives a clearer error.
    if (id === owner.id && body.role === "manager") {
      return NextResponse.json(
        { ok: false, error: "Use the team page to transfer ownership before demoting yourself." },
        { status: 400 },
      );
    }
    patch.role = body.role;
  }

  const result = await updateAdminById(id, patch);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: 400 },
    );
  }
  return NextResponse.json({ ok: true, admin: result.admin });
}

/**
 * DELETE /api/admins/<id>
 *
 * Owner-only. Removes the admin and all their tokens. Refuses to
 * delete the last surviving owner. Owners can also delete themselves
 * provided another owner exists.
 */
export async function DELETE(req: Request, ctx: Params) {
  const guard = await requireOwner(req);
  if (guard instanceof Response) return guard;

  const { id } = await ctx.params;
  const result = await deleteAdminById(id);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: 400 },
    );
  }
  return NextResponse.json({ ok: true });
}
