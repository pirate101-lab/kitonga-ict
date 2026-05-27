"use client";

import { AdminPage } from "@/components/admin/AdminPage";
import { MediaManager } from "@/components/admin/MediaManager";

export default function AdminMediaPage() {
  return (
    <AdminPage
      eyebrow="Media library"
      title="Cloudinary Media Manager"
      description="Drop images to upload directly to the kitonga_assets folder. Hover any tile to copy its public URL or delete it permanently."
    >
      <MediaManager />
    </AdminPage>
  );
}
