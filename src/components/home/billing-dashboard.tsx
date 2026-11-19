/**
 * Inicio — panel de cobros (the reframed home, spec S3: "un registro de los
 * que pagan y los que no"). Server component: KPI cards over derived invoice
 * state plus the most recent invoices, each linking to its detail.
 */
import Link from "next/link";
import { MetricCard, StatusPill } from "@/components/ui";
import { euros } from "@/lib/billing";
import { formatEs } from "@/lib/dates";
import type { InvoiceWithStatus } from "@/lib/db/invoices";

export interface BillingDashboardProps {
  kpis: {
    pendingCents: number;
    overdueCents: number;
    collectedMonthCents: number;
  };
  recent: InvoiceWithStatus[];
}

export function BillingDashboard({ kpis, recent }: BillingDashboardProps) {
  return (
    <div className="flex flex-col gap-8">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          label="Pendiente de cobro"
          value={euros(kpis.pendingCents)}
          hint="Facturas por cobrar, aún a tiempo"
        />
        <MetricCard
          label="Vencido"
          value={euros(kpis.overdueCents)}
          hint="Más allá de la fecha de vencimiento"
        />
        <MetricCard
          label="Cobrado este mes"
          value={euros(kpis.collectedMonthCents)}
          hint="Pagos registrados en el mes"
        />
      </section>

      <section className="overflow-hidden rounded-md border border-outline-variant bg-surface">
        <div className="flex items-center justify-between border-b border-outline-variant px-5 py-4">
          <h2 className="font-display text-headline-sm text-on-surface">Facturas recientes</h2>
          <Link
            href="/facturacion"
            className="text-body-sm font-medium text-primary hover:underline"
          >
            Ver todas
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="px-5 py-8 text-body-md text-on-surface-variant">
            Todavía no hay facturas. Crea la primera en Facturación.
          </p>
        ) : (
          <ul>
            {recent.map((invoice) => (
              <li key={invoice.number}>
                <Link
                  href={`/facturacion/facturas/${invoice.number}`}
                  className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-outline-variant px-5 py-3 transition-colors last:border-b-0 hover:bg-surface-container-low"
                >
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-body-md font-medium text-on-surface">
                      {invoice.studentName}
                    </span>
                    <span className="truncate text-body-sm text-on-surface-variant">
                      {invoice.number} · {invoice.concept} · vence {formatEs(invoice.dueDate)}
                    </span>
                  </span>
                  <span className="text-body-md font-medium text-on-surface tabular-nums">
                    {euros(invoice.grossCents)}
                  </span>
                  <StatusPill status={invoice.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
