import { describe, expect, it } from "vitest";
import { openDb } from "../db/index";
import { attemptLogin } from "./login-core";
import { clearAttempts, registerAttempt } from "./rate-limit";
import { ensureAdminUser, findUserByEmail } from "./users";

function setup() {
  const db = openDb(":memory:");
  ensureAdminUser(db, "owner@studio.test", "right-pass-123");
  return { db, userId: findUserByEmail(db, "owner@studio.test")?.id as number };
}

describe("attemptLogin", () => {
  it("accepts the right password for the right user", () => {
    const { db, userId } = setup();
    expect(attemptLogin(db, "owner@studio.test", "right-pass-123", "ip-ok")).toEqual({
      ok: true,
      userId,
    });
  });

  it("returns the same error for a wrong password and an unknown email", () => {
    const { db } = setup();
    const wrongPassword = attemptLogin(db, "owner@studio.test", "nope", "ip-1");
    const unknownEmail = attemptLogin(db, "nobody@studio.test", "whatever", "ip-2");
    expect(wrongPassword).toEqual({ ok: false, error: "La contraseña no es correcta" });
    expect(unknownEmail).toEqual({ ok: false, error: "La contraseña no es correcta" });
  });

  it("blocks the sixth consecutive attempt with the rate-limit message", () => {
    const { db } = setup();
    const key = "ip-blocked";
    for (let i = 0; i < 5; i += 1) {
      expect(attemptLogin(db, "owner@studio.test", "wrong", key)).toEqual({
        ok: false,
        error: "La contraseña no es correcta",
      });
    }
    // Even the CORRECT password must be refused while the window is hot.
    expect(attemptLogin(db, "owner@studio.test", "right-pass-123", key)).toEqual({
      ok: false,
      error: "Demasiados intentos. Prueba de nuevo en un minuto.",
    });

    clearAttempts(key);
    expect(attemptLogin(db, "owner@studio.test", "right-pass-123", key).ok).toBe(true);
  });

  it("does not count an allowed attempt as blocked before the limit", () => {
    const key = "ip-limit-check";
    for (let i = 0; i < 5; i += 1) expect(registerAttempt(key).allowed).toBe(true);
    expect(registerAttempt(key).allowed).toBe(false);
  });
});
