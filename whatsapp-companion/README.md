# Kitonga-ICT WhatsApp Companion Bot

A standalone Node.js bot that listens for captioned images from the admin's
WhatsApp and uploads them directly to Cloudinary, then writes the new entry
to `data/portfolio.json`.

## 1. System dependencies (Ubuntu 24)

```bash
sudo apt-get install -y \
  libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 \
  libxkbcommon0 libxcomposite1 libxdamage1 libxrandr2 libgbm1 \
  libasound2t64 libpango-1.0-0 libpangocairo-1.0-0
```

## 2. Install bot dependencies

```bash
cd whatsapp-companion
npm install
```

## 3. Configure `.env` (in the repo root)

Ensure these keys are set (the bot will add placeholders automatically if missing):

```env
# Cloudinary (pick one format)
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
# OR:
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-secret

# Bot config
COMPANION_ALLOWED_NUMBERS=254715927114,254700000000
COMPANION_DATA_DIR=/path/to/kitonga-ict-main/data
COMPANION_WA_SESSION_PATH=/path/to/kitonga-ict-main/whatsapp-companion/.wwebjs_auth
```

## 4. First-run: scan QR code

```bash
node whatsapp-companion/bot.js
```

Scan the QR code that appears in your terminal with your WhatsApp (Linked Devices → Link a Device).

## 5. Production (pm2)

```bash
bash scripts/start-companion.sh --pm2
pm2 logs wa-companion
```

## 6. Command reference

Caption sent with image

Action

`/portfolio Posters "Sahara Poster"`

Upload to kitonga_assets, category = Posters

`/photoshop "Beauty Retouch"`

category = Photo Compositing

`/flyer "Event Flyer"`

category = Posters & Flyers

`/cv "John Doe CV"`

category = Resumes & CVs

`/cards "Business Card"`

category = Business Cards

`!status` (text, no image)

Reply with portfolio count + bot status

## 7. Troubleshooting

**Session expired / can't connect:**

```bash
rm -rf whatsapp-companion/.wwebjs_auth
pm2 restart wa-companion   # will show new QR
```

**Number not whitelisted:** Check `COMPANION_ALLOWED_NUMBERS` in `.env` — no `+`, comma-separated.

**Chromium crash on VPS:** Make sure all system libs (step 1) are installed. The `--disable-dev-shm-usage` flag is already set.
