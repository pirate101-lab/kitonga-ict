/**
 * bot.js — WhatsApp Companion Bot for Kitonga-ICT
 * ESM, Node 20+
 *
 * Run once to scan QR: node bot.js
 * Production:          pm2 start bot.js --name wa-companion
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load the root .env (one level up from whatsapp-companion/)
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

// Ensure required COMPANION_* keys exist in .env with placeholder values if missing.
await ensureEnvKeys(path.resolve(__dirname, '..', '.env.local'), {
  COMPANION_ALLOWED_NUMBERS: '254715927114',
  COMPANION_DATA_DIR:        path.resolve(__dirname, '..', 'data'),
  COMPANION_WA_SESSION_PATH: path.join(__dirname, '.wwebjs_auth'),
});

// Reload .env after possible mutation
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local'), override: true });

// whatsapp-web.js is a CommonJS module; use createRequire to import it in ESM
const require = createRequire(import.meta.url);
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

import { initCloudinary, uploadBase64ToCloudinary } from './uploader.js';
import { appendPortfolioItem, getPortfolioCount }  from './portfolio.js';
import { parseCaption }                             from './commands.js';

initCloudinary();

// Allowed sender whitelist — comma-separated E.164 digits, no "+"
const ALLOWED = new Set(
  (process.env.COMPANION_ALLOWED_NUMBERS ?? '')
    .split(',')
    .map(n => n.trim())
    .filter(Boolean)
);

const SESSION_PATH = process.env.COMPANION_WA_SESSION_PATH ?? path.join(__dirname, '.wwebjs_auth');

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

async function writeStatus(patch) {
  const dataDir = process.env.COMPANION_DATA_DIR
    ? path.resolve(process.env.COMPANION_DATA_DIR)
    : path.resolve(__dirname, '..', 'data');
  const file = path.join(dataDir, 'bot-status.json');
  let current = {};
  try { current = JSON.parse(await fs.readFile(file, 'utf8')); } catch {}
  const next = { ...current, ...patch, updatedAt: new Date().toISOString() };
  const tmp = `${file}.tmp`;
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(tmp, JSON.stringify(next, null, 2), 'utf8');
  await fs.rename(tmp, file);
}

client.on('qr', async qr => {
  console.log('\n📱  Scan this QR code with your WhatsApp to link the bot:\n');
  qrcode.generate(qr, { small: true });

  const pairingNumber = process.env.COMPANION_PAIRING_NUMBER;
  if (pairingNumber) {
    try {
      const code = await client.requestPairingCode(pairingNumber);
      console.log('Pairing Code:', code);
      await writeStatus({ pairingCode: code, qr: null, status: 'pairing' });
    } catch (e) {
      console.error('Failed to request pairing code:', e);
    }
  } else {
    await writeStatus({ qr, status: 'qr-ready' });
  }
});

client.on('ready', async () => {
  const info = client.info;
  await writeStatus({
    status: 'online',
    linkedNumber: info?.wid?.user ?? null,
    displayName: info?.pushname ?? null,
    lastSeen: new Date().toISOString(),
    pairingCode: null,
    qr: null,
  });
  console.log('✅  WhatsApp bot is ready. Waiting for commands...');
  console.log(`   Allowed numbers: ${[...ALLOWED].join(', ')}`);
});

client.on('auth_failure', msg => {
  console.error('❌  Auth failure:', msg);
  console.error('   Delete the .wwebjs_auth folder and restart to re-scan QR.');
});

client.on('disconnected', async reason => {
  await writeStatus({ status: 'offline', disconnectedAt: new Date().toISOString() });
  console.warn('⚠️  Bot disconnected:', reason);
});

client.on('message', async message => {
  try {
    await handleMessage(message);
  } catch (err) {
    console.error('Error handling message:', err);
  }
});

async function handleMessage(message) {
  // Extract sender number — format is "2547xxxxxxxx@c.us"
  const from   = message.from;   // e.g. "254715927114@c.us"
  const number = from.split('@')[0];

  // Silently drop messages from non-allowlisted numbers
  if (!ALLOWED.has(number)) return;

  const hasMedia = message.hasMedia;
  const caption  = hasMedia ? (message.body ?? '') : message.body;

  const parsed = parseCaption(caption);
  if (!parsed) return; // silently ignore unrecognised captions

  // ── !status (text only, no media required) ──────────────────────────
  if (parsed.cmd === 'status') {
    const portfolioCount = await getPortfolioCount();
    await message.reply(
      `📊  *Kitonga-ICT Bot Status*\n\n` +
      `• Portfolio entries: ${portfolioCount}\n` +
      `• Cloudinary folder: kitonga_assets\n` +
      `• Bot status: ✅ Online\n` +
      `• Session: Linked`
    );
    return;
  }

  if (parsed.cmd === 'menu') {
    await message.reply(
      `🛠️  *Kitonga-ICT Bot Menu*\n\n` +
      `*Control Commands:*\n` +
      `• !status - View bot & portfolio status\n` +
      `• !ping - Check if bot is responsive\n` +
      `• !menu - Show this menu\n\n` +
      `*Upload Commands (Send with image):*\n` +
      `• /photoshop [title] - Photo Compositing\n` +
      `• /flyer [title] - Posters & Flyers\n` +
      `• /cv [title] - Resumes & CVs\n` +
      `• /cards [title] - Business Cards\n` +
      `• /logo [title] - Logo Design\n` +
      `• /web [title] - Web Design`
    );
    return;
  }

  if (parsed.cmd === 'ping') {
    await message.reply('🏓 Pong! Bot is fully operational.');
    return;
  }

  // ── Media upload commands — require an attached image ───────────────
  if (!hasMedia) {
    await message.reply('⚠️  Please send an image with the caption command.');
    return;
  }

  await message.reply('⏳  Uploading to Cloudinary...');

  // Download media from WhatsApp
  const media = await message.downloadMedia();
  if (!media || !media.data) {
    await message.reply('❌  Could not download the media. Please try again.');
    return;
  }

  // Upload to Cloudinary (no disk write)
  let uploadResult;
  try {
    uploadResult = await uploadBase64ToCloudinary(
      media.data,
      'kitonga_assets',
      [parsed.category, 'bot-upload']
    );
  } catch (uploadErr) {
    console.error('Cloudinary upload error:', uploadErr);
    await message.reply('❌  Cloudinary upload failed. Check bot logs.');
    return;
  }

  // Write to portfolio.json atomically
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
    await message.reply(
      `✅  Uploaded to Cloudinary but portfolio write failed.\n` +
      `URL: ${uploadResult.secure_url}`
    );
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

// ── Helper: ensure env keys exist with placeholder values ────────────
async function ensureEnvKeys(envFile, keys) {
  const { promises: fs } = await import('node:fs');
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
  }
}

// Watch .env.local and auto-restart on changes
import { statSync } from 'node:fs';
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

client.initialize();
