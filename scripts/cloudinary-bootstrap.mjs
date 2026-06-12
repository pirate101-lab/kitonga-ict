import { v2 as cloudinary } from "cloudinary";

cloudinary.config({ secure: true });
const NAME = process.env.CLOUDINARY_UPLOAD_PRESET || "kitonga_media";
const FOLDER = process.env.CLOUDINARY_FOLDER || "kitonga_assets";

const settings = {
  folder: FOLDER,
  allowed_formats: "jpg,jpeg,png,gif,webp,avif,svg,bmp,tiff,heic,heif,pdf",
  resource_type: "auto",
  use_filename: true,
  unique_filename: true,
  overwrite: false,
  invalidate: true,
  tags: "kitonga-admin",
};

try {
  const existing = await cloudinary.api.upload_preset(NAME).catch(() => null);
  if (existing) {
    console.log(`Preset ${NAME} exists. Updating settings...`);
    const updated = await cloudinary.api.update_upload_preset(NAME, {
      unsigned: false,
      ...settings,
    });
    console.log("Updated:", JSON.stringify(updated, null, 2));
  } else {
    console.log(`Creating signed preset ${NAME}...`);
    const created = await cloudinary.api.create_upload_preset({
      name: NAME,
      unsigned: false,
      ...settings,
    });
    console.log("Created:", JSON.stringify(created, null, 2));
  }
} catch (err) {
  console.error("Bootstrap failed:", err);
  process.exit(1);
}
