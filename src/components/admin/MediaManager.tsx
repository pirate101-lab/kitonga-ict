"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Copy,
  Loader2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  uploadFileToCloudinary,
  deleteFromCloudinary,
  listCloudinaryAssets,
  type CloudinaryAsset,
} from "@/lib/cloudinary-client";

type UploadingItem = {
  id: string;
  name: string;
  percent: number;
};

/**
 * Cloudinary-backed Media Manager.
 *
 * Drop zone (top) + responsive grid (below). All uploads stream
 * directly to Cloudinary using the signed-upload signature minted
 * by /api/media/sign — the Node server is never a memory bottleneck.
 *
 * Every async call is wrapped in try/catch with a sonner toast for
 * success / failure.
 */
export function MediaManager() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [assets, setAssets] = useState<CloudinaryAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [uploads, setUploads] = useState<UploadingItem[]>([]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const items = await listCloudinaryAssets();
      setAssets(items);
    } catch (err) {
      console.error("[MediaManager] list failed", err);
      toast.error(err instanceof Error ? err.message : "Could not load media library.");
      setAssets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    const queue = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (queue.length === 0) {
      toast.error("Only image files are accepted.");
      return;
    }

    // Upload sequentially so progress is easy to follow.
    for (const file of queue) {
      const id = `${Date.now()}-${file.name}`;
      setUploads((u) => [...u, { id, name: file.name, percent: 0 }]);

      try {
        const asset = await uploadFileToCloudinary(file, (p) => {
          setUploads((u) =>
            u.map((it) => (it.id === id ? { ...it, percent: p.percent } : it)),
          );
        });
        setAssets((prev) => [asset, ...prev]);
        toast.success(`Uploaded ${file.name}.`);
      } catch (err) {
        console.error("[MediaManager] upload failed", err);
        toast.error(
          `${file.name}: ${err instanceof Error ? err.message : "upload failed"}`,
        );
      } finally {
        setUploads((u) => u.filter((it) => it.id !== id));
      }
    }
  }

  async function handleCopy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copied to clipboard.");
    } catch (err) {
      console.error("[MediaManager] clipboard failed", err);
      toast.error("Could not copy. Long-press the URL field to copy manually.");
    }
  }

  async function handleDelete(asset: CloudinaryAsset) {
    const confirmed = window.confirm(
      `Permanently delete this image from Cloudinary?\n\n${asset.public_id}`,
    );
    if (!confirmed) return;

    // Optimistic removal.
    const previous = assets;
    setAssets((prev) => prev.filter((a) => a.public_id !== asset.public_id));

    try {
      await deleteFromCloudinary(asset.public_id);
      toast.success("Deleted.");
    } catch (err) {
      console.error("[MediaManager] delete failed", err);
      toast.error(err instanceof Error ? err.message : "Delete failed.");
      // Roll back the optimistic removal so the user can retry.
      setAssets(previous);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── Drop zone ── */}
      <div
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`relative rounded-2xl border-2 border-dashed bg-card p-8 transition-colors ${
          dragging ? "border-primary bg-secondary" : "border-border-strong"
        }`}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-2xl border border-card-border bg-card">
            <Upload size={20} className="text-primary" aria-hidden />
          </span>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-foreground">
              Drop images here, or{" "}
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="text-primary underline-offset-4 hover:underline"
              >
                click to browse
              </button>
            </p>
            <p className="text-xs text-muted-foreground">
              JPG · PNG · WebP · uploads stream directly to Cloudinary
            </p>
          </div>
        </div>

        {/* Active upload list */}
        {uploads.length > 0 && (
          <ul className="mt-5 flex flex-col gap-2">
            {uploads.map((u) => (
              <li
                key={u.id}
                className="flex items-center gap-3 rounded-xl border border-card-border bg-card px-3 py-2"
              >
                <Loader2 size={14} className="animate-spin text-primary" aria-hidden />
                <span className="flex-1 truncate text-[12px] font-medium text-foreground">
                  {u.name}
                </span>
                <div className="hidden sm:block w-32 h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full bg-primary transition-[width] duration-150"
                    style={{ width: `${u.percent}%` }}
                  />
                </div>
                <span className="w-10 text-right text-[11px] font-mono text-muted-foreground">
                  {u.percent}%
                </span>
              </li>
            ))}
          </ul>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => {
            handleFiles(e.target.files);
            // Reset so the same file can be re-selected after delete.
            e.currentTarget.value = "";
          }}
        />
      </div>

      {/* ── Library grid ── */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">
          Library{" "}
          <span className="ml-1 font-mono text-muted-foreground">
            ({assets.length})
          </span>
        </h2>
        <button
          type="button"
          onClick={refresh}
          className="text-xs font-semibold text-primary hover:underline"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="grid place-items-center rounded-xl border border-card-border bg-card py-16">
          <Loader2 size={20} className="animate-spin text-primary" aria-hidden />
          <p className="mt-2 text-xs text-muted-foreground">Loading library…</p>
        </div>
      ) : assets.length === 0 ? (
        <div className="grid place-items-center rounded-xl border border-card-border bg-card py-16 text-center">
          <ImageIcon size={28} className="text-muted-foreground" aria-hidden />
          <p className="mt-3 text-sm font-semibold text-foreground">
            No assets yet
          </p>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            Drop a file above to upload your first image to the kitonga_assets
            folder.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {assets.map((asset) => (
            <MediaCard key={asset.public_id} asset={asset} onCopy={handleCopy} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

function MediaCard({
  asset,
  onCopy,
  onDelete,
}: {
  asset: CloudinaryAsset;
  onCopy: (url: string) => void;
  onDelete: (asset: CloudinaryAsset) => void;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-card-border bg-card">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset.secure_url}
        alt={asset.public_id}
        className="aspect-square w-full object-cover"
        loading="lazy"
      />

      {/* Hover overlay */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center bg-foreground/0 opacity-0 transition group-hover:bg-foreground/80 group-hover:opacity-100">
        <div className="pointer-events-auto flex flex-col gap-2 p-3 text-xs">
          <button
            type="button"
            onClick={() => onCopy(asset.secure_url)}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-primary bg-card px-2.5 py-1.5 font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
          >
            <Copy size={12} aria-hidden /> Copy URL
          </button>
          <button
            type="button"
            onClick={() => onDelete(asset)}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-destructive bg-card px-2.5 py-1.5 font-semibold text-destructive transition hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 size={12} aria-hidden /> Delete
          </button>
        </div>
      </div>

      {/* Foot meta */}
      <div className="flex items-center justify-between gap-2 border-t border-card-border bg-card px-2.5 py-1.5">
        <span className="truncate text-[11px] font-medium text-foreground">
          {asset.public_id.split("/").pop()}
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">
          {Math.round(asset.bytes / 1024)} KB
        </span>
      </div>
    </div>
  );
}

// Re-export X icon so the consumer can use it for empty-state buttons if needed.
export { X };
