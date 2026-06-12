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
  console.log('Deleting placeholder resources...');
  try {
    const resources = [
      'main-sample',
      'cld-sample-5',
      'cld-sample-4',
      'cld-sample-3',
      'cld-sample-2',
      'cld-sample',
      'samples/waves',
      'samples/radial_02',
      'samples/paper',
      'samples/radial'
    ];
    const result = await cloudinary.api.delete_resources(resources);
    console.log(result);
  } catch (err) {
    console.error('Error listing cloudinary:', err);
  }
}

run();
