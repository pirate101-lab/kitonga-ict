import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Tiny JSON-backed store for site-wide settings the admin can edit
 * without redeploying — currently just the WhatsApp and TikTok URLs
 * that drive the footer's social icons.
 *
 *   data/site-settings.json
 *   { "social": { "whatsapp": "...", "tiktok": "..." }, "updatedAt": "..." }
 *
 * The Footer is a server component that reads this file directly on
 * each request (the file is gitignored under data/). The shape is
 * intentionally tolerant so missing fields fall back to sensible
 * defaults derived from `src/lib/site.ts`.
 */

import { SITE, buildWhatsAppUrl } from "@/lib/site";

export type SiteSocialLinks = {
  whatsapp: string;
  tiktok: string;
};

export type SiteSettings = {
  social: SiteSocialLinks;
  updatedAt: string;
};

const DATA_DIR =
  process.env.KITONGA_DATA_DIR ?? path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "site-settings.json");

function defaults(): SiteSettings {
  return {
    social: {
      whatsapp: buildWhatsAppUrl(
        "Hello KITONGA-ICT — I'd like to chat about a brief.",
      ),
      tiktok: "https://www.tiktok.com/@kitongaict",
    },
    updatedAt: new Date().toISOString(),
  };
}

export async function readSiteSettings(): Promise<SiteSettings> {
  try {
    const buf = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(buf) as Partial<SiteSettings>;
    const fallback = defaults();
    return {
      social: {
        whatsapp:
          (parsed.social?.whatsapp ?? "").trim() || fallback.social.whatsapp,
        tiktok: (parsed.social?.tiktok ?? "").trim() || fallback.social.tiktok,
      },
      updatedAt: parsed.updatedAt ?? fallback.updatedAt,
    };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return defaults();
    throw err;
  }
}

export async function writeSiteSettings(
  patch: Partial<SiteSocialLinks>,
): Promise<SiteSettings> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const current = await readSiteSettings();
  const next: SiteSettings = {
    social: {
      whatsapp: (patch.whatsapp ?? current.social.whatsapp).trim(),
      tiktok: (patch.tiktok ?? current.social.tiktok).trim(),
    },
    updatedAt: new Date().toISOString(),
  };
  const tmp = `${FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(next, null, 2), "utf8");
  await fs.rename(tmp, FILE);
  return next;
}

/** Site-settings convenience for components that don't need writes. */
export async function getSocialLinks(): Promise<SiteSocialLinks> {
  const s = await readSiteSettings();
  return s.social;
}

/** Used by the admin /api/site-settings shape derivation. */
export const SITE_NAME = SITE.name;
