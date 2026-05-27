import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * File-system backed portfolio "database".
 *
 * Persists items as a single JSON file at `KITONGA_DATA_DIR/portfolio.json`
 * (defaults to `<repo>/data/portfolio.json` in dev or `/var/lib/kitonga-ict/`
 * in production via env). The file is read-on-each-request and written
 * atomically. Suitable for a single-tenant studio site where the data
 * volume is small and write contention is low.
 *
 * The schema mirrors the public-facing PortfolioItem so the public
 * Portfolio.tsx grid can render straight from this JSON.
 */

export type PortfolioRecord = {
  id: string;
  title: string;
  client: string;
  category: string;
  /** Tailwind gradient triple used for the placeholder backdrop. */
  gradient: string;
  /** Two-word preview shown in the placeholder mockup. */
  preview: string;
  /** Comma-separated tags. */
  tags: string[];
  year: number;
  /** Public, secure_url. May be a Cloudinary or Unsplash URL. */
  imageUrl?: string;
  /** When set, /api/media/delete uses this to remove from Cloudinary. */
  publicId?: string;
  createdAt: string;
  updatedAt: string;
};

const DATA_DIR =
  process.env.KITONGA_DATA_DIR ??
  path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "portfolio.json");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readPortfolio(): Promise<PortfolioRecord[]> {
  try {
    const buf = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(buf) as PortfolioRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

export async function writePortfolio(items: PortfolioRecord[]): Promise<void> {
  await ensureDir();
  const tmp = `${FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(items, null, 2), "utf8");
  await fs.rename(tmp, FILE);
}

export async function upsertPortfolioItem(
  partial: Partial<PortfolioRecord> & { id: string },
): Promise<PortfolioRecord> {
  const list = await readPortfolio();
  const idx = list.findIndex((p) => p.id === partial.id);
  const now = new Date().toISOString();

  if (idx === -1) {
    const created: PortfolioRecord = {
      id: partial.id,
      title: partial.title ?? "Untitled piece",
      client: partial.client ?? "Client",
      category: partial.category ?? "General",
      gradient: partial.gradient ?? "from-primary/40 via-sky-500/30 to-indigo-700/40",
      preview: partial.preview ?? "NEW\nPIECE",
      tags: partial.tags ?? [],
      year: partial.year ?? new Date().getFullYear(),
      imageUrl: partial.imageUrl,
      publicId: partial.publicId,
      createdAt: now,
      updatedAt: now,
    };
    list.unshift(created);
    await writePortfolio(list);
    return created;
  }

  const next: PortfolioRecord = {
    ...list[idx],
    ...partial,
    updatedAt: now,
  };
  list[idx] = next;
  await writePortfolio(list);
  return next;
}

export async function deletePortfolioItem(id: string): Promise<boolean> {
  const list = await readPortfolio();
  const next = list.filter((p) => p.id !== id);
  if (next.length === list.length) return false;
  await writePortfolio(next);
  return true;
}
