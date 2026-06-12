import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

/**
 * File-system backed users "database" for the studio's client portal.
 *
 * Mirrors the same JSON-on-disk pattern as `portfolio-db.ts`:
 *   `<KITONGA_DATA_DIR>/users.json`
 *   defaults to `<repo>/data/users.json` in dev or
 *   `/var/lib/kitonga-ict/users.json` in production.
 *
 * Each user is keyed by their normalised E.164 Kenyan phone number.
 * Passwords are stored as a `scrypt:<saltHex>:<hashHex>` string so we
 * can verify with a constant-time compare and rotate cost factors later
 * without breaking existing rows.
 */

const scrypt = promisify(scryptCb) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

const SCRYPT_KEYLEN = 64;
const SALT_BYTES = 16;

export type UserRecord = {
  /** Normalised E.164 phone number, e.g. "+254712345678". */
  phone: string;
  /** `scrypt:<saltHex>:<hashHex>`. */
  passwordHash: string;
  createdAt: string;
};

const DATA_DIR =
  process.env.KITONGA_DATA_DIR ?? path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "users.json");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readUsers(): Promise<UserRecord[]> {
  try {
    const buf = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(buf) as UserRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

async function writeUsers(users: UserRecord[]): Promise<void> {
  await ensureDir();
  const tmp = `${FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(users, null, 2), "utf8");
  await fs.rename(tmp, FILE);
}

/** Look up a user by their canonical phone number. */
export async function findUserByPhone(
  phone: string,
): Promise<UserRecord | null> {
  const all = await readUsers();
  return all.find((u) => u.phone === phone) ?? null;
}

/** Hash a plaintext password with scrypt + a fresh random salt. */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES);
  const derived = await scrypt(password, salt, SCRYPT_KEYLEN);
  return `scrypt:${salt.toString("hex")}:${derived.toString("hex")}`;
}

/** Constant-time verify against a `scrypt:salt:hash` stored value. */
export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [scheme, saltHex, hashHex] = stored.split(":");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;
  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(hashHex, "hex");
  const derived = await scrypt(password, salt, expected.length);
  if (derived.length !== expected.length) return false;
  return timingSafeEqual(derived, expected);
}

/**
 * Create a new user. Throws when a user with the same phone already
 * exists — callers should surface this as a 409.
 */
export async function createUser(
  phone: string,
  password: string,
): Promise<UserRecord> {
  const all = await readUsers();
  if (all.some((u) => u.phone === phone)) {
    throw new Error("USER_EXISTS");
  }
  const record: UserRecord = {
    phone,
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString(),
  };
  all.push(record);
  await writeUsers(all);
  return record;
}
