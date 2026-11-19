import Link from "next/link";
import {
  Avatar,
  Card,
  Icon,
  LinkButton,
  StatusPill,
  TBody,
  TD,
  THead,
  TH,
  TR,
  Table,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import { euros, type AdminInvoice } from "@/lib/billing";
import { EstadoFilter } from "./estado-filter";

/**
 * Design 3, screen 07 «Facturas», wired to real SQLite data (spec S3).
 * The designed structure stays (header, filter card, table, footer), but
 * every figure now derives from `invoices` and every control has a real
 * destination or is gone: search/period/method filters, bulk selection,
 * pagination, exports, and the demo row menu were inert design affordances
 * with no backing feature (plan non-goals: no exports or bulk operations).
 */

interface InvoiceListProps {
  invoices: AdminInvoice[];
}

export function InvoiceList({ invoices }: InvoiceListProps) {
  const totalCents = invoices.reduce((sum, invoice) => sum + invoice.amountCents, 0);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <section className="flex flex-col justify-between gap-4 md:items-end">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-display text-display text-on-surface">Facturas</h2>
            <span className="rounded-pill bg-surface-container-highest px-2.5 py-0.5 text-label text-primary">
              {invoices.length} emitidas
            </span>
          </div>
          <p className="mt-1 text-body-md text-on-surface-variant">
            Control de cobros, domiciliaciones y emisión de recibos del estudio.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <LinkButton href="/facturacion/nueva" icon="add">
            Nueva factura
          </LinkButton>
        </div>
      </section>

      {/* Filter bar: status is the one filter with a real query behind it */}
      <Card as="section" className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <EstadoFilter />
          <span className="text-body-sm text-on-surface-variant">
            La lista se ordena de más reciente a más antigua.
          </span>
        </div>
      </Card>

      {invoices.length === 0 ? (
        <div className="rounded-lg border border-outline-variant bg-surface px-6 py-12 text-center">
          <p className="text-body-md text-on-surface-variant">
            No hay facturas con este filtro.
          </p>
          <div className="mt-4">
            <LinkButton href="/facturacion/nueva" icon="add">
              Nueva factura
            </LinkButton>
          </div>
        </div>
      ) : (
        <div className="overflow-visible rounded-lg border border-outline-variant bg-surface shadow-card">
          <Table>
            <THead>
              <TH>Número</TH>
              <TH>Alumno</TH>
              <TH>Concepto</TH>
              <TH>Emitida</TH>
              <TH>Vencimiento</TH>
              <TH numeric>Importe</TH>
              <TH className="text-center">Estado</TH>
              <TH className="w-16 text-center">Acciones</TH>
            </THead>
            <TBody>
              {invoices.map((invoice) => {
                const overdue = invoice.status === "overdue";
                return (
                  <TR
                    key={invoice.number}
                    marked={overdue}
                    className={overdue ? "bg-primary-container/20" : undefined}
                  >
                    <TD>
                      <Link
                        href={`/facturacion/facturas/${invoice.number}`}
                        className="font-mono text-body-sm font-medium text-primary hover:underline"
                      >
                        {invoice.number}
                      </Link>
                    </TD>
                    <TD>
                      <span className="flex items-center gap-3">
                        <Avatar name={invoice.student} size={32} />
                        <span className="font-medium text-on-surface">{invoice.student}</span>
                      </span>
                    </TD>
                    <TD className="font-medium text-on-surface-variant">{invoice.concept}</TD>
                    <TD className="text-body-sm tabular-figures text-on-surface-variant">
                      {invoice.issuedOn}
                    </TD>
                    <TD
                      className={cn(
                        "text-body-sm tabular-figures",
                        overdue ? "font-medium text-error" : "text-on-surface-variant",
                      )}
                    >
                      {invoice.dueOn}
                    </TD>
                    <TD numeric className="font-semibold">
                      {euros(invoice.amountCents)}
                    </TD>
                    <TD className="text-center">
                      <StatusPill status={invoice.status} />
                    </TD>
                    <TD className="text-center">
                      <LinkButton
                        href={`/facturacion/facturas/${invoice.number}`}
                        variant="ghost"
                        size="compact"
                        aria-label={`Ver factura ${invoice.number}`}
                        className="mx-auto flex h-8 w-8 items-center justify-center rounded-full p-0"
                      >
                        <Icon name="chevron_right" />
                      </LinkButton>
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>

          {/* Footer: real recuento + total of what is shown */}
          <div className="flex select-none flex-wrap items-center justify-between gap-4 border-t border-outline-variant bg-surface px-6 py-4">
            <span className="text-body-sm text-on-surface-variant">
              Mostrando{" "}
              <strong className="font-semibold text-on-surface">1 a {invoices.length}</strong> de{" "}
              <strong className="font-semibold text-on-surface">{invoices.length}</strong> facturas
            </span>
            <div className="flex items-baseline gap-2 rounded-lg border border-outline-variant bg-primary-container/40 px-4 py-2">
              <span className="text-label uppercase text-on-surface-variant">Total listado:</span>
              <span className="font-display text-headline-sm tabular-figures text-on-surface">
                {euros(totalCents)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
