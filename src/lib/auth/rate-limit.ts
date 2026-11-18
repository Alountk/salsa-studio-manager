/**
 * In-memory per-key login rate limit: MAX_ATTEMPTS per rolling minute.
 * Correct for the single-container deployment (spec S5) — no cross-process
 * state exists. A success calls `clearAttempts`.
 */

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 60_000;

interface AttemptEntry {
  count: number;
  windowStart: number;
}

const attempts = new Map<string, AttemptEntry>();

/** Record one attempt for `key`; `allowed: false` once the window is exceeded. */
export function registerAttempt(key: string): { allowed: boolean } {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    attempts.set(key, { count: 1, windowStart: now });
    return { allowed: true };
  }

  entry.count += 1;
  if (entry.count > MAX_ATTEMPTS) return { allowed: false };
  return { allowed: true };
}

/** Forget the counter for `key` (called after a successful login). */
export function clearAttempts(key: string): void {
  attempts.delete(key);
}
