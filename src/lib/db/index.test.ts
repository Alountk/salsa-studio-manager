import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { openDb } from "./index";

describe("openDb", () => {
  it("creates all tables and applying migrations twice is a no-op", () => {
    const path = join(mkdtempSync(join(tmpdir(), "studio-db-")), "test.db");
    const db = openDb(path);
    const tables = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table'")
      .all()
      .map((r) => (r as { name: string }).name);
    expect(tables).toEqual(
      expect.arrayContaining([
        "users",
        "students",
        "invoices",
        "payments",
        "subscriptions",
        "sessions",
      ]),
    );
    db.close();
    openDb(path); // re-open: already-migrated file must not re-apply or throw
  });
});
