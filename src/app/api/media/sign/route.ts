import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  getCloudinary,
  MEDIA_FOLDER,
  UPLOAD_PRESET,
  CLOUD_NAME,
  API_KEY,
} from "@/lib/cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/media/sign
 * Body (optional): { folder?: string, public_id?: string, tags?: string[] }
 *
 * Returns a one-shot signed payload the browser uses to POST a file
 * directly to Cloudinary. The Node server NEVER buffers the file —
 * this avoids OOM crashes on large posters / banners.
 *
 * Response shape:
 *   {
 *     ok: true,
 *     signature: string,
 *     timestamp: number,
 *     api_key: string,
 *     cloud_name: string,
 *     upload_preset: string,
 *     folder: string,
 *     upload_url: string
 *   }
 */
export async function POST(req: Request) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    const body = (await req.json().catch(() => ({}))) as {
      folder?: string;
      public_id?: string;
      tags?: string[];
    };

    const folder = body?.folder?.trim() || MEDIA_FOLDER;
    const tags = Array.isArray(body?.tags) ? body!.tags!.join(",") : undefined;

    const timestamp = Math.round(Date.now() / 1000);

    // Params signed must match exactly what the browser sends.
    // upload_preset is optional — only signed when configured + present
    // in the Cloudinary console; otherwise we use API-key + signature.
    const paramsToSign: Record<string, string | number> = {
      timestamp,
      folder,
    };
    if (UPLOAD_PRESET) paramsToSign.upload_preset = UPLOAD_PRESET;
    if (body?.public_id) paramsToSign.public_id = body.public_id;
    if (tags) paramsToSign.tags = tags;

    const cld = getCloudinary();
    const signature = cld.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET ??
        process.env.CLOUDINARY_URL?.match(/:([^@]+)@/)?.[1] ??
        "",
    );

    return NextResponse.json({
      ok: true,
      signature,
      timestamp,
      api_key: API_KEY,
      cloud_name: CLOUD_NAME,
      upload_preset: UPLOAD_PRESET || undefined,
      folder,
      tags,
      public_id: body?.public_id,
      upload_url: `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
    });
  } catch (err) {
    console.error("[/api/media/sign] failed", err);
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Sign request failed.",
      },
      { status: 500 },
    );
  }
}
