import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import {
  randomBytes,
  scrypt as scryptCb,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";

/**
 * Multi-admin file-system store.
 *
 *   data/admin.json
 *   {
 *     "version": 2,
 *     "admins": [
 *       { "id", "username", "passwordHash": "scrypt:salt:hash",
 *         "role": "owner"|"manager", "createdAt", "updatedAt" }
 *     ],
 *     "tokens": [
 *       { "token", "adminId", "createdAt", "expiresAt" }
 *     ],
 *     "createdAt", "updatedAt"
 *   }
 *
 * Owners can create / rename / reset / delete other admins. Managers can
 * change only their own password and username. The last surviving owner
 * cannot be deleted or demoted.
 *
 * The legacy v1 single-password schema is auto-migrated on read into a
 * v2 record with a single owner named `"admin"`. All v1 tokens are
 * reassigned to that admin.
 */

const scrypt = promisify(scryptCb) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

const SCRYPT_KEYLEN = 64;
const SALT_BYTES = 16;
const TOKEN_BYTES = 32;
const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days
const ID_BYTES = 8;

export const MIN_PASSWORD_LENGTH = 8;
export const MIN_USERNAME_LENGTH = 3;
export const MAX_USERNAME_LENGTH = 32;
export const USERNAME_PATTERN = /^[a-z0-9_-]+$/;

export type AdminRole = "owner" | "manager";

export type AdminUser = {
  id: string;
  username: string;
  passwordHash: string;
  role: AdminRole;
  createdAt: string;
  updatedAt: string;
};

/** Public-safe view of an admin (no password hash). */
export type SafeAdmin = Omit<AdminUser, "passwordHash">;

export type AdminToken = {
  token: string;
  adminId: string;
  createdAt: string;
  expiresAt: string;
};

export type AdminRecord = {
  version: 2;
  admins: AdminUser[];
  tokens: AdminToken[];
  createdAt: string;
  updatedAt: string;
};

const DATA_DIR =
  process.env.KITONGA_DATA_DIR ?? path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "admin.json");

// ── helpers ──────────────────────────────────────────────────────────

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function nowIso() {
  return new Date().toISOString();
}

function newAdminId(): string {
  return randomBytes(ID_BYTES).toString("hex");
}

function newTokenString(): string {
  return randomBytes(TOKEN_BYTES).toString("hex");
}

export function normaliseUsername(input: string): string {
  return input.trim().toLowerCase();
}

export function validateUsername(input: string): string | null {
  const u = normaliseUsername(input);
  if (u.length < MIN_USERNAME_LENGTH || u.length > MAX_USERNAME_LENGTH) {
    return `Username must be ${MIN_USERNAME_LENGTH}–${MAX_USERNAME_LENGTH} characters.`;
  }
  if (!USERNAME_PATTERN.test(u)) {
    return "Username may contain only lowercase letters, digits, underscores and hyphens.";
  }
  return null;
}

export function validatePassword(input: string): string | null {
  if (typeof input !== "string" || input.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return null;
}

export async function hashAdminPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES);
  const derived = await scrypt(password, salt, SCRYPT_KEYLEN);
  return `scrypt:${salt.toString("hex")}:${derived.toString("hex")}`;
}

export async function verifyAdminPassword(
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

export function toSafeAdmin(a: AdminUser): SafeAdmin {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash: _, ...rest } = a;
  return rest;
}

// ── persistence + migration ──────────────────────────────────────────

type LegacyV1 = {
  passwordHash?: string;
  tokens?: Array<{ token: string; createdAt: string; expiresAt: string }>;
  createdAt?: string;
  updatedAt?: string;
};

function migrateV1ToV2(v1: LegacyV1): AdminRecord {
  const now = nowIso();
  const ownerId = newAdminId();
  const owner: AdminUser = {
    id: ownerId,
    username: "admin",
    passwordHash: v1.passwordHash ?? "",
    role: "owner",
    createdAt: v1.createdAt ?? now,
    updatedAt: now,
  };
  const tokens: AdminToken[] = (v1.tokens ?? []).map((t) => ({
    token: t.token,
    adminId: ownerId,
    createdAt: t.createdAt,
    expiresAt: t.expiresAt,
  }));
  return {
    version: 2,
    admins: [owner],
    tokens,
    createdAt: v1.createdAt ?? now,
    updatedAt: now,
  };
}

