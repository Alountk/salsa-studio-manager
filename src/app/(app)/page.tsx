import { connection } from "next/server";
import { BillingDashboard } from "@/components/home/billing-dashboard";
import { todayIso } from "@/lib/dates";
import { getDb } from "@/lib/db";
import { listInvoices } from "@/lib/db/invoices";
import { collectedInMonthCents } from "@/lib/db/payments";
import { ensureDueInvoices } from "@/lib/db/subscriptions";

/**
 * Inicio — the cobros dashboard (billing simplification, spec S3).
 *
 * Replaces the three designed role homes; those components stay in
 * `src/components/home/` unreferenced (spec non-goal: hide, don't delete).
 * Reading this page also runs due cuota generation (spec S6: at startup and
 * whenever billing pages are read).
 */
export default async function HomePage() {
  // cacheComponents: stop prerendering here — KPIs, `new Date()`, and SQLite
  // queries must run per request, never bake into a static shell.
  await connection();

  const db = getDb();
  const today = todayIso();
  ensureDueInvoices(db, today);

  const invoices = listInvoices(db);
  const unpaid = invoices.filter((invoice) => invoice.status !== "paid");
  const sum = (rows: typeof invoices): number =>
    rows.reduce((total, invoice) => total + (invoice.grossCents - invoice.paidCents), 0);

  return (
    <BillingDashboard
      kpis={{
        pendingCents: sum(unpaid.filter((invoice) => invoice.status === "pending")),
        overdueCents: sum(unpaid.filter((invoice) => invoice.status === "overdue")),
        collectedMonthCents: collectedInMonthCents(db, today.slice(0, 7)),
      }}
      recent={invoices.slice(0, 8)}
    />
  );
}
