"use client";

/**
 * Browser-side Cloudinary upload helper.
 *
 * 1. Asks our server for a signed upload payload (POST /api/media/sign).
 * 2. POSTs the file directly to Cloudinary using XMLHttpRequest so we
 *    can surface upload progress to the UI.
 *
 * No file ever passes through our Node server, so large posters /
 * banners cannot OOM the kitonga-ict.service runtime.
 */

export type CloudinaryAsset = {
  public_id: string;
  secure_url: string;
  url?: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  resource_type: string;
  created_at: string;
  tags?: string[];
};

export type SignPayload = {
  ok: boolean;
  signature: string;
  timestamp: number;
  api_key: string;
  cloud_name: string;
  upload_preset: string;
  folder: string;
  upload_url: string;
  public_id?: string;
  tags?: string;
};

const TOKEN_KEY = "kitonga.adminToken";

export function getAdminToken(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(TOKEN_KEY) ?? "";
  } catch {
    return "";
  }
}

export function setAdminToken(token: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* ignore */
  }
}

export function clearAdminToken() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

async function fetchSignature(): Promise<SignPayload> {
  const token = getAdminToken();
  const res = await fetch("/api/media/sign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Sign request failed (${res.status}): ${txt}`);
  }
  const data = (await res.json()) as SignPayload;
  if (!data.ok) throw new Error("Sign request returned ok=false.");
  return data;
}

export type UploadProgress = {
  loaded: number;
  total: number;
  percent: number;
};

/**
 * Uploads a single file to Cloudinary. Resolves with the asset metadata.
 * Streams progress via the optional `onProgress` callback so the UI can
 * show a progress bar.
 */
export async function uploadFileToCloudinary(
  file: File,
  onProgress?: (progress: UploadProgress) => void,
): Promise<CloudinaryAsset> {
  const sign = await fetchSignature();

  return new Promise<CloudinaryAsset>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const form = new FormData();
    form.append("file", file);
    form.append("api_key", sign.api_key);
    form.append("timestamp", String(sign.timestamp));
    form.append("signature", sign.signature);
    form.append("folder", sign.folder);
    form.append("upload_preset", sign.upload_preset);
    if (sign.public_id) form.append("public_id", sign.public_id);
    if (sign.tags) form.append("tags", sign.tags);

    xhr.upload.addEventListener("progress", (evt) => {
      if (!onProgress || !evt.lengthComputable) return;
      onProgress({
        loaded: evt.loaded,
        total: evt.total,
        percent: Math.round((evt.loaded / evt.total) * 100),
      });
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const json = JSON.parse(xhr.responseText) as CloudinaryAsset;
          resolve(json);
        } catch (parseErr) {
          reject(parseErr);
        }
      } else {
        reject(new Error(`Cloudinary upload failed (${xhr.status}): ${xhr.responseText}`));
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Network error during upload.")));
    xhr.addEventListener("abort", () => reject(new Error("Upload aborted.")));

    xhr.open("POST", sign.upload_url);
    xhr.send(form);
  });
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  const token = getAdminToken();
  const res = await fetch("/api/media/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ public_id: publicId }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Delete failed (${res.status}): ${txt}`);
  }
  const data = (await res.json()) as { ok: boolean; result?: { result?: string } };
  if (!data.ok) {
    throw new Error(`Cloudinary returned: ${data.result?.result ?? "unknown"}`);
  }
}

export async function listCloudinaryAssets(): Promise<CloudinaryAsset[]> {
  const token = getAdminToken();
  const res = await fetch("/api/media/list", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) {
    return [];
  }
  const data = (await res.json()) as { ok: boolean; items: CloudinaryAsset[] };
  return data.items ?? [];
}
