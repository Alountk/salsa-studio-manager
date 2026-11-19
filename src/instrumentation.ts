/**
 * Server-startup hook. Next 16 calls `register()` once per server instance,
 * before it accepts requests (docs/02-guides/instrumentation: root, or `src/`
 * alongside `app`).
 *
 * Boot sequence (spec S5/S6): open the database (migrations + admin bootstrap
 * from ADMIN_* env inside `getDb()`), then generate any due cuota invoices so
 * a freshly started container bills even before someone opens a page.
 * `ensureDueInvoices` also runs on billing reads (T9/T10) — the two paths are
 * idempotent together, never double-billing.
 */
export async function register(): Promise<void> {
  // Proxy/edge instances also call register; SQLite only exists on nodejs.
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { getDb } = await import("./lib/db");
  const { ensureDueInvoices } = await import("./lib/db/subscriptions");
  const { todayIso } = await import("./lib/dates");

  ensureDueInvoices(getDb(), todayIso());
}
