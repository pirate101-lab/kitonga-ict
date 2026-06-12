/**
 * uploader.js — Cloudinary upload logic
 * ESM, Node 20+
 */
import { Readable } from 'node:stream';
import cloudinary from 'cloudinary';

const { v2: cld } = cloudinary;

/**
 * Call once at bot startup after env is loaded.
 * Reads from:
 *   CLOUDINARY_URL            (takes precedence)
 *   or CLOUDINARY_CLOUD_NAME + CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET
 */
export function initCloudinary() {
  if (process.env.CLOUDINARY_URL) {
    // SDK auto-configures from CLOUDINARY_URL
    cld.config({ secure: true });
  } else {
    cld.config({
      cloud_name:  process.env.CLOUDINARY_CLOUD_NAME,
      api_key:     process.env.CLOUDINARY_API_KEY,
      api_secret:  process.env.CLOUDINARY_API_SECRET,
      secure:      true,
    });
  }
}

/**
 * Uploads a base64-encoded image buffer to Cloudinary.
 *
 * @param {string} base64Data   Raw base64 string (no data URI prefix).
 * @param {string} folder       Cloudinary folder, e.g. 'kitonga_assets'.
 * @param {string[]} tags       Optional tags array.
 * @returns {Promise<{ secure_url: string, public_id: string }>}
 */
export async function uploadBase64ToCloudinary(base64Data, folder = 'kitonga_assets', tags = []) {
  const buffer = Buffer.from(base64Data, 'base64');

  return new Promise((resolve, reject) => {
    const stream = cld.uploader.upload_stream(
      { folder, resource_type: 'auto', tags },
      (error, result) => {
        if (error) return reject(error);
        resolve({ secure_url: result.secure_url, public_id: result.public_id });
      }
    );
    const readable = new Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);
    readable.pipe(stream);
  });
}
