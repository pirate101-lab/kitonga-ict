import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function run() {
  console.log('Listing resources...');
  try {
    const result = await cloudinary.api.resources();
    console.log(result.resources.map(r => r.public_id));
  } catch (err) {
    console.error('Error listing cloudinary:', err);
  }
}

run();
