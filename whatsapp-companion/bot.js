/**
 * bot.js — WhatsApp Companion Bot for Kitonga-ICT
 * ESM, Node 20+
 *
 * First run:    node bot.js             (shows QR in terminal AND writes to data/bot-qr.json)
 * Production:   pm2 start bot.js --name wa-companion
 *
 * PAIRING MODES:
 *   1. QR Code — default. Scan the QR shown in the admin dashboard.
 *   2. 8-digit code — admin enters their phone number in the dashboard,
 *      dashboard POSTs /api/admin/whatsapp/pair, bot polls bot-cmd.json,
 *      calls client.requestPairingCode(phone), writes code to bot-status.json.
 */
import path from 'node:path';
import { promises as fs } from 'node:fs';
import { statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load root .env.local
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

// Ensure required companion env keys exist
await ensureEnvKeys(path.resolve(__dirname, '..', '.env.local'), {
  COMPANION_ALLOWED_NUMBERS: '254715927114',
  COMPANION_DATA_DIR:        path.resolve(__dirname, '..', 'data'),
  COMPANION_WA_SESSION_PATH: path.join(__dirname, '.wwebjs_auth'),
});

// Reload after mutation
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local'), override: true });

// whatsapp-web.js is CommonJS; use createRequire in ESM
const require = createRequire(import.meta.url);
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcodeTerminal = require('qrcode-terminal');

import { initCloudinary, uploadBase64ToCloudinary } from './uploader.js';
import { appendPortfolioItem, getPortfolioCount }  from './portfolio.js';
import { parseCaption }                             from './commands.js';

initCloudinary();

const DATA_DIR = process.env.COMPANION_DATA_DIR
  ? path.resolve(process.env.COMPANION_DATA_DIR)
  : path.resolve(__dirname, '..', 'data');

const QR_FILE     = path.join(DATA_DIR, 'bot-qr.json');
const STATUS_FILE = path.join(DATA_DIR, 'bot-status.json');
const CMD_FILE    = path.join(DATA_DIR, 'bot-cmd.json');

/** Allowed sender whitelist — comma-separated E.164 digits, no "+" */
const ALLOWED = new Set(
  (process.env.COMPANION_ALLOWED_NUMBERS ?? '')
    .split(',')
    .map(n => n.trim())
    .filter(Boolean)
);

const SESSION_PATH = process.env.COMPANION_WA_SESSION_PATH
  ?? path.join(__dirname, '.wwebjs_auth');

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: SESSION_PATH }),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--disable-gpu',
    ],
  },
});

// ── QR event: write to file for browser display ─────────────────────────────
client.on('qr', async (qr) => {
  // 1. Show in terminal
  console.log('\n📱  QR Code (scan with WhatsApp OR use admin dashboard):');
  qrcodeTerminal.generate(qr, { small: true });

  // 2. Write QR data to file so the admin dashboard can render it as <img>
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await atomicWrite(QR_FILE, JSON.stringify({
      qr,
      generatedAt: new Date().toISOString(),
    }));
    console.log('📄  QR written to', QR_FILE);
  } catch (e) {
    console.error('Failed to write QR:', e.message);
  }

  // 3. Update status
  await writeStatus({ status: 'awaiting-pairing', pairingCode: null, qr });

  // 4. Check for pending 8-digit pairing command from admin dashboard
  try {
    const cmd = await readCmd();
    if (cmd?.cmd === 'pair-code' && cmd.phone) {
      console.log(`📲  Requesting 8-digit pairing code for ${cmd.phone}...`);
      const code = await client.requestPairingCode(cmd.phone);
      console.log(`🔑  Pairing code: ${code}`);
      await writeStatus({
        status: 'pairing',
        pairingCode: code,
        pairingPhone: cmd.phone,
        pairingCodeAt: new Date().toISOString(),
      });
      await clearCmd();
    }
  } catch (e) {
    console.error('Pairing code error:', e.message);
  }
});

// ── Ready ─────────────────────────────────────────────────────────────────────
client.on('ready', async () => {
  const info = client.info;
  console.log('✅  WhatsApp bot is ready.');
  console.log(`   Linked: ${info?.wid?.user ?? 'unknown'} (${info?.pushname ?? 'unknown'})`);

  // Clear the QR file — no longer needed
  try { await fs.unlink(QR_FILE); } catch {}

  const count = await getPortfolioCount();
  await writeStatus({
    status: 'online',
    linkedNumber: info?.wid?.user ?? null,
    displayName: info?.pushname ?? null,
    lastSeen: new Date().toISOString(),
    pairingCode: null,
    pairingPhone: null,
    qr: null,
    portfolioCount: count,
  });
});

client.on('auth_failure', async (msg) => {
  console.error('❌  Auth failure:', msg);
  await writeStatus({ status: 'auth-failed', authError: msg });
});

client.on('disconnected', async (reason) => {
  console.warn('⚠️   Bot disconnected:', reason);
  await writeStatus({ status: 'offline', disconnectedAt: new Date().toISOString() });
});

client.on('message', async (message) => {
  try { await handleMessage(message); }
  catch (err) { console.error('Error handling message:', err); }
});

