import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { proxy } from "./proxy";

function request(path: string, cookie?: string): NextRequest {
  return new NextRequest(`http://localhost:3000${path}`, {
    headers: cookie ? { cookie: `studio_session=${cookie}` } : {},
  });
}

describe("proxy", () => {
  it("redirects an unauthenticated / to /login with 307", () => {
    const res = proxy(request("/"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toMatch(/\/login$/);
  });

  it("redirects an unauthenticated /facturacion to /login", () => {
    const res = proxy(request("/facturacion"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toMatch(/\/login$/);
  });

  it("passes a cookie holder through optimistically (no redirect, no location)", () => {
    const res = proxy(request("/facturacion", "any-token-at-all"));
    expect(res.headers.get("location")).toBeNull();
    expect(res.status).toBe(200);
  });

  it("serves /login even to a cookie holder (orphaned cookies must never loop)", () => {
    // The proxy is optimistic (no DB access): bouncing a stale cookie away
    // from /login ping-pongs with requireUser's authoritative redirect.
    const res = proxy(request("/login", "any-token-at-all"));
    expect(res.headers.get("location")).toBeNull();
    expect(res.status).toBe(200);
  });

  it("keeps an anonymous visitor on /login", () => {
    const res = proxy(request("/login"));
    expect(res.headers.get("location")).toBeNull();
  });
});

describe("proxy hidden sections", () => {
  const HIDDEN = ["/calendario", "/clases/nueva", "/ajustes", "/tarifas", "/registro", "/recuperar"];

  it.each(HIDDEN)("sends an anonymous visitor from %s to /login", (path) => {
    const res = proxy(request(path));
    expect(res.status).toBe(307);
    expect(new URL(res.headers.get("location") as string).pathname).toBe("/login");
  });

  it.each(HIDDEN)("sends a session holder from %s to exactly / (never a loop partner)", (path) => {
    const res = proxy(request(path, "any-token"));
    expect(res.status).toBe(307);
    expect(new URL(res.headers.get("location") as string).pathname).toBe("/");
  });
});
