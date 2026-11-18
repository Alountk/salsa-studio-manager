/**
 * Seed CLI: `npm run seed` (honours DATABASE_PATH, default ./data/studio.db).
 * The seed logic lives in `src/lib/db/seed.ts` so tests can import it without
 * executing a CLI (this directory is an ES module package — scripts/package.json).
 */
import { todayIso } from "../src/lib/dates";
import { openDb } from "../src/lib/db/index";
import { runSeed } from "../src/lib/db/seed";

const db = openDb(process.env.DATABASE_PATH ?? "./data/studio.db");
const counts = runSeed(db, todayIso());
if (counts.students === 0) {
  console.log("Seed skipped: database already has students.");
} else {
  console.log(`Seeded ${counts.students} students, ${counts.invoices} invoices, ${counts.cuotas} cuotas.`);
}
db.close();