// ── Poll for pair-code command every 4s ──────────────────────────────────────
setInterval(async () => {
  try {
    const cmd = await readCmd();
    if (!cmd || cmd.cmd !== 'pair-code' || !cmd.phone) return;
    // Only request if we haven't already done it for this phone
    const status = await readStatus();
    if (status?.pairingCode && status?.pairingPhone === cmd.phone) return;
    console.log(`📲  [poll] Requesting pairing code for ${cmd.phone}...`);
    const code = await client.requestPairingCode(cmd.phone);
    console.log(`🔑  [poll] Pairing code: ${code}`);
    await writeStatus({
      status: 'pairing',
      pairingCode: code,
      pairingPhone: cmd.phone,
      pairingCodeAt: new Date().toISOString(),
    });
    await clearCmd();
  } catch { /* ignore — client might not be ready */ }
}, 4000);

// ── Watch .env.local and auto-restart on changes ─────────────────────────────
const envPath = path.resolve(__dirname, '..', '.env.local');
let lastMtime = 0;
try { lastMtime = statSync(envPath).mtimeMs; } catch {}

setInterval(() => {
  try {
    const currentMtime = statSync(envPath).mtimeMs;
    if (lastMtime && currentMtime > lastMtime) {
      console.log(`\n🔄 .env.local changed. Auto-restarting...`);
      process.exit(0);
    }
  } catch {}
}, 2000);

// ── Message handler ───────────────────────────────────────────────────────────
async function handleMessage(message) {
  const from   = message.from;
  const number = from.split('@')[0];
  if (!ALLOWED.has(number)) return;

  const hasMedia = message.hasMedia;
  const caption  = hasMedia ? (message.body ?? '') : message.body;
  const parsed   = parseCaption(caption);
  if (!parsed) return;

  // !status
  if (parsed.cmd === 'status') {
    const count = await getPortfolioCount();
    await message.reply(
      `📊  *Kitonga-ICT Bot Status*\n\n` +
      `• Portfolio entries: ${count}\n` +
      `• Cloudinary folder: kitonga_assets\n` +
      `• Bot status: ✅ Online\n` +
      `• Allowed: ${[...ALLOWED].join(', ')}\n\n` +
      `*Commands:*\n` +
      `/portfolio [cat] [title] — upload to custom category\n` +
      `/photoshop [title] — Photo Compositing\n` +
      `/flyer [title] — Posters & Flyers\n` +
      `/cv [title] — Resumes & CVs\n` +
      `/cards [title] — Business Cards\n` +
      `!status — show this menu`
    );
    return;
  }

  if (!hasMedia) {
    await message.reply('⚠️  Please send an image with the caption command.\n\nAvailable commands:\n/photoshop [title]\n/flyer [title]\n/cv [title]\n/cards [title]\n/portfolio [category] [title]\n!status — full menu');
    return;
  }

  await message.reply('⏳  Uploading to Cloudinary...');

  const media = await message.downloadMedia();
  if (!media?.data) {
    await message.reply('❌  Could not download media. Please try again.');
    return;
  }

  let uploadResult;
  try {
    uploadResult = await uploadBase64ToCloudinary(media.data, 'kitonga_assets', [parsed.category, 'bot-upload']);
  } catch (uploadErr) {
    console.error('Cloudinary upload error:', uploadErr);
    await message.reply('❌  Cloudinary upload failed. Check bot logs.');
    return;
  }

  let record;
  try {
    record = await appendPortfolioItem({
      title:    parsed.title,
      category: parsed.category,
      imageUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      tags:     [parsed.category, 'bot-upload'],
    });
  } catch (writeErr) {
    console.error('Portfolio write error:', writeErr);
    await message.reply(`✅  Uploaded to Cloudinary but portfolio write failed.\nURL: ${uploadResult.secure_url}`);
    return;
  }

  const count = await getPortfolioCount();
  await writeStatus({ lastUpload: record.title, portfolioCount: count, lastSeen: new Date().toISOString() });

  await message.reply(
    `✅  *Done!*\n\n` +
    `• Title: ${record.title}\n` +
    `• Category: ${record.category}\n` +
    `• ID: ${record.id}\n` +
    `• URL: ${uploadResult.secure_url}`
  );
}

// ── File helpers ──────────────────────────────────────────────────────────────
async function atomicWrite(file, data) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  await fs.writeFile(tmp, data, 'utf8');
  await fs.rename(tmp, file);
}

async function writeStatus(patch) {
  let current = {};
  try { current = JSON.parse(await fs.readFile(STATUS_FILE, 'utf8')); } catch {}
  const next = { ...current, ...patch, updatedAt: new Date().toISOString() };
  await atomicWrite(STATUS_FILE, JSON.stringify(next, null, 2));
}

async function readStatus() {
  try { return JSON.parse(await fs.readFile(STATUS_FILE, 'utf8')); } catch { return null; }
}

async function readCmd() {
  try { return JSON.parse(await fs.readFile(CMD_FILE, 'utf8')); } catch { return null; }
}

async function clearCmd() {
  try { await fs.unlink(CMD_FILE); } catch {}
}

async function ensureEnvKeys(envFile, keys) {
  let existing = '';
  try { existing = await fs.readFile(envFile, 'utf8'); } catch {}
  const lines = [];
  for (const [k, v] of Object.entries(keys)) {
    if (!existing.includes(`${k}=`)) {
      lines.push(`${k}=${v}`);
    }
  }
  if (lines.length > 0) {
    const addition = `\n# WhatsApp Companion Bot\n${lines.join('\n')}\n`;
    await fs.appendFile(envFile, addition, 'utf8');
    console.log(`📝  Added missing .env keys: ${lines.map(l => l.split('=')[0]).join(', ')}`);
  }
}

client.initialize();
