/**
 * Route gate (Next 16 calls middleware "proxy" — see dist/docs/16-proxy.md).
 *
 * Optimistic presence check only, per Next's own guidance: it redirects
 * cookie-less visitors to `/login` and logged-in visitors away from it. The
 * AUTHORITATIVE session validation is `requireUser()` in the (app) layout,
 * which resolves the token against the database.
 */
import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "./lib/auth/session";

export function proxy(request: NextRequest): NextResponse {
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);
  const { pathname } = request.nextUrl;

  if (pathname === "/login") {
    if (hasSession) return NextResponse.redirect(new URL("/", request.url));
    return NextResponse.next();
  }

  if (!hasSession) return NextResponse.redirect(new URL("/login", request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|ico)$).*)"],
};
