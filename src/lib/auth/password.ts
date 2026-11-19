/**
 * bcrypt password hashing (cost 10) — the only place that hashes or verifies
 * passwords, so seed/CLI/scripts can never drift from login behaviour.
 */
import { compareSync, genSaltSync, hashSync } from "bcryptjs";

const COST = 10;

/** Hash a plaintext password with a fresh salt. */
export function hashPassword(plain: string): string {
  return hashSync(plain, genSaltSync(COST));
}

/** Constant-time-enough bcrypt comparison; `false` on any mismatch or bad hash. */
export function verifyPassword(plain: string, hash: string): boolean {
  try {
    return compareSync(plain, hash);
  } catch {
    return false;
  }
}
