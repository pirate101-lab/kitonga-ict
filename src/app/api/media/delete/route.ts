import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getCloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/media/delete
 * Body: { public_id: string, resource_type?: "image" | "video" | "raw" }
 *
 * Permanently removes the asset from Cloudinary and invalidates the CDN
 * cache. Returns the underlying Cloudinary `result` field so the caller
 * can confirm "ok" / "not found".
 */
export async function POST(req: Request) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    const body = (await req.json().catch(() => ({}))) as {
      public_id?: string;
      resource_type?: "image" | "video" | "raw";
    };

    const publicId = body?.public_id?.trim();
    if (!publicId) {
      return NextResponse.json(
        { ok: false, error: "Missing public_id." },
        { status: 400 },
      );
    }

    const cld = getCloudinary();
    const result = await cld.uploader.destroy(publicId, {
      invalidate: true,
      resource_type: body?.resource_type ?? "image",
    });

    // Cloudinary returns { result: 'ok' | 'not found' }
    return NextResponse.json({ ok: result.result === "ok", result });
  } catch (err) {
    console.error("[/api/media/delete] failed", err);
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Delete failed.",
      },
      { status: 500 },
    );
  }
}
