/**
 * Bootstrap or rotate the studio admin account.
 *
 * Writes a v2 record into `<KITONGA_DATA_DIR>/admin.json`:
 *
 *   {
 *     "version": 2,
 *     "admins": [{ "id", "username", "passwordHash", "role": "owner", ... }],
 *     "tokens": [],
 *     "createdAt", "updatedAt"
 *   }
 *
 * Inputs (env or CLI args):
 *
 *   ADMIN_INITIAL_USERNAME   (env)       or   argv[2]
 *   ADMIN_INITIAL_PASSWORD   (env)       or   argv[3]
 *
 * Refuses to overwrite an existing record unless FORCE=1 is set, so
 * idempotent re-runs are safe.
 *
 * Examples:
 *
 *   ADMIN_INITIAL_USERNAME='kitonga' ADMIN_INITIAL_PASSWORD='Sup3r-Strong!' \
 *     node scripts/init-admin.mjs
 *
 *   node scripts/init-admin.mjs kitonga 'Sup3r-Strong!'
 *
 *   FORCE=1 ADMIN_INITIAL_USERNAME='kitonga' ADMIN_INITIAL_PASSWORD='Sup3r-Strong!' \
 *     node scripts/init-admin.mjs        # overwrite + wipe live tokens
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes, scrypt as scryptCb } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCb);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = process.env.KITONGA_DATA_DIR || path.join(ROOT, "data");
const FILE = path.join(DATA_DIR, "admin.json");

const SCRYPT_KEYLEN = 64;
const SALT_BYTES = 16;
const ID_BYTES = 8;
const MIN_PASSWORD_LENGTH = 8;
const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 32;
const USERNAME_PATTERN = /^[a-z0-9_-]+$/;

function normaliseUsername(s) {
  return String(s ?? "").trim().toLowerCase();
}

function validateUsername(u) {
  if (u.length < MIN_USERNAME_LENGTH || u.length > MAX_USERNAME_LENGTH) {
    return `Username must be ${MIN_USERNAME_LENGTH}–${MAX_USERNAME_LENGTH} characters.`;
  }
  if (!USERNAME_PATTERN.test(u)) {
    return "Username may contain only lowercase letters, digits, underscores and hyphens.";
  }
  return null;
}

async function hashPassword(password) {
  const salt = randomBytes(SALT_BYTES);
  const derived = await scrypt(password, salt, SCRYPT_KEYLEN);
  return `scrypt:${salt.toString("hex")}:${derived.toString("hex")}`;
}

async function main() {
  const username = normaliseUsername(
    process.env.ADMIN_INITIAL_USERNAME ?? process.argv[2] ?? "",
  );
  const password = process.env.ADMIN_INITIAL_PASSWORD ?? process.argv[3] ?? "";

  if (!username) {
    console.error(
      "Missing username. Pass it via ADMIN_INITIAL_USERNAME env var or as the first CLI argument.",
    );
    process.exit(1);
  }
  const usernameError = validateUsername(username);
  if (usernameError) {
    console.error(usernameError);
    process.exit(1);
  }
  if (!password) {
    console.error(
      "Missing password. Pass it via ADMIN_INITIAL_PASSWORD env var or as the second CLI argument.",
    );
    process.exit(1);
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    console.error(`Password too short: minimum ${MIN_PASSWORD_LENGTH} characters.`);
    process.exit(1);
  }

  await fs.mkdir(DATA_DIR, { recursive: true });

  let existing = null;
  try {
    const buf = await fs.readFile(FILE, "utf8");
    existing = JSON.parse(buf);
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }

  const force = !!process.env.FORCE;
  if (existing && !force) {
    console.error(
      `${FILE} already exists. Re-run with FORCE=1 to overwrite (this wipes all live admin sessions).`,
    );
    process.exit(2);
  }

  const now = new Date().toISOString();
  const record = {
    version: 2,
    admins: [
      {
        id: randomBytes(ID_BYTES).toString("hex"),
        username,
        passwordHash: await hashPassword(password),
        role: "owner",
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
      },
    ],
    tokens: [],
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  const tmp = `${FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(record, null, 2), "utf8");
  await fs.rename(tmp, FILE);

  console.log(`✔ wrote admin record to ${FILE}`);
  console.log(
    `  username=${username}  role=owner  password length=${password.length} chars · all previous tokens wiped`,
  );
}

main().catch((err) => {
  console.error("init-admin failed:", err);
  process.exit(1);
});
