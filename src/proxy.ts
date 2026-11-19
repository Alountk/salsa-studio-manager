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

/** Sections hidden by the billing simplification (spec S2) — redirected, never rendered. */
const HIDDEN_PREFIXES = [
  "/calendario",
  "/clases",
  "/ajustes",
  "/tarifas",
  "/registro",
  "/recuperar",
];

export function proxy(request: NextRequest): NextResponse {
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);
  const { pathname } = request.nextUrl;

  // Hidden sections redirect BEFORE the auth gate so a logged-in visitor
  // lands on "/" and an anonymous one on "/login" — never a loop.
  const isHidden = HIDDEN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  if (isHidden) {
    return NextResponse.redirect(new URL(hasSession ? "/" : "/login", request.url));
  }

  // `/login` is ALWAYS served (never bounced to "/"): the proxy cannot see
  // the database, so an orphaned cookie — expired session, restored volume —
  // would otherwise ping-pong forever between the optimistic proxy redirect
  // and requireUser's authoritative redirect (ERR_TOO_MANY_REDIRECTS,
  // caught by the T14 restore drill). Serving the form is self-healing: the
  // next successful login writes a fresh valid session over the bad cookie.
  if (pathname === "/login") {
    return NextResponse.next();
  }

  if (!hasSession) return NextResponse.redirect(new URL("/login", request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|ico)$).*)"],
};
