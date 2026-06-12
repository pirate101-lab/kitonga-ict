import { NextRequest, NextResponse } from 'next/server';
import { findAdminByToken } from '@/lib/admin-store';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import QRCode from 'qrcode';

const DATA_DIR = process.env.KITONGA_DATA_DIR ?? path.join(process.cwd(), 'data');
const QR_FILE  = path.join(DATA_DIR, 'bot-qr.json');

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '') ?? '';
  if (!(await findAdminByToken(token))) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const raw  = await fs.readFile(QR_FILE, 'utf8');
    const data = JSON.parse(raw) as { qr: string; generatedAt: string };
    const dataUrl = await QRCode.toDataURL(data.qr, {
      width: 256,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    });
    return NextResponse.json({ ok: true, dataUrl, generatedAt: data.generatedAt });
  } catch {
    return NextResponse.json({ ok: true, dataUrl: null, generatedAt: null });
  }
}
