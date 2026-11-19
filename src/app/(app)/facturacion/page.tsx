import { connection } from "next/server";
import { InvoiceList } from "@/components/billing/invoice-list";
import { todayIso } from "@/lib/dates";
import { getDb } from "@/lib/db";
import { listInvoices, toAdminInvoice, type InvoiceFilter } from "@/lib/db/invoices";
import { ensureDueInvoices } from "@/lib/db/subscriptions";

/**
 * `/facturacion` — the real invoice list (billing simplification, spec S3).
 * Replaces the role-aware revenue/student screens (those components stay in
 * `src/components/billing/` unreferenced — hide, don't delete). Reading this
 * page also runs due cuota generation (spec S6).
 *
 * `await connection()` comes first (cacheComponents rule from T9): nothing
 * below — SQLite, `new Date()`, searchParams — may run during prerender.
 */
const STATUS_FILTERS: Record<string, InvoiceFilter> = {
  pagadas: "paid",
  pendientes: "pending",
  vencidas: "overdue",
};

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  await connection();
  const { estado } = await searchParams;

  const db = getDb();
  ensureDueInvoices(db, todayIso());

  const filter: InvoiceFilter = STATUS_FILTERS[estado ?? ""] ?? "all";
  const invoices = listInvoices(db, filter).map(toAdminInvoice);

  return <InvoiceList invoices={invoices} />;
}
