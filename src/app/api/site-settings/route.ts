import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  readSiteSettings,
  writeSiteSettings,
  type SiteSocialLinks,
} from "@/lib/site-settings-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/site-settings
 *
 * Public — returns the current site-settings (social URLs etc.). The
 * Footer consumes this directly via `readSiteSettings()` on the server,
 * but this route also exists so a client component (e.g. an admin
 * panel) can call it via fetch.
 */
export async function GET() {
  try {
    const settings = await readSiteSettings();
    return NextResponse.json({ ok: true, settings });
  } catch (err) {
    console.error("[/api/site-settings GET] failed", err);
    return NextResponse.json(
      { ok: false, error: "Could not load site settings." },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/site-settings
 * Body: { whatsapp?: string, tiktok?: string }
 *
 * Admin-only. Persists the supplied social URLs to `data/site-settings.json`
 * and returns the updated record. Empty / missing fields keep their
 * existing values.
 */
export async function PATCH(req: Request) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  let body: { whatsapp?: unknown; tiktok?: unknown } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const patch: Partial<SiteSocialLinks> = {};
  if (typeof body.whatsapp === "string") patch.whatsapp = body.whatsapp;
  if (typeof body.tiktok === "string") patch.tiktok = body.tiktok;

  try {
    const settings = await writeSiteSettings(patch);
    return NextResponse.json({ ok: true, settings });
  } catch (err) {
    console.error("[/api/site-settings PATCH] failed", err);
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Save failed.",
      },
      { status: 500 },
    );
  }
}
