import { NextRequest, NextResponse } from 'next/server';
import { findAdminByToken } from '@/lib/admin-store';
import { promises as fs } from 'node:fs';
import path from 'node:path';

export async function DELETE(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '') ?? '';
  const admin = await findAdminByToken(token);
  if (!admin) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const envFile = path.join(process.cwd(), '.env');
  let envContent = '';
  try { envContent = await fs.readFile(envFile, 'utf8'); } catch {}

  const match = envContent.match(/^COMPANION_WA_SESSION_PATH=(.*)$/m);
  const sessionPath = match?.[1]?.trim()
    ?? path.join(process.cwd(), 'whatsapp-companion', '.wwebjs_auth');

  try {
    await fs.rm(sessionPath, { recursive: true, force: true });
  } catch {
    // already gone
  }

  // Clear the bot status file so the UI shows offline immediately
  const statusFile = path.join(
    process.env.KITONGA_DATA_DIR ?? path.join(process.cwd(), 'data'),
    'bot-status.json'
  );
  try { await fs.unlink(statusFile); } catch {}

  return NextResponse.json({ ok: true, message: 'Session reset. Restart the bot to re-scan QR.' });
}
