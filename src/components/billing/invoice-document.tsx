import Link from "next/link";
import { Card, Icon, LinkButton, StatusPill, Table, TBody, TD, THead, TH, TR } from "@/components/ui";
import { INVOICE_DETAIL, VAT_RATE, euros } from "@/lib/billing";
import { formatEs } from "@/lib/dates";
import type { InvoiceWithStatus } from "@/lib/db/invoices";
import type { Payment } from "@/lib/db/payments";
import type { Student } from "@/lib/db/students";

/**
 * Design 3, screen 05 — invoice document over REAL data (spec S3).
 *
 * Structure and studio identity copy follow the designed export; the buyer,
 * line, and totals blocks come from the stored invoice + student + payments.
 * The mail/PDF buttons are gone (non-goals: no email, no invoice issuance);
 * the honest action is «Registrar pago» while the invoice is unpaid. When
 * 0 < paid < gross the sheet shows «Pagado X de Y» and the status pill stays
 * Pendiente (partial-payment UI from the plan).
 */
interface InvoiceDocumentProps {
  invoice: InvoiceWithStatus;
  student: Student;
  payments: Payment[];
}

export function InvoiceDocument({ invoice, student, payments }: InvoiceDocumentProps) {
  const { issuer, legal } = INVOICE_DETAIL;
  const lastPayment = payments.at(-1);
  const partial = invoice.paidCents > 0 && invoice.paidCents < invoice.grossCents;
  const pendingCents = Math.max(invoice.grossCents - invoice.paidCents, 0);

  return (
    <div className="w-full">
      {/* Action bar */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <Link
            href="/facturacion"
            className="group inline-flex w-fit items-center gap-1.5 text-body-sm text-on-surface-variant transition-colors hover:text-primary"
          >
            <Icon
              name="arrow_back"
              className="text-base transition-transform group-hover:-translate-x-0.5"
            />
            Volver a Facturación
          </Link>
          <div className="flex items-center gap-3">
            <h2 className="font-display text-headline-lg text-on-surface">
              Factura {invoice.number}
            </h2>
            <StatusPill status={invoice.status} />
          </div>
        </div>
        {invoice.status !== "paid" ? (
          <div className="flex items-center gap-3">
            <LinkButton href={`/facturacion/facturas/${invoice.number}?registrar`} icon="check_circle">
              Registrar pago
            </LinkButton>
          </div>
        ) : null}
      </div>

      {/* Document sheet */}
      <Card className="mx-auto w-full max-w-[800px]">
        {/* Header: issuer left, invoice metadata right */}
        <div className="flex justify-between gap-6 border-b border-outline-variant pb-8">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-primary text-on-primary">
                <Icon name="music_note" className="text-base" />
              </span>
              <span className="font-display text-headline-sm text-primary">{issuer.name}</span>
            </div>
            <div className="space-y-0.5 text-body-sm text-on-surface-variant">
              <p className="font-medium text-on-surface">{issuer.taxId}</p>
              <p>{issuer.address}</p>
              <p>{issuer.city}</p>
              <p className="text-primary">{issuer.email}</p>
            </div>
          </div>
          <div className="flex flex-col items-end text-right">
            <span className="text-label uppercase text-on-surface-variant/80">
              Número de Factura
            </span>
            <span className="mb-2 font-display text-headline-md tracking-tight tabular-figures text-on-surface">
              {invoice.number}
            </span>
            <div className="space-y-1 text-body-sm">
              <div className="flex justify-end gap-3">
                <span className="text-on-surface-variant">Fecha de emisión:</span>
                <span className="text-label-tabular text-on-surface">{formatEs(invoice.issueDate)}</span>
              </div>
              <div className="flex justify-end gap-3">
                <span className="text-on-surface-variant">Fecha de vencimiento:</span>
                <span className="text-label-tabular text-on-surface">{formatEs(invoice.dueDate)}</span>
              </div>
              <div className="flex justify-end gap-3">
                <span className="text-on-surface-variant">Referencia de pago:</span>
                <span className="text-label-tabular text-secondary">
                  {lastPayment ? `#${lastPayment.id} · ${formatEs(lastPayment.paidAt)}` : "—"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Buyer — from the stored student record */}
        <div className="border-b border-outline-variant py-7">
          <span className="mb-2 block text-label uppercase text-on-surface-variant">
            Facturado a
          </span>
          <h3 className="font-display text-headline-sm text-on-surface">{student.name}</h3>
          <div className="mt-0.5 space-y-0.5 text-body-sm text-on-surface-variant">
            {student.email ? (
              <p>
                Correo: <span className="text-label-tabular text-on-surface">{student.email}</span>
              </p>
            ) : null}
            {student.phone ? (
              <p>
                Teléfono: <span className="text-label-tabular text-on-surface">{student.phone}</span>
              </p>
            ) : null}
            {!student.email && !student.phone ? <p>Sin datos de contacto</p> : null}
          </div>
        </div>

        {/* Line — one stored concept */}
        <div className="pt-6 pb-4">
          <Table>
            <THead>
              <TH>Descripción</TH>
              <TH numeric>Cantidad</TH>
              <TH numeric>Precio</TH>
              <TH numeric>IVA</TH>
              <TH numeric>Total</TH>
            </THead>
            <TBody>
              <TR className="bg-primary-container/60">
                <TD className="font-medium">{invoice.concept}</TD>
                <TD numeric>1</TD>
                <TD numeric>{euros(invoice.netCents)}</TD>
                <TD numeric>{Math.round(VAT_RATE * 100)} %</TD>
                <TD numeric className="font-semibold">
                  {euros(invoice.grossCents)}
                </TD>
              </TR>
            </TBody>
          </Table>
        </div>

        {/* Totals, right aligned */}
        <div className="mt-4 flex justify-end border-t border-outline-variant pt-4">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-body-sm text-on-surface-variant">
              <span>Subtotal:</span>
              <span className="text-label-tabular text-on-surface">{euros(invoice.netCents)}</span>
            </div>
            <div className="flex justify-between text-body-sm text-on-surface-variant">
              <span>IVA ({Math.round(VAT_RATE * 100)} %):</span>
              <span className="text-label-tabular text-on-surface">{euros(invoice.ivaCents)}</span>
            </div>
            <div className="flex items-baseline justify-between border-t border-outline-variant pt-2.5">
              <span className="font-display text-headline-sm text-on-surface">Total:</span>
              <span className="font-display text-headline-lg tabular-figures text-primary">
                {euros(invoice.grossCents)}
              </span>
            </div>
            {partial ? (
              <div className="rounded-sm bg-tertiary-container/40 px-3 py-2 text-body-sm text-on-surface">
                <span className="font-medium">Pagado {euros(invoice.paidCents)}</span> de{" "}
                {euros(invoice.grossCents)} · Pendiente {euros(pendingCents)}
              </div>
            ) : null}
            <div className="flex items-center justify-end gap-1.5 text-xs text-secondary">
              <Icon name="task_alt" className="text-sm" />
              {legal.badge}
            </div>
          </div>
        </div>

        {/* Legal note */}
        <div className="mt-12 border-t border-outline-variant/80 pt-6 text-center text-[12px] leading-relaxed text-on-surface-variant">
          <p>{legal.note}</p>
          <p className="mt-0.5 text-outline">{legal.registry}</p>
        </div>
      </Card>
    </div>
  );
}
