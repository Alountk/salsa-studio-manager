/**
 * Set a user's password from the command line — the replacement for the
 * self-service recovery pages that must never exist (spec S4: nothing lets
 * strangers in; the admin resets credentials out-of-band).
 *
 * Run: `npm run change-password -- <email> <newPassword>`
 * Exit 1 when the email is unknown or arguments are missing.
 */
import { findUserByEmail, setPassword } from "../src/lib/auth/users";
import { openDb } from "../src/lib/db/index";

function main(): void {
  // pnpm forwards npm's `--` separator to the script; drop it if present.
  const argv = process.argv.slice(2);
  if (argv[0] === "--") argv.shift();
  const [email, password] = argv;
  if (!email || !password) {
    console.error("Usage: npm run change-password -- <email> <newPassword>");
    process.exit(1);
  }

  const db = openDb(process.env.DATABASE_PATH ?? "./data/studio.db");
  const user = findUserByEmail(db, email);
  if (!user) {
    console.error(`No user found for email: ${email}`);
    db.close();
    process.exit(1);
  }

  setPassword(db, user.id, password);
  console.log(`Password updated for ${email}.`);
  db.close();
}

main();
