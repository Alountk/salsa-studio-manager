/**
 * Session tokens: the raw token lives only in the client's cookie; the
 * database stores its SHA-256, so a database leak cannot be replayed as a
 * session. Pure functions over an explicit `now` — the `next/headers` cookie
 * wrappers live in `guards.ts` (spec S4: 7-day sessions).
 */
import { createHash, randomBytes } from "node:crypto";
import type { Database } from "better-sqlite3";

export const SESSION_COOKIE = "studio_session";
export const SESSION_TTL_DAYS = 7;

export interface SessionInfo {
  sessionId: number;
  userId: number;
}

interface SessionRow {
  id: number;
  user_id: number;
  expires_at: string;
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/** Create a session for `userId`; returns the raw cookie token (store it, never log it). */
export function createSession(db: Database, userId: number, now: string): string {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.parse(now) + SESSION_TTL_DAYS * 86400_000).toISOString();
  db.prepare("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)").run(
    sha256(token),
    userId,
    expiresAt,
  );
  return token;
}

/** Resolve a cookie token to its session, or `null` for unknown/expired tokens. */
export function getSessionByToken(
  db: Database,
  token: string | undefined,
  now: string,
): SessionInfo | null {
  if (!token) return null;
  const row = db
    .prepare("SELECT id, user_id, expires_at FROM sessions WHERE token_hash = ?")
    .get(sha256(token)) as SessionRow | undefined;
  if (!row || row.expires_at <= now) return null;
  return { sessionId: row.id, userId: row.user_id };
}

/** Delete the session behind `token` (logout). Safe to call with unknown tokens. */
export function destroySessionByToken(db: Database, token: string): void {
  db.prepare("DELETE FROM sessions WHERE token_hash = ?").run(sha256(token));
}
