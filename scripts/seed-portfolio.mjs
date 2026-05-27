/**
 * Seed the portfolio JSON store with placeholder pieces across the
 * studio's full service catalogue.
 *
 *   3 × Posters & Flyers       3 × Business Cards
 *   3 × Roll-up Banners        3 × Resumes & CVs
 *   3 × Photo Compositing      3 × Brand Guidelines
 *   3 × Pitch Decks            3 × Social Templates
 *
 * Each `imageUrl` is a curated `images.unsplash.com/photo-<id>` URL
 * (the legacy `source.unsplash.com/?keyword` redirect endpoint stopped
 * serving in 2023, so we hard-code stable photo IDs that actually
 * load). Both `images.unsplash.com` and `source.unsplash.com` are
 * already whitelisted in `next.config.ts`.
 *
 * Usage from the project root:
 *
 *   node scripts/seed-portfolio.mjs            # insert if absent
 *   FORCE=1 node scripts/seed-portfolio.mjs    # replace existing IDs
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = process.env.KITONGA_DATA_DIR || path.join(ROOT, "data");
const FILE = path.join(DATA_DIR, "portfolio.json");

const NOW = new Date().toISOString();

/**
 * Each row: [id, title, client, category, tag, photoId, gradient, preview].
 * `photoId` is the part after `https://images.unsplash.com/photo-`.
 * `gradient` and `preview` keep the legacy <PortfolioMockup> fallback
 * working should an item lose its image.
 */
