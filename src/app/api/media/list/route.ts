import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getCloudinary, MEDIA_FOLDER } from "@/lib/cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CloudinaryResource = {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  bytes: number;
  created_at: string;
  folder?: string;
  tags?: string[];
};

/**
 * GET /api/media/list?cursor=<next_cursor>
 *
 * Returns all assets under MEDIA_FOLDER (kitonga_assets). Cursored so the
 * grid can lazy-load. Returns `{ ok: true, items: [], next_cursor: null }`
 * even on Cloudinary failure so the UI never crashes.
 */
export async function GET(req: Request) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    const url = new URL(req.url);
    const cursor = url.searchParams.get("cursor") ?? undefined;

    const cld = getCloudinary();
    const result = await cld.api.resources({
      type: "upload",
      prefix: MEDIA_FOLDER,
      max_results: 60,
      next_cursor: cursor,
      direction: "desc",
    });

    const resources = (result.resources ?? []) as CloudinaryResource[];
    const items = resources.map((r) => ({
      public_id: r.public_id,
      secure_url: r.secure_url ?? r.url,
      width: r.width,
      height: r.height,
      format: r.format,
      bytes: r.bytes,
      created_at: r.created_at,
      tags: r.tags ?? [],
    }));

    return NextResponse.json({
      ok: true,
      items,
      next_cursor: result.next_cursor ?? null,
    });
  } catch (err) {
    console.error("[/api/media/list] failed — returning empty array", err);
    return NextResponse.json({
      ok: true,
      items: [],
      next_cursor: null,
      warning:
        err instanceof Error
          ? err.message
          : "Could not reach Cloudinary; showing empty list.",
    });
  }
}
