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

  it("sends a cookie holder away from /login to /", () => {
    const res = proxy(request("/login", "any-token-at-all"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toMatch(/\/$/);
  });

  it("keeps an anonymous visitor on /login", () => {
    const res = proxy(request("/login"));
    expect(res.headers.get("location")).toBeNull();
  });
});
