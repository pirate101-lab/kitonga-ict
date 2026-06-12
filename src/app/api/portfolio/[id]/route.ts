import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  deletePortfolioItem,
  upsertPortfolioItem,
  type PortfolioRecord,
} from "@/lib/portfolio-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

/**
 * PATCH /api/portfolio/<id>
 * Admin-only. Patches an existing item; creates if it doesn't exist.
 */
export async function PATCH(req: Request, ctx: Params) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  try {
    const { id } = await ctx.params;
    const body = (await req.json().catch(() => ({}))) as Partial<PortfolioRecord>;
    const next = await upsertPortfolioItem({ ...body, id });
    return NextResponse.json({ ok: true, item: next });
  } catch (err) {
    console.error("[/api/portfolio PATCH] failed", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Patch failed." },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/portfolio/<id>
 * Admin-only. Removes the item. Returns 404 when not found.
 */
export async function DELETE(req: Request, ctx: Params) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  try {
    const { id } = await ctx.params;
    const removed = await deletePortfolioItem(id);
    if (!removed) {
      return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/portfolio DELETE] failed", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Delete failed." },
      { status: 500 },
    );
  }
}
