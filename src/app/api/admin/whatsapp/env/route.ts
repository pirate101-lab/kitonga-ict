import { NextRequest, NextResponse } from 'next/server';
import { findAdminByToken } from '@/lib/admin-store';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const ENV_FILE = path.join(process.cwd(), '.env.local');

export async function PATCH(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '') ?? '';
  const admin = await findAdminByToken(token);
  if (!admin || admin.role !== 'owner') {
    return NextResponse.json({ ok: false, error: 'Owner only' }, { status: 403 });
  }
  const body = (await req.json()) as Record<string, string>;
  const ALLOWED_KEYS = new Set([
    'COMPANION_ALLOWED_NUMBERS',
    'CLOUDINARY_URL',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'COMPANION_DATA_DIR',
    'COMPANION_WA_SESSION_PATH',
    'COMPANION_PAIRING_NUMBER',
  ]);

  let envContent = '';
  try { envContent = await fs.readFile(ENV_FILE, 'utf8'); } catch {}

  for (const [key, value] of Object.entries(body)) {
    if (!ALLOWED_KEYS.has(key)) continue;
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, `${key}=${value}`);
    } else {
      envContent += `\n${key}=${value}`;
    }
  }

  await fs.writeFile(ENV_FILE, envContent, 'utf8');
  return NextResponse.json({ ok: true });
}

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '') ?? '';
  const admin = await findAdminByToken(token);
  if (!admin || admin.role !== 'owner') {
    return NextResponse.json({ ok: false, error: 'Owner only' }, { status: 403 });
  }
  let envContent = '';
  try { envContent = await fs.readFile(ENV_FILE, 'utf8'); } catch {}

  // Parse only the safe keys to return to the client
  const SAFE_KEYS = [
    'COMPANION_ALLOWED_NUMBERS',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'COMPANION_DATA_DIR',
    // Never return CLOUDINARY_API_SECRET or CLOUDINARY_URL in plaintext
  ];
  const result: Record<string, string> = {};
  for (const key of SAFE_KEYS) {
    const match = envContent.match(new RegExp(`^${key}=(.*)$`, 'm'));
    if (match) result[key] = match[1]?.trim() ?? '';
  }
  return NextResponse.json({ ok: true, env: result });
}
