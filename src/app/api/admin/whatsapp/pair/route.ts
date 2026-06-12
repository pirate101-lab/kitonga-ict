import { NextRequest, NextResponse } from 'next/server';
import { findAdminByToken } from '@/lib/admin-store';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const DATA_DIR = process.env.KITONGA_DATA_DIR ?? path.join(process.cwd(), 'data');
const CMD_FILE = path.join(DATA_DIR, 'bot-cmd.json');

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '') ?? '';
  if (!(await findAdminByToken(token))) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  const body = (await req.json().catch(() => ({}))) as { phone?: string };
  const phone = body.phone?.trim();
  if (!phone) {
    return NextResponse.json({ ok: false, error: 'phone is required (e.g. 254715927114)' }, { status: 400 });
  }
  await fs.mkdir(DATA_DIR, { recursive: true });
  const cmd = { cmd: 'pair-code', phone, requestedAt: new Date().toISOString() };
  const tmp = `${CMD_FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(cmd, null, 2), 'utf8');
  await fs.rename(tmp, CMD_FILE);
  return NextResponse.json({
    ok: true,
    message: 'Pairing code request queued. The bot will process it within ~4 seconds and the code will appear in the status panel.',
  });
}
