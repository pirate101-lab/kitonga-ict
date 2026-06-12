import { NextRequest, NextResponse } from 'next/server';
import { findAdminByToken } from '@/lib/admin-store';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const STATUS_FILE = path.join(
  process.env.KITONGA_DATA_DIR ?? path.join(process.cwd(), 'data'),
  'bot-status.json'
);

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '') ?? '';
  if (!(await findAdminByToken(token))) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const raw = await fs.readFile(STATUS_FILE, 'utf8');
    const data = JSON.parse(raw);
    return NextResponse.json({ ok: true, ...data });
  } catch {
    return NextResponse.json({
      ok: true,
      status: 'offline',
      linkedNumber: null,
      lastSeen: null,
      portfolioCount: 0,
    });
  }
}
