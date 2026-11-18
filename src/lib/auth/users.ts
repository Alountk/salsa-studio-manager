/**
 * The `users` table. Expected contents: exactly one admin (spec S4).
 * There is no signup path — the first user comes from env at boot, the
 * password changes only via `npm run change-password`.
 */
import type { Database } from "better-sqlite3";
import { hashPassword } from "./password";

export interface User {
  id: number;
  email: string;
  passwordHash: string;
}

interface UserRow {
  id: number;
  email: string;
  password_hash: string;
}

function toUser(row: UserRow): User {
  return { id: row.id, email: row.email, passwordHash: row.password_hash };
}

/**
 * Create the admin when the table is empty; no-op otherwise (a second call —
 * even with a different password — never overwrites the existing hash).
 */
export function ensureAdminUser(db: Database, email: string, password: string): void {
  const count = db.prepare("SELECT COUNT(*) AS n FROM users").get() as { n: number };
  if (count.n > 0) return;
  db.prepare("INSERT INTO users (email, password_hash) VALUES (?, ?)").run(email, hashPassword(password));
}

/** Look up a user by exact email, or `null`. */
export function findUserByEmail(db: Database, email: string): User | null {
  const row = db.prepare("SELECT id, email, password_hash FROM users WHERE email = ?").get(email);
  return row ? toUser(row as UserRow) : null;
}

/** Replace a user's password hash. */
export function setPassword(db: Database, userId: number, plain: string): void {
  db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(hashPassword(plain), userId);
}
