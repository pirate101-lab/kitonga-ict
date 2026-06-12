import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySession } from "@/lib/session";
import {
  ADMIN_SESSION_COOKIE_NAME,
  clearAdminSessionCookie,
  isAdminTokenAccepted,
} from "@/lib/admin-auth";

/**
 * Next 16 Proxy (formerly `middleware`).
 *
 * Gates `/dashboard` behind a valid client session and `/admin` behind
 * a valid studio admin session before either static shell renders.
 *
 * Notes:
 * - In Next 16 the file convention was renamed from `middleware` to
 *   `proxy`; the function must be named `proxy` (or default-exported).
 * - The `runtime` config option is NOT allowed in Proxy — it always
 *   runs on Node.js. That lets us use `node:crypto` directly through
 *   `verifySession` without any Edge gymnastics.
 *
 * API routes still enforce their own authorization with `requireAdmin()`.
 */
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value ?? "";
    if (await isAdminTokenAccepted(token)) {
      return NextResponse.next();
    }
    const loginUrl = new URL("/studio", request.url);
    const returnTo = pathname + request.nextUrl.search;
    loginUrl.searchParams.set("next", returnTo);
    const res = NextResponse.redirect(loginUrl);
    clearAdminSessionCookie(res);
    return res;
  }

  const clientToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = verifySession(clientToken);

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    const returnTo = pathname + request.nextUrl.search;
    loginUrl.searchParams.set("next", returnTo);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
