import "server-only";
import { v2 as cloudinary } from "cloudinary";

/**
 * Cloudinary singleton — configured from CLOUDINARY_URL or the split
 * CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET trio. The SDK auto-reads
 * CLOUDINARY_URL when no explicit config is passed; we only set
 * `secure: true` so every returned asset URL is https.
 */
let configured = false;

export function getCloudinary() {
  if (!configured) {
    cloudinary.config({ secure: true });
    configured = true;
  }
  return cloudinary;
}

/** The Cloudinary folder all admin-uploaded media lives in. */
export const MEDIA_FOLDER =
  process.env.CLOUDINARY_FOLDER ?? "kitonga_assets";

/**
 * Optional Cloudinary signed upload preset. When present it must exist
 * in the Cloudinary console and be marked "Signed". When empty/unset
 * the sign route falls back to a pure API-key + signature flow that
 * does not require a preset to exist (recommended default).
 */
export const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET ?? "";

/** Convenience: cloud name for browser-side direct uploads. */
export const CLOUD_NAME =
  process.env.CLOUDINARY_CLOUD_NAME ??
  // Parse from CLOUDINARY_URL=cloudinary://<key>:<secret>@<cloud_name>
  (process.env.CLOUDINARY_URL?.match(/@([\w-]+)$/)?.[1] ?? "");

export const API_KEY =
  process.env.CLOUDINARY_API_KEY ??
  process.env.CLOUDINARY_URL?.match(/^cloudinary:\/\/(\d+):/)?.[1] ??
  "";
