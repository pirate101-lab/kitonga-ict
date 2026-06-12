/**
 * portfolio.js — atomic portfolio.json read/write
 * ESM, Node 20+
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomBytes } from 'node:crypto';

const DATA_DIR = process.env.COMPANION_DATA_DIR
  ? path.resolve(process.env.COMPANION_DATA_DIR)
  : path.resolve(new URL('.', import.meta.url).pathname, '..', 'data');

const FILE = path.join(DATA_DIR, 'portfolio.json');

/** Generates an ID like "p-1a2b3c-xyz" */
export function genId(prefix = 'p') {
  return `${prefix}-${Date.now().toString(36)}-${randomBytes(3).toString('hex')}`;
}

export async function readPortfolio() {
  try {
    const buf = await fs.readFile(FILE, 'utf8');
    const parsed = JSON.parse(buf);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

/**
 * Prepend a new portfolio record and write atomically.
 *
 * @param {{ title: string, category: string, imageUrl: string, publicId: string }} item
 */
export async function appendPortfolioItem(item) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const list = await readPortfolio();
  const now = new Date().toISOString();
  const record = {
    id:        genId('p'),
    title:     item.title,
    client:    item.client ?? 'Client',
    category:  item.category,
    gradient:  item.gradient ?? 'from-primary/40 via-sky-500/30 to-indigo-700/40',
    preview:   item.preview ?? item.title.slice(0, 12).toUpperCase(),
    tags:      item.tags ?? [item.category],
    year:      new Date().getFullYear(),
    imageUrl:  item.imageUrl,
    publicId:  item.publicId,
    createdAt: now,
    updatedAt: now,
  };
  list.unshift(record);  // newest first
  const tmp = `${FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(list, null, 2), 'utf8');
  await fs.rename(tmp, FILE);
  return record;
}

export async function getPortfolioCount() {
  const list = await readPortfolio();
  return list.length;
}
