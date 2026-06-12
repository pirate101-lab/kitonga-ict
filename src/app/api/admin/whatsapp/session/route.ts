import { NextRequest, NextResponse } from 'next/server';
import { findAdminByToken } from '@/lib/admin-store';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const DATA_DIR = process.env.KITONGA_DATA_DIR ?? path.join(process.cwd(), 'data');

export async function DELETE(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '') ?? '';
  if (!(await findAdminByToken(token))) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  // Read session path from .env.local
  const envFile = path.join(process.cwd(), '.env.local');
  let envContent = '';
  try { envContent = await fs.readFile(envFile, 'utf8'); } catch {}
  const match = envContent.match(/^COMPANION_WA_SESSION_PATH=(.*)$/m);
  const sessionPath = match?.[1]?.trim()
    ?? path.join(process.cwd(), 'whatsapp-companion', '.wwebjs_auth');

  // Delete session folder
  try { await fs.rm(sessionPath, { recursive: true, force: true }); } catch {}

  // Delete QR + status + cmd files so dashboard reflects clean state
  try { await fs.unlink(path.join(DATA_DIR, 'bot-qr.json')); } catch {}
  try { await fs.unlink(path.join(DATA_DIR, 'bot-status.json')); } catch {}
  try { await fs.unlink(path.join(DATA_DIR, 'bot-cmd.json')); } catch {}

  return NextResponse.json({
    ok: true,
    message: 'Session reset. Restart the bot (pm2 restart wa-companion) to get a fresh QR code.',
  });
}
