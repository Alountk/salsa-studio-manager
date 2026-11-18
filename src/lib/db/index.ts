/**
 * SQLite connection and migration runner.
 *
 * `openDb(path)` is the testable primitive: it opens a database file (or
 * `:memory:`), enables WAL for file databases, turns foreign keys on, and
 * applies any pending migration from `src/lib/db/migrations/*.sql` in lexical
 * order, tracked with `PRAGMA user_version`. Re-opening an already-migrated
 * file is a no-op.
 *
 * `getDb()` is the application singleton used by pages and server actions;
 * its path comes from the `DATABASE_PATH` environment variable (see the
 * Global Constraints of the implementation plan).
 */
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import Sqlite from "better-sqlite3";
import type { Database } from "better-sqlite3";

const MIGRATIONS_DIR = path.join(process.cwd(), "src/lib/db/migrations");

let appDb: Database | undefined;

/** Apply pending `NNN-name.sql` migrations, in lexical order, one transaction each. */
function migrate(db: Database): void {
  const files = readdirSync(MIGRATIONS_DIR)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  const current = db.pragma("user_version", { simple: true }) as number;

  for (const file of files) {
    const version = Number.parseInt(file.split("-")[0] ?? "", 10);
    if (Number.isNaN(version) || version <= current) continue;

    const sql = readFileSync(path.join(MIGRATIONS_DIR, file), "utf8");
    db.transaction(() => {
      db.exec(sql);
      db.pragma(`user_version = ${version}`);
    })();
  }
}

/** Open a SQLite database at `dbPath` and bring it up to the latest migration. */
export function openDb(dbPath: string): Database {
  const db = new Sqlite(dbPath);
  if (dbPath !== ":memory:") {
    db.pragma("journal_mode = WAL");
  }
  db.pragma("foreign_keys = ON");
  migrate(db);
  return db;
}

/** Process-wide application database; path from `DATABASE_PATH`, default `./data/studio.db`. */
export function getDb(): Database {
  if (appDb === undefined) {
    appDb = openDb(process.env.DATABASE_PATH ?? "./data/studio.db");
  }
  return appDb;
}
