import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { openDb } from "../db/index";
import { clearAttempts, registerAttempt } from "./rate-limit";
import { hashPassword, verifyPassword } from "./password";
import {
  SESSION_COOKIE,
  SESSION_TTL_DAYS,
  createSession,
  destroySessionByToken,
  getSessionByToken,
} from "./session";
import { ensureAdminUser, findUserByEmail, setPassword } from "./users";

describe("password", () => {
  it("round-trips and rejects wrong passwords", () => {
    const hash = hashPassword("secret");
    expect(verifyPassword("secret", hash)).toBe(true);
    expect(verifyPassword("wrong", hash)).toBe(false);
  });
});

describe("ensureAdminUser", () => {
  it("creates the first user and never overwrites or adds a second", () => {
    const db = openDb(":memory:");
    ensureAdminUser(db, "admin@example.com", "first-pass-123");
    const first = findUserByEmail(db, "admin@example.com");
    expect(first).not.toBeNull();

    ensureAdminUser(db, "other@example.com", "different-pass-456");
    expect(findUserByEmail(db, "other@example.com")).toBeNull();
    expect(verifyPassword("first-pass-123", first?.passwordHash as string)).toBe(true);
  });

  it("setPassword replaces the hash", () => {
    const db = openDb(":memory:");
    ensureAdminUser(db, "admin@example.com", "old-pass-123");
    const user = findUserByEmail(db, "admin@example.com");
    setPassword(db, user?.id as number, "new-pass-789");
    const updated = findUserByEmail(db, "admin@example.com");
    expect(verifyPassword("new-pass-789", updated?.passwordHash as string)).toBe(true);
    expect(verifyPassword("old-pass-123", updated?.passwordHash as string)).toBe(false);
  });
});

describe("sessions", () => {
  it("round-trips a token and rejects unknown, expired, and destroyed sessions", () => {
    const db = openDb(":memory:");
    ensureAdminUser(db, "admin@example.com", "pass-123");
    const user = findUserByEmail(db, "admin@example.com");
    const now = "2026-11-19T10:00:00.000Z";

    expect(SESSION_COOKIE).toBe("studio_session");
    expect(SESSION_TTL_DAYS).toBe(7);

    const token = createSession(db, user?.id as number, now);
    expect(getSessionByToken(db, token, now)).toMatchObject({ userId: user?.id });
    expect(getSessionByToken(db, "unknown-token", now)).toBeNull();
    expect(getSessionByToken(db, undefined, now)).toBeNull();

    // Past the TTL the session must stop resolving.
    const afterTtl = new Date(Date.parse(now) + (SESSION_TTL_DAYS * 86400 + 60) * 1000).toISOString();
    expect(getSessionByToken(db, token, afterTtl)).toBeNull();

    // A row already expired at insert time (injected directly) never resolves.
    const expiredToken = "expired-token";
    const expiredHash = createHash("sha256").update(expiredToken).digest("hex");
    db.prepare("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)").run(
      expiredHash,
      user?.id as number,
      "2026-11-01T00:00:00.000Z",
    );
    expect(getSessionByToken(db, expiredToken, now)).toBeNull();

    // Destruction kills the session immediately.
    const live = createSession(db, user?.id as number, now);
    destroySessionByToken(db, live);
    expect(getSessionByToken(db, live, now)).toBeNull();
  });
});

describe("rate limit", () => {
  it("allows five attempts per window, blocks the sixth, resets on clear", () => {
    const key = "ip-1.2.3.4";
    for (let i = 0; i < 5; i += 1) {
      expect(registerAttempt(key)).toEqual({ allowed: true });
    }
    expect(registerAttempt(key)).toEqual({ allowed: false });
    expect(registerAttempt(key)).toEqual({ allowed: false });

    clearAttempts(key);
    expect(registerAttempt(key)).toEqual({ allowed: true });
  });
});
