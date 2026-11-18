/**
 * Set a user's password from the command line — the replacement for the
 * self-service recovery pages that must never exist (spec S4: nothing lets
 * strangers in; the admin resets credentials out-of-band).
 *
 * Run: `npm run change-password -- <email> <newPassword>`
 * Exit 1 when the email is unknown.
 */
import { hashSync } from "bcryptjs";
import { openDb } from "../src/lib/db/index";

function main(): void {
  const [email, password] = process.argv.slice(2);
  if (!email || !password) {
    console.error("Usage: npm run change-password -- <email> <newPassword>");
    process.exit(1);
  }

  const db = openDb(process.env.DATABASE_PATH ?? "./data/studio.db");
  const user = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (!user) {
    console.error(`No user found for email: ${email}`);
    db.close();
    process.exit(1);
  }

  db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(
    hashSync(password, 10),
    (user as { id: number }).id,
  );
  console.log(`Password updated for ${email}.`);
  db.close();
}

main();
