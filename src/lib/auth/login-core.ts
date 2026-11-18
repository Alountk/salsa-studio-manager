/**
 * Pure login decision: rate-limit first, then credentials, with an identical
 * error for unknown email and wrong password (no user enumeration). A success
 * clears the rate-limit counter for the key.
 */
import type { Database } from "better-sqlite3";
import { clearAttempts, registerAttempt } from "./rate-limit";
import { verifyPassword } from "./password";
import { findUserByEmail } from "./users";

export type AttemptResult = { ok: true; userId: number } | { ok: false; error: string };

const RATE_LIMIT_ERROR = "Demasiados intentos. Prueba de nuevo en un minuto.";
const CREDENTIALS_ERROR = "La contraseña no es correcta";

export function attemptLogin(
  db: Database,
  email: string,
  password: string,
  key: string,
): AttemptResult {
  if (!registerAttempt(key).allowed) return { ok: false, error: RATE_LIMIT_ERROR };

  const user = findUserByEmail(db, email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { ok: false, error: CREDENTIALS_ERROR };
  }

  clearAttempts(key);
  return { ok: true, userId: user.id };
}
