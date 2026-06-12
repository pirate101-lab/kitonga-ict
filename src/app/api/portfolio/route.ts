import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  readPortfolio,
  upsertPortfolioItem,
  type PortfolioRecord,
} from "@/lib/portfolio-db";
import { genId } from "@/lib/adminStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/portfolio
 * Public read of the portfolio collection. Returns `{ items: [] }` even
 * on filesystem errors so the public grid never crashes.
 */
export async function GET() {
  try {
    const items = await readPortfolio();
    return NextResponse.json({ ok: true, items });
  } catch (err) {
    console.error("[/api/portfolio GET] failed", err);
    return NextResponse.json({ ok: true, items: [] });
  }
}

/**
 * POST /api/portfolio
 * Admin-only. Creates or replaces a portfolio item by id. When `id` is
 * absent a new id is generated.
 */
export async function POST(req: Request) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  try {
    const body = (await req.json().catch(() => ({}))) as Partial<PortfolioRecord>;
    const id = body.id?.trim() || genId("p");
    const created = await upsertPortfolioItem({ ...body, id });
    return NextResponse.json({ ok: true, item: created });
  } catch (err) {
    console.error("[/api/portfolio POST] failed", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Write failed." },
      { status: 500 },
    );
  }
}
