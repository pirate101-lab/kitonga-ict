import { NextResponse } from "next/server";
import {
  getEnvAdminToken,
  setAdminSessionCookie,
} from "@/lib/admin-auth";
import {
  loginAdmin,
  provisionFirstOwner,
  readAdminRecord,
  toSafeAdmin,
} from "@/lib/admin-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/admin/login
 * Body: { username: string, password: string }
 *
 * Verifies the credentials against `data/admin.json` and, on success,
 * mints and persists a fresh Bearer token for that admin. Returns
 * `{ ok: true, token, admin: { id, username, role, ... } }`.
 *
 * Bootstrap fallback: if no admin record exists yet, accepts the env
 * `ADMIN_API_TOKEN` (or `ADMIN_PASSWORD`) as the first password and
 * provisions the supplied username as the owner account.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      username?: unknown;
      password?: unknown;
    };
    const username = typeof body.username === "string" ? body.username : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!password) {
      return NextResponse.json(
        { ok: false, error: "Missing password." },
        { status: 400 },
      );
    }

    const record = await readAdminRecord();

    if (record) {
      if (!username) {
        return NextResponse.json(
          { ok: false, error: "Missing username." },
          { status: 400 },
        );
      }
      const result = await loginAdmin(username, password);
      if (!result) {
        return NextResponse.json(
          { ok: false, error: "Invalid username or password." },
          { status: 401 },
        );
      }
      const res = NextResponse.json({
        ok: true,
        token: result.token.token,
        admin: toSafeAdmin(result.admin),
      });
      setAdminSessionCookie(res, result.token.token, result.token.expiresAt);
      return res;
    }

    // ── No admin record yet — bootstrap path ──────────────────────────
    const envToken = getEnvAdminToken();
    if (!envToken) {
      return NextResponse.json(
        { ok: false, error: "Server missing admin configuration." },
        { status: 500 },
      );
    }
    if (!username) {
      return NextResponse.json(
        { ok: false, error: "Missing username." },
        { status: 400 },
      );
    }
    if (password !== envToken) {
      return NextResponse.json(
        { ok: false, error: "Invalid password." },
        { status: 401 },
      );
    }
    try {
      await provisionFirstOwner(username, password);
    } catch (err) {
      return NextResponse.json(
        {
          ok: false,
          error:
            err instanceof Error
              ? err.message
              : "Could not initialise admin account.",
        },
        { status: 400 },
      );
    }
    const result = await loginAdmin(username, password);
    if (!result) {
      return NextResponse.json(
        { ok: false, error: "Could not initialise admin account." },
        { status: 500 },
      );
    }
    const res = NextResponse.json({
      ok: true,
      token: result.token.token,
      admin: toSafeAdmin(result.admin),
    });
    setAdminSessionCookie(res, result.token.token, result.token.expiresAt);
    return res;
  } catch (err) {
    console.error("[/api/admin/login] failed", err);
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Unknown error.",
      },
      { status: 500 },
    );
  }
}