function isV2(parsed: unknown): parsed is AdminRecord {
  if (!parsed || typeof parsed !== "object") return false;
  const r = parsed as Record<string, unknown>;
  return r.version === 2 && Array.isArray(r.admins) && Array.isArray(r.tokens);
}

async function writeRecord(record: AdminRecord): Promise<void> {
  await ensureDir();
  const tmp = `${FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(record, null, 2), "utf8");
  await fs.rename(tmp, FILE);
}

/**
 * Load the admin record. Returns `null` when the file is absent (the
 * caller should treat that as "system not yet bootstrapped"). Auto-
 * migrates v1 records on read and persists the upgrade.
 */
export async function readAdminRecord(): Promise<AdminRecord | null> {
  let raw: string;
  try {
    raw = await fs.readFile(FILE, "utf8");
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (isV2(parsed)) return parsed;

  // Migrate v1 → v2 on the spot.
  const migrated = migrateV1ToV2((parsed ?? {}) as LegacyV1);
  await writeRecord(migrated);
  return migrated;
}

// ── token helpers ────────────────────────────────────────────────────

function pruneExpired(record: AdminRecord): AdminRecord {
  const now = Date.now();
  return {
    ...record,
    tokens: record.tokens.filter((t) => Date.parse(t.expiresAt) > now),
  };
}

function mintToken(adminId: string): AdminToken {
  const now = Date.now();
  return {
    token: newTokenString(),
    adminId,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + TOKEN_TTL_MS).toISOString(),
  };
}

/** Returns the admin matched by a live Bearer token, or null. */
export async function findAdminByToken(
  presented: string,
): Promise<AdminUser | null> {
  if (!presented) return null;
  const record = await readAdminRecord();
  if (!record) return null;
  const now = Date.now();
  const tok = record.tokens.find(
    (t) => t.token === presented && Date.parse(t.expiresAt) > now,
  );
  if (!tok) return null;
  return record.admins.find((a) => a.id === tok.adminId) ?? null;
}

/** True when the presented Bearer matches a non-expired token. */
export async function isLiveAdminToken(presented: string): Promise<boolean> {
  return (await findAdminByToken(presented)) !== null;
}

// ── auth flows ───────────────────────────────────────────────────────

/**
 * Verify a `{username, password}` pair and, on success, mint and persist
 * a fresh Bearer token bound to that admin. Also opportunistically
 * prunes expired tokens.
 */
export async function loginAdmin(
  username: string,
  password: string,
): Promise<{ token: AdminToken; admin: AdminUser } | null> {
  const u = normaliseUsername(username);
  if (!u || !password) return null;
  const record = await readAdminRecord();
  if (!record) return null;
  const admin = record.admins.find((a) => a.username === u);
  if (!admin) return null;
  const ok = await verifyAdminPassword(password, admin.passwordHash);
  if (!ok) return null;
  const token = mintToken(admin.id);
  const next = pruneExpired(record);
  next.tokens = [...next.tokens, token];
  next.updatedAt = nowIso();
  await writeRecord(next);
  return { token, admin };
}

/** Revoke a single token (sign-out one device). Idempotent. */
export async function revokeAdminToken(token: string): Promise<void> {
  const record = await readAdminRecord();
  if (!record) return;
  const next: AdminRecord = {
    ...record,
    tokens: record.tokens.filter((t) => t.token !== token),
    updatedAt: nowIso(),
  };
  await writeRecord(next);
}

// ── self-service: change own password / username ─────────────────────

/**
 * The signed-in admin changes their own password.
 *
 * Tokens belonging to OTHER admins are untouched. Tokens belonging to
 * the same admin on OTHER devices are revoked; the presenter's own
 * token is preserved and a freshly minted one is also added.
 */
export async function changeOwnPassword(
  adminId: string,
  currentPassword: string,
  newPassword: string,
  presentedToken: string | null,
): Promise<AdminToken | null> {
  const record = await readAdminRecord();
  if (!record) return null;
  const idx = record.admins.findIndex((a) => a.id === adminId);
  if (idx < 0) return null;
  const admin = record.admins[idx];
  const ok = await verifyAdminPassword(currentPassword, admin.passwordHash);
  if (!ok) return null;
  const newHash = await hashAdminPassword(newPassword);
  const now = nowIso();
  const updatedAdmin: AdminUser = {
    ...admin,
    passwordHash: newHash,
    updatedAt: now,
  };
  const updatedAdmins = [...record.admins];
  updatedAdmins[idx] = updatedAdmin;
  // Drop OTHER sessions for this admin (other devices); keep the
  // presenter's token so the active browser stays signed in.
  const keptTokens = record.tokens.filter(
    (t) => t.adminId !== adminId || t.token === presentedToken,
  );
  const fresh = mintToken(adminId);
  const next: AdminRecord = {
    ...record,
    admins: updatedAdmins,
    tokens: [...keptTokens, fresh],
    updatedAt: now,
  };
  await writeRecord(next);
  return fresh;
}

/**
 * The signed-in admin changes their own username. Verifies the current
 * password as a safety check. Returns the updated SafeAdmin or null on
 * failure (wrong password, name taken, validation error).
 */
export async function changeOwnUsername(
  adminId: string,
  currentPassword: string,
  newUsername: string,
): Promise<{ ok: true; admin: SafeAdmin } | { ok: false; error: string }> {
  const usernameError = validateUsername(newUsername);
  if (usernameError) return { ok: false, error: usernameError };
  const target = normaliseUsername(newUsername);

  const record = await readAdminRecord();
  if (!record) return { ok: false, error: "System not initialised." };
  const idx = record.admins.findIndex((a) => a.id === adminId);
  if (idx < 0) return { ok: false, error: "Admin not found." };
  const admin = record.admins[idx];
  const passOk = await verifyAdminPassword(currentPassword, admin.passwordHash);
  if (!passOk) return { ok: false, error: "Current password is incorrect." };
  if (record.admins.some((a) => a.id !== adminId && a.username === target)) {
    return { ok: false, error: "Username is already taken." };
  }
  const updatedAdmin: AdminUser = {
    ...admin,
    username: target,
    updatedAt: nowIso(),
  };
  const updatedAdmins = [...record.admins];
  updatedAdmins[idx] = updatedAdmin;
  const next: AdminRecord = {
    ...record,
    admins: updatedAdmins,
    updatedAt: nowIso(),
  };
  await writeRecord(next);
  return { ok: true, admin: toSafeAdmin(updatedAdmin) };
}

// ── owner-only: manage other admins ──────────────────────────────────

export async function listAdmins(): Promise<SafeAdmin[]> {
  const record = await readAdminRecord();
  if (!record) return [];
  return record.admins
    .map(toSafeAdmin)
    .sort((a, b) => a.username.localeCompare(b.username));
}

export async function createAdmin(args: {
  username: string;
  password: string;
  role?: AdminRole;
}): Promise<{ ok: true; admin: SafeAdmin } | { ok: false; error: string }> {
  const usernameError = validateUsername(args.username);
  if (usernameError) return { ok: false, error: usernameError };
  const passwordError = validatePassword(args.password);
  if (passwordError) return { ok: false, error: passwordError };
  const username = normaliseUsername(args.username);
  const role: AdminRole = args.role === "owner" ? "owner" : "manager";

  const record = await readAdminRecord();
  if (!record) return { ok: false, error: "System not initialised." };
  if (record.admins.some((a) => a.username === username)) {
    return { ok: false, error: "Username is already taken." };
  }
  const now = nowIso();
  const admin: AdminUser = {
    id: newAdminId(),
    username,
    passwordHash: await hashAdminPassword(args.password),
    role,
    createdAt: now,
    updatedAt: now,
  };
  const next: AdminRecord = {
    ...record,
    admins: [...record.admins, admin],
    updatedAt: now,
  };
  await writeRecord(next);
  return { ok: true, admin: toSafeAdmin(admin) };
}

/**
 * Owner-only update: rename, reset password, or change role. Each field
 * is independently optional. Refuses to demote the last owner.
 */
export async function updateAdminById(
  adminId: string,
  patch: {
    username?: string;
    newPassword?: string;
    role?: AdminRole;
  },
): Promise<{ ok: true; admin: SafeAdmin } | { ok: false; error: string }> {
  const record = await readAdminRecord();
  if (!record) return { ok: false, error: "System not initialised." };
  const idx = record.admins.findIndex((a) => a.id === adminId);
  if (idx < 0) return { ok: false, error: "Admin not found." };
  const admin = record.admins[idx];

  let username = admin.username;
  if (typeof patch.username === "string" && patch.username !== admin.username) {
    const err = validateUsername(patch.username);
    if (err) return { ok: false, error: err };
    const target = normaliseUsername(patch.username);
    if (record.admins.some((a) => a.id !== adminId && a.username === target)) {
      return { ok: false, error: "Username is already taken." };
    }
    username = target;
  }

  let role = admin.role;
  if (patch.role === "owner" || patch.role === "manager") {
    if (
      patch.role !== admin.role &&
      admin.role === "owner" &&
      patch.role === "manager"
    ) {
      const otherOwners = record.admins.filter(
        (a) => a.id !== adminId && a.role === "owner",
      );
      if (otherOwners.length === 0) {
        return {
          ok: false,
          error: "Cannot demote the last owner.",
        };
      }
    }
    role = patch.role;
  }

  let passwordHash = admin.passwordHash;
  let revokedTokens = false;
  if (typeof patch.newPassword === "string" && patch.newPassword.length > 0) {
    const err = validatePassword(patch.newPassword);
    if (err) return { ok: false, error: err };
    passwordHash = await hashAdminPassword(patch.newPassword);
    revokedTokens = true; // forces other devices to re-login
  }

  const now = nowIso();
  const updated: AdminUser = {
    ...admin,
    username,
    role,
    passwordHash,
    updatedAt: now,
  };
  const updatedAdmins = [...record.admins];
  updatedAdmins[idx] = updated;
  const next: AdminRecord = {
    ...record,
    admins: updatedAdmins,
    tokens: revokedTokens
      ? record.tokens.filter((t) => t.adminId !== adminId)
      : record.tokens,
    updatedAt: now,
  };
  await writeRecord(next);
  return { ok: true, admin: toSafeAdmin(updated) };
}

/**
 * Owner-only delete. Refuses to remove the last surviving owner. Always
 * revokes the deleted admin's tokens.
 */
export async function deleteAdminById(
  adminId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const record = await readAdminRecord();
  if (!record) return { ok: false, error: "System not initialised." };
  const target = record.admins.find((a) => a.id === adminId);
  if (!target) return { ok: false, error: "Admin not found." };
  if (target.role === "owner") {
    const otherOwners = record.admins.filter(
      (a) => a.id !== adminId && a.role === "owner",
    );
    if (otherOwners.length === 0) {
      return { ok: false, error: "Cannot delete the last owner." };
    }
  }
  const next: AdminRecord = {
    ...record,
    admins: record.admins.filter((a) => a.id !== adminId),
    tokens: record.tokens.filter((t) => t.adminId !== adminId),
    updatedAt: nowIso(),
  };
  await writeRecord(next);
  return { ok: true };
}

/**
 * Bootstrap helper used by `scripts/init-admin.mjs`. Wipes any existing
 * record and creates a single owner with the given credentials.
 */
export async function provisionFirstOwner(
  username: string,
  password: string,
): Promise<AdminRecord> {
  const usernameError = validateUsername(username);
  if (usernameError) throw new Error(usernameError);
  const passwordError = validatePassword(password);
  if (passwordError) throw new Error(passwordError);
  const now = nowIso();
  const admin: AdminUser = {
    id: newAdminId(),
    username: normaliseUsername(username),
    passwordHash: await hashAdminPassword(password),
    role: "owner",
    createdAt: now,
    updatedAt: now,
  };
  const record: AdminRecord = {
    version: 2,
    admins: [admin],
    tokens: [],
    createdAt: now,
    updatedAt: now,
  };
  await writeRecord(record);
  return record;
}
