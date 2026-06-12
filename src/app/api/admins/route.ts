import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/admin-auth";
import { createAdmin, listAdmins } from "@/lib/admin-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admins
 * Owner-only. Returns the list of all studio admins (without password
 * hashes).
 */
export async function GET(req: Request) {
  const guard = await requireOwner(req);
  if (guard instanceof Response) return guard;
  const admins = await listAdmins();
  return NextResponse.json({ ok: true, admins });
}

/**
 * POST /api/admins
 * Body: { username: string, password: string, role?: "owner"|"manager" }
 *
 * Owner-only. Creates a new admin. Defaults to the `manager` role so
 * accidentally minting more owners is hard (use PATCH to promote).
 */
export async function POST(req: Request) {
  const guard = await requireOwner(req);
  if (guard instanceof Response) return guard;

  let body: { username?: unknown; password?: unknown; role?: unknown } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }
  const username = typeof body.username === "string" ? body.username : "";
  const password = typeof body.password === "string" ? body.password : "";
  const role =
    body.role === "owner" || body.role === "manager" ? body.role : "manager";

  const result = await createAdmin({ username, password, role });
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: 400 },
    );
  }
  return NextResponse.json({ ok: true, admin: result.admin }, { status: 201 });
}
