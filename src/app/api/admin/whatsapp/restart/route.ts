import { NextRequest, NextResponse } from 'next/server';
import { findAdminByToken } from '@/lib/admin-store';
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '') ?? '';
  const admin = await findAdminByToken(token);
  if (!admin || admin.role !== 'owner') {
    return NextResponse.json({ ok: false, error: 'Owner only' }, { status: 403 });
  }

  try {
    await execAsync('pm2 restart wa-companion || pm2 start /srv/kitonga-ict/whatsapp-companion/bot.js --name wa-companion');
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: 'Failed to restart bot' }, { status: 500 });
  }
}
