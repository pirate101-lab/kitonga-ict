/**
 * Kenyan phone number normalisation.
 *
 * Accepts every variation users actually type:
 *   "0712345678"      → "+254712345678"
 *   "0112345678"      → "+254112345678"
 *   "712345678"       → "+254712345678"
 *   "112345678"       → "+254112345678"
 *   "+254712345678"   → "+254712345678" (no change)
 *   "254712345678"    → "+254712345678"
 *
 * Anything else returns null. The validator is silent — no UI hint is
 * surfaced; callers decide whether to surface failure or just refuse to
 * submit.
 */

export const KE_DIAL = "+254";

/** Strip all non-digits from a string. */
export function digitsOnly(input: string): string {
  return input.replace(/\D+/g, "");
}

/**
 * Normalise any reasonable Kenyan input to E.164 (+2547... or +2541...).
 * Returns null when the input cannot be coerced.
 */
export function normaliseKenyanPhone(input: string): string | null {
  if (!input) return null;
  const raw = digitsOnly(input);
  if (!raw) return null;

  let body: string | null = null;

  // "254XXXXXXXXX" → take after the country code
  if (raw.startsWith("254") && raw.length === 12) {
    body = raw.slice(3);
  }
  // "0XXXXXXXXX" (10 digits) → drop leading 0
  else if (raw.startsWith("0") && raw.length === 10) {
    body = raw.slice(1);
  }
  // "XXXXXXXXX" (9 digits already)
  else if (raw.length === 9) {
    body = raw;
  }

  if (!body) return null;

  // Kenyan mobile prefixes start with 7 or 1.
  if (!/^[71]\d{8}$/.test(body)) return null;

  return `${KE_DIAL}${body}`;
}

/**
 * Format a normalised phone for human display:
 *   "+254712345678" → "+254 712 345 678"
 */
export function formatKenyanPhone(e164: string): string {
  if (!e164.startsWith(KE_DIAL)) return e164;
  const tail = e164.slice(KE_DIAL.length);
  if (tail.length !== 9) return e164;
  return `${KE_DIAL} ${tail.slice(0, 3)} ${tail.slice(3, 6)} ${tail.slice(6)}`;
}
