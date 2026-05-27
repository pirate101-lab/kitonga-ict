"use client";

import { useRef, useState } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  uploadFileToCloudinary,
  deleteFromCloudinary,
  type UploadProgress,
} from "@/lib/cloudinary-client";

type Props = {
  /** Current image — typically the secure_url returned by Cloudinary. */
  value?: string;
  /**
   * Public-id of the current image. When supplied and the user clicks
   * "Remove", the asset is also deleted from Cloudinary; otherwise only
   * the local reference is cleared.
   */
  publicId?: string;
  /**
   * Callback invoked with the new asset (or undefined when cleared).
   * The caller is expected to persist `url` and `publicId` together.
   */
  onChange: (next: { url: string; publicId: string } | undefined) => void;
  label?: string;
  aspectHint?: string;
};

/**
 * Admin image uploader — Cloudinary-backed.
 *
 * The previous implementation converted the file to a base64 data URI
 * stored in localStorage. This version uploads the file directly to
 * Cloudinary using a signed upload signature minted by /api/media/sign,
 * so large posters / banners never touch our Node server.
 *
 * Backward compatibility note: callers that previously stored a raw
 * URL (or even a stale base64 data: URI) in localStorage will still
 * render fine — the preview <img> accepts any src.
 */
export function ImageUploader({
  value,
  publicId,
  onChange,
  label,
  aspectHint,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are accepted.");
      return;
    }
    setUploading(true);
    setProgress(0);
    try {
      const asset = await uploadFileToCloudinary(file, (p: UploadProgress) =>
        setProgress(p.percent),
      );
      onChange({ url: asset.secure_url, publicId: asset.public_id });
      toast.success("Image uploaded.");
    } catch (err) {
      console.error("[ImageUploader] upload failed", err);
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }

  async function handleRemove() {
    if (publicId) {
      try {
        await deleteFromCloudinary(publicId);
      } catch (err) {
        console.error("[ImageUploader] delete failed", err);
        toast.warning(
          "Removed locally, but Cloudinary delete failed. You can clear stale assets from Admin → Media.",
        );
      }
    }
    onChange(undefined);
  }

  return (
    <div className="grid gap-2">
      {label && (
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </p>
      )}

      {value ? (
        /* ── Preview mode ── */
        <div className="relative overflow-hidden rounded-xl border border-card-border bg-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            className="w-full object-cover"
            style={{ maxHeight: 220 }}
          />
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove image"
            disabled={uploading}
            className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-50"
          >
            <X size={14} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 rounded-lg bg-card px-2.5 py-1.5 text-[11px] font-bold text-foreground border border-card-border hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 size={12} className="animate-spin" aria-hidden />
                {progress}%
              </>
            ) : (
              <>
                <Upload size={12} aria-hidden /> Replace
              </>
            )}
          </button>
        </div>
      ) : (
        /* ── Drop zone ── */
        <button
          type="button"
          onClick={() => !uploading && inputRef.current?.click()}
          onDragEnter={() => !uploading && setDragging(true)}
          onDragLeave={() => setDragging(false)}
          onDragOver={(e) => {
            e.preventDefault();
            if (!uploading) setDragging(true);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            if (!uploading) handleFiles(e.dataTransfer.files);
          }}
          disabled={uploading}
          className={`flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 transition-colors disabled:cursor-not-allowed ${
            dragging
              ? "border-primary bg-secondary"
              : "border-border-strong hover:border-primary"
          }`}
        >
          <span className="grid h-11 w-11 place-items-center rounded-xl border border-card-border bg-card">
            {uploading ? (
              <Loader2 size={20} className="animate-spin text-primary" aria-hidden />
            ) : (
              <ImageIcon size={20} className="text-muted-foreground" aria-hidden />
            )}
          </span>
          <span className="text-sm font-semibold text-foreground">
            {uploading ? (
              <>Uploading… {progress}%</>
            ) : (
              <>
                Click to upload <span className="text-primary">or drag & drop</span>
              </>
            )}
          </span>
          {uploading && (
            <div className="w-3/4 h-1.5 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full bg-primary transition-[width] duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
          {aspectHint && !uploading && (
            <span className="text-[11px] font-mono text-muted-foreground">
              Recommended ratio {aspectHint} · JPG / PNG / WebP
            </span>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
