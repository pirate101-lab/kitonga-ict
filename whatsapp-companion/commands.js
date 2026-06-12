/**
 * commands.js — caption parser → command object
 * ESM, Node 20+
 */

const CATEGORY_MAP = {
  '/photoshop': 'Photo Compositing',
  '/flyer':     'Posters & Flyers',
  '/cv':        'Resumes & CVs',
  '/cards':     'Business Cards',
};

/**
 * Parses a WhatsApp caption string into a command object or null.
 *
 * Supported patterns:
 *   /portfolio [category] [title]      → { cmd:'portfolio', category, title }
 *   /photoshop [title]                 → { cmd:'photoshop', category:'Photo Compositing', title }
 *   /flyer [title]                     → { cmd:'flyer',     category:'Posters & Flyers',  title }
 *   /cv [title]                        → { cmd:'cv',        category:'Resumes & CVs',     title }
 *   /cards [title]                     → { cmd:'cards',     category:'Business Cards',    title }
 *   !status  (text only, no media)     → { cmd:'status' }
 *
 * Titles may be quoted: /flyer "Sahara Flyer" or unquoted: /flyer Sahara Flyer
 * Returns null for anything that doesn't match.
 */
export function parseCaption(caption) {
  if (typeof caption !== 'string') return null;
  const trimmed = caption.trim();

  // !status — text-only command
  if (/^!status$/i.test(trimmed)) return { cmd: 'status' };

  // Extract first token (the slash command)
  const firstSpace = trimmed.indexOf(' ');
  const verb = (firstSpace === -1 ? trimmed : trimmed.slice(0, firstSpace)).toLowerCase();
  const rest  = firstSpace === -1 ? '' : trimmed.slice(firstSpace + 1).trim();

  if (verb === '/portfolio') {
    // /portfolio [category] [title]
    // Category is the first word (or quoted phrase), title is the remainder.
    const { first, remainder } = splitFirst(rest);
    if (!first) return null;
    const title = remainder || first;
    const category = remainder ? first : 'General';
    return { cmd: 'portfolio', category, title };
  }

  const mappedCategory = CATEGORY_MAP[verb];
  if (mappedCategory) {
    const title = unquote(rest) || verb.slice(1); // fallback to verb without slash
    return { cmd: verb.slice(1), category: mappedCategory, title };
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
  if (str.startsWith('"') && str.endsWith('"') && str.length > 2) {
    return str.slice(1, -1);
  }
  return str;
}