const PIECES = [
  // ── 1. Posters & Flyers ─────────────────────────────────────────────
  ["seed-poster-01", "Mzizi Roastery — launch poster", "Mzizi Roasters",
    "Posters & Flyers", "poster-design", "1611532736597-de2d4265fba3",
    "from-amber-400/40 via-rose-500/30 to-orange-600/40", "POSTER\nLAUNCH"],
  ["seed-poster-02", "Sahara Sound — festival key art", "Sahara Sound",
    "Posters & Flyers", "poster-design", "1551295022-de5522c94e08",
    "from-purple-500/40 via-pink-500/30 to-rose-600/40", "FESTIVAL\nKEYART"],
  ["seed-poster-03", "Asili Fest — main stage flyer", "Asili Fest",
    "Posters & Flyers", "poster-design", "1604079628040-94301bb21b91",
    "from-indigo-500/40 via-violet-500/30 to-fuchsia-500/40", "FLYER\nFEST"],

  // ── 2. Business Cards ───────────────────────────────────────────────
  ["seed-card-01", "Bara Capital — premium card", "Bara Capital",
    "Business Cards", "business-card-mockup", "1554224155-6726b3ff858f",
    "from-indigo-500/40 via-blue-500/30 to-sky-600/40", "CARD\nMINIMAL"],
  ["seed-card-02", "Studio Lumière — photo card", "Studio Lumière",
    "Business Cards", "business-card-mockup", "1606857521015-7f9fcf423740",
    "from-zinc-500/40 via-slate-500/30 to-zinc-700/40", "CARD\nMATTE"],
  ["seed-card-03", "Tinsel Lane — calligraphic card", "Tinsel Lane",
    "Business Cards", "business-card-mockup", "1607082348824-0a96f2a4b9da",
    "from-amber-500/40 via-yellow-500/30 to-orange-500/40", "CARD\nGOLD"],

  // ── 3. Roll-up Banners ──────────────────────────────────────────────
  ["seed-banner-01", "OKAPI Trade — exhibition roll-up", "OKAPI Trade",
    "Roll-up Banners", "trade-show-banner", "1556761175-5973dc0f32e7",
    "from-emerald-500/40 via-green-500/30 to-teal-600/40", "ROLLUP\nTRADE"],
  ["seed-banner-02", "Habari & Co. — book launch banner", "Habari & Co.",
    "Roll-up Banners", "event-banner", "1611926653458-09294b3142bf",
    "from-emerald-400/40 via-teal-500/30 to-cyan-600/40", "BANNER\nLAUNCH"],
  ["seed-banner-03", "Pulse Fitness — gym entrance banner", "Pulse Fitness",
    "Roll-up Banners", "stand-banner", "1574169208507-84376144848b",
    "from-red-500/40 via-rose-500/30 to-orange-500/40", "BANNER\nFITNESS"],

  // ── 4. Resumes & CVs ────────────────────────────────────────────────
  ["seed-resume-01", "Senior PM résumé pack", "Naomi M.",
    "Resumes & CVs", "resume-design", "1517842645767-c639042777db",
    "from-sky-500/40 via-blue-500/30 to-indigo-600/40", "CV\nSENIOR"],
  ["seed-resume-02", "Creative director résumé", "Faith W.",
    "Resumes & CVs", "resume-design", "1573497019418-b400bb3ab074",
    "from-fuchsia-500/40 via-pink-500/30 to-rose-600/40", "CV\nDIRECTOR"],
  ["seed-resume-03", "Engineering résumé layout", "Daniel O.",
    "Resumes & CVs", "resume-design", "1542219550-37153d387c27",
    "from-blue-500/40 via-sky-500/30 to-cyan-600/40", "CV\nENGINEER"],

  // ── 5. Photo Compositing ────────────────────────────────────────────
  ["seed-photo-01", "Editorial beauty composite", "Studio Lumière",
    "Photo Compositing", "photo-retouch", "1488161628813-04466f872be2",
    "from-rose-500/40 via-pink-500/30 to-fuchsia-500/40", "PHOTO\nCOMP"],
  ["seed-photo-02", "Album cover montage", "Sahara Sound",
    "Photo Compositing", "image-compositing", "1559136555-9303baea8ebd",
    "from-violet-500/40 via-purple-500/30 to-indigo-600/40", "ALBUM\nCOVER"],
  ["seed-photo-03", "Lookbook photo edit", "Tinsel Lane",
    "Photo Compositing", "frequency-separation", "1496181133206-80ce9b88a853",
    "from-amber-500/40 via-orange-500/30 to-rose-500/40", "RETOUCH\nLOOK"],

  // ── 6. Brand Guidelines ─────────────────────────────────────────────
  ["seed-brand-01", "Tinsel Lane — identity manual", "Tinsel Lane",
    "Brand Guidelines", "brand-guidelines", "1542744173-8e7e53415bb0",
    "from-orange-400/40 via-amber-500/30 to-rose-500/40", "BRAND\nMANUAL"],
  ["seed-brand-02", "Mzizi Roasters — visual system", "Mzizi Roasters",
    "Brand Guidelines", "visual-identity", "1517048676732-d65bc937f952",
    "from-amber-600/40 via-orange-500/30 to-rose-500/40", "VISUAL\nSYSTEM"],
  ["seed-brand-03", "Bara Capital — corporate guidebook", "Bara Capital",
    "Brand Guidelines", "brand-book", "1543109740-4bdb38fda756",
    "from-indigo-500/40 via-blue-500/30 to-sky-600/40", "BRAND\nBOOK"],

  // ── 7. Pitch Decks ──────────────────────────────────────────────────
  ["seed-deck-01", "Bara Capital — Series A deck", "Bara Capital",
    "Pitch Decks", "pitch-deck", "1553877522-43269d4ea984",
    "from-violet-500/40 via-purple-500/30 to-indigo-600/40", "DECK\nSERIES A"],
  ["seed-deck-02", "Studio Lumière — investor update", "Studio Lumière",
    "Pitch Decks", "investor-deck", "1570641963303-92ce4845ed4c",
    "from-cyan-500/40 via-blue-500/30 to-indigo-500/40", "DECK\nUPDATE"],
  ["seed-deck-03", "Asili Fest — sponsorship deck", "Asili Fest",
    "Pitch Decks", "sponsor-deck", "1583912086096-8c60d75a53f9",
    "from-fuchsia-500/40 via-pink-500/30 to-rose-600/40", "DECK\nSPONSOR"],

  // ── 8. Social Templates ─────────────────────────────────────────────
  ["seed-social-01", "Mzizi Roasters — Instagram set", "Mzizi Roasters",
    "Social Templates", "social-media-design", "1517245386807-bb43f82c33c4",
    "from-orange-500/40 via-amber-500/30 to-rose-500/40", "SOCIAL\nIG"],
  ["seed-social-02", "Pulse Fitness — Reels covers", "Pulse Fitness",
    "Social Templates", "social-media-design", "1551836022-aadb801c60ae",
    "from-red-500/40 via-rose-500/30 to-pink-500/40", "SOCIAL\nREELS"],
  ["seed-social-03", "Habari & Co. — campaign templates", "Habari & Co.",
    "Social Templates", "social-media-design", "1553028826-f4804a6dba3b",
    "from-sky-500/40 via-blue-500/30 to-indigo-600/40", "SOCIAL\nCAMPAIGN"],
];

function unsplashUrl(photoId) {
  return `https://images.unsplash.com/photo-${photoId}?w=1600&q=85&auto=format&fit=crop`;
}

const force = !!process.env.FORCE;

async function main() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  let existing = [];
  try {
    const buf = await fs.readFile(FILE, "utf8");
    existing = JSON.parse(buf);
    if (!Array.isArray(existing)) existing = [];
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }

  const byId = new Map(existing.map((p) => [p.id, p]));

  for (const row of PIECES) {
    const [id, title, client, category, tag, photoId, gradient, preview] = row;
    if (byId.has(id) && !force) continue;
    byId.set(id, {
      id,
      title,
      client,
      category,
      gradient,
      preview,
      tags: [tag],
      year: 2026,
      imageUrl: unsplashUrl(photoId),
      createdAt: existing.find((p) => p.id === id)?.createdAt ?? NOW,
      updatedAt: NOW,
    });
  }

  const out = [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
  const tmp = `${FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(out, null, 2), "utf8");
  await fs.rename(tmp, FILE);

  console.log(`✔ wrote ${out.length} portfolio records to ${FILE}`);
  console.log(
    `  ${PIECES.length} placeholders inserted across 8 categories (force=${force ? "yes" : "no"}).`,
  );
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
