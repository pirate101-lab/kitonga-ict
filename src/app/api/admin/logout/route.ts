import { NextResponse } from "next/server";
import { revokeAdminToken } from "@/lib/admin-store";
import {
  clearAdminSessionCookie,
  extractAdminToken,
} from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/admin/logout
 *
 * Revokes the presented Bearer token from the admin store. Always
 * returns 200 — the client is expected to clear its localStorage entry
 * regardless.
 */
export async function POST(req: Request) {
  const presented = extractAdminToken(req);
  if (presented) {
    try {
      await revokeAdminToken(presented);
    } catch (err) {
      console.error("[/api/admin/logout] revoke failed", err);
    }
  }
  const res = NextResponse.json({ ok: true });
  clearAdminSessionCookie(res);
  return res;
}
