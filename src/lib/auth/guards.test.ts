import { beforeEach, describe, expect, it, vi } from "vitest";

// Request-scoped cookie store, mocked at the next/headers boundary.
const state = vi.hoisted(() => ({ token: undefined as string | undefined }));
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) =>
      state.token && name === "studio_session" ? { name, value: state.token } : undefined,
  }),
}));

import { getDb } from "../db/index";
import { requireUser } from "./guards";
import { createSession } from "./session";
import { ensureAdminUser, findUserByEmail } from "./users";

process.env.DATABASE_PATH = ":memory:";

function seedSession(): number {
  const db = getDb();
  ensureAdminUser(db, "owner@studio.test", "pass-123");
  const userId = findUserByEmail(db, "owner@studio.test")?.id as number;
  const token = createSession(db, userId, new Date().toISOString());
  state.token = token;
  return userId;
}

describe("requireUser", () => {
  beforeEach(() => {
    state.token = undefined;
  });

  it("redirects to /login when no session cookie is present", async () => {
    await expect(requireUser()).rejects.toMatchObject({
      digest: expect.stringContaining("NEXT_REDIRECT"),
    });
  });

  it("returns the userId for a valid session", async () => {
    const userId = seedSession();
    await expect(requireUser()).resolves.toEqual({ userId });
  });

  it("redirects when the cookie holds a token that is not in the database", async () => {
    seedSession();
    state.token = "forged-token-value";
    await expect(requireUser()).rejects.toMatchObject({
      digest: expect.stringContaining("NEXT_REDIRECT"),
    });
  });
});
