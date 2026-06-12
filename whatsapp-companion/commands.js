/**
 * commands.js — caption parser → command object
 * ESM, Node 20+
 * All commands are case-insensitive.
 */

/**
 * Category shortcuts — map slash command → display category name.
 * Extend this list to add more shortcut commands.
 */
export const CATEGORY_MAP = {
  '/photoshop':   'Photo Compositing',
  '/flyer':       'Posters & Flyers',
  '/cv':          'Resumes & CVs',
  '/cards':       'Business Cards',
  '/logo':        'Logo Design',
  '/web':         'Web Design',
  '/banner':      'Roll-up Banners',
  '/social':      'Social Templates',
  '/deck':        'Pitch Decks',
  '/branding':    'Brand Guidelines',
};

/** All valid text-only commands (no media needed) */
const TEXT_COMMANDS = new Set(['!menu', '!status', '!ping', '!categories', '!cats', '!help']);

/** Short-form aliases for text commands */
const TEXT_ALIASES = {
  '!cats': '!categories',
  '!help': '!menu',
};

/**
 * Parses a WhatsApp message body (caption or text) into a command object.
 *
 * Text-only commands (send without media):
 *   !menu | !help         → { cmd: 'menu' }
 *   !status               → { cmd: 'status' }
 *   !ping                 → { cmd: 'ping' }
 *   !categories | !cats   → { cmd: 'categories' }
 *
 * Media commands (send with image attached):
 *   /photoshop [title]         → category: Photo Compositing
 *   /flyer [title]             → category: Posters & Flyers
 *   /cv [title]                → category: Resumes & CVs
 *   /cards [title]             → category: Business Cards
 *   /logo [title]              → category: Logo Design
 *   /web [title]               → category: Web Design
 *   /banner [title]            → category: Roll-up Banners
 *   /social [title]            → category: Social Templates
 *   /deck [title]              → category: Pitch Decks
 *   /branding [title]          → category: Brand Guidelines
 *   /portfolio [cat] [title]   → category: first word(s) before title
 *
 * Titles may be quoted: /flyer "Sahara Launch" or unquoted: /flyer Sahara Launch
 * Returns null for anything that doesn't match.
 */
export function parseCaption(caption) {
  if (typeof caption !== 'string') return null;
  const trimmed = caption.trim();
  if (!trimmed) return null;

  // Normalise: lowercase first token for matching
  const firstSpace = trimmed.indexOf(' ');
  const rawVerb  = firstSpace === -1 ? trimmed : trimmed.slice(0, firstSpace);
  const verb     = rawVerb.toLowerCase();
  const rest     = firstSpace === -1 ? '' : trimmed.slice(firstSpace + 1).trim();

  // ── Text-only commands ────────────────────────────────────────────────────
  if (TEXT_COMMANDS.has(verb)) {
    const normalised = TEXT_ALIASES[verb] ?? verb;
    return { cmd: normalised.slice(1) }; // strip leading '!'
  }

  // ── Media / upload commands ───────────────────────────────────────────────
  // Named shortcut: /photoshop, /flyer, etc.
  const mappedCategory = CATEGORY_MAP[verb];
  if (mappedCategory) {
    const title = unquote(rest) || mappedCategory;
    return { cmd: 'upload', category: mappedCategory, title };
  }

  // Generic: /portfolio [category] [title]
  if (verb === '/portfolio') {
    const { first: cat, remainder: titleRaw } = splitFirst(rest);
    const category = unquote(cat) || 'General';
    const title    = unquote(titleRaw) || category;
    return { cmd: 'upload', category, title };
  }

  return null;
}

/** Splits a string on the first whitespace boundary, honouring double-quoted phrases. */
function splitFirst(str) {
  if (!str) return { first: '', remainder: '' };
  if (str.startsWith('"')) {
    const end = str.indexOf('"', 1);
    if (end !== -1) {
      return { first: str.slice(1, end), remainder: str.slice(end + 1).trim() };
    }
  }
  const idx = str.indexOf(' ');
  if (idx === -1) return { first: str, remainder: '' };
  return { first: str.slice(0, idx), remainder: str.slice(idx + 1).trim() };
}

function unquote(str) {
  if (!str) return str;
  if (str.startsWith('"') && str.endsWith('"') && str.length > 2) {
    return str.slice(1, -1);
  }
  return str;
}

/** Returns the human-readable menu string */
export function getMenuText(portfolioCount = 0) {
  return (
`*🎨 KITONGA-ICT Bot — Command Menu*
_Reply with any command below (not case sensitive)_

━━━━━━━━━━━━━━━
*📋 INFO COMMANDS* (text only — no image needed)
━━━━━━━━━━━━━━━
\`!menu\` or \`!help\`     → Show this menu
\`!status\`              → Bot status & stats
\`!categories\`          → List current portfolio categories
\`!ping\`                → Check bot is alive

━━━━━━━━━━━━━━━
*📤 UPLOAD COMMANDS* (send with image attached)
━━━━━━━━━━━━━━━
\`/photoshop [title]\`   → Photo Compositing
\`/flyer [title]\`       → Posters & Flyers
\`/cv [title]\`          → Resumes & CVs
\`/cards [title]\`       → Business Cards
\`/logo [title]\`        → Logo Design
\`/banner [title]\`      → Roll-up Banners
\`/social [title]\`      → Social Templates
\`/deck [title]\`        → Pitch Decks
\`/branding [title]\`    → Brand Guidelines
\`/web [title]\`         → Web Design

*Custom category:*
\`/portfolio [category] [title]\`

━━━━━━━━━━━━━━━
*💡 TIPS*
━━━━━━━━━━━━━━━
• Quote titles with spaces: \`/flyer "Sahara Launch"\`
• Use \`!categories\` to see what categories exist before uploading
• Portfolio items: *${portfolioCount}* live

_Kitonga-ICT Studio · kitongaict.tech_`
  );
}
