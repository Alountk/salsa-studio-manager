import Link from "next/link";
import { Button, Card, Icon, StatusPill, Table, TBody, TD, THead, TH, TR } from "@/components/ui";
import {
  INVOICE_DETAIL,
  INVOICE_TOTALS,
  VAT_RATE,
  euros,
  invoiceLineTotalCents,
} from "@/lib/billing";

/**
 * Design 3, screen 05 — invoice document (S5). The action bar (back link to
 * `/facturacion`, title + status pill, mail/PDF buttons) over the 800px
 * printable sheet: issuer block, invoice metadata, buyer block, line table and
 * the right-aligned totals. Copy and figures verbatim from
 * designs/03-facturacion/05-detalle-factura.html (Log L2: export wins).
 *
 * The mail and PDF buttons stay inert (non-goals: no real invoice issuance or
 * downloads); the sheet is a designed static document over INVOICE_DETAIL.
 * Structure uses the Card and Table primitives per the system-over-export rule
 * recorded in design-2's plan cards (DESIGN.md padding/headers beat the
 * export's borderless sheet and bare thead).
 */
export function InvoiceDocument() {
  const { number, status, issuedOn, dueOn, paymentRef, issuer, buyer, lines, legal } =
    INVOICE_DETAIL;
  const { subtotalCents, vatCents, totalCents } = INVOICE_TOTALS;
  const [buyerTaxLabel, buyerTaxValue] = buyer.taxId.split(": ");

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
            Volver a mis facturas
          </Link>
          <div className="flex items-center gap-3">
            <h2 className="font-display text-headline-lg text-on-surface">
              Factura {number}
            </h2>
            <StatusPill status={status} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" icon="mail">
            Enviar por correo
          </Button>
          <Button icon="download">Descargar PDF</Button>
        </div>
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
              {number}
            </span>
            <div className="space-y-1 text-body-sm">
              <div className="flex justify-end gap-3">
                <span className="text-on-surface-variant">Fecha de emisión:</span>
                <span className="text-label-tabular text-on-surface">{issuedOn}</span>
              </div>
              <div className="flex justify-end gap-3">
                <span className="text-on-surface-variant">Fecha de vencimiento:</span>
                <span className="text-label-tabular text-on-surface">{dueOn}</span>
              </div>
              <div className="flex justify-end gap-3">
                <span className="text-on-surface-variant">Referencia de pago:</span>
                <span className="text-label-tabular text-secondary">{paymentRef}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Buyer */}
        <div className="border-b border-outline-variant py-7">
          <span className="mb-2 block text-label uppercase text-on-surface-variant">
            Facturado a
          </span>
          <h3 className="font-display text-headline-sm text-on-surface">{buyer.name}</h3>
          <div className="mt-0.5 space-y-0.5 text-body-sm text-on-surface-variant">
            <p>
              {buyerTaxLabel}:{" "}
              <span className="text-label-tabular text-on-surface">{buyerTaxValue}</span>
            </p>
            <p>{buyer.address}</p>
            <p>{buyer.city}</p>
          </div>
        </div>

        {/* Lines */}
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
              {lines.map((line, index) => (
                <TR key={line.description} className={index === 0 ? "bg-primary-container/60" : ""}>
                  <TD className="font-medium">
                    {line.description}
                    <span className="block text-xs font-normal text-on-surface-variant">
                      {line.detail}
                    </span>
                  </TD>
                  <TD numeric>{line.quantity}</TD>
                  <TD numeric>{euros(line.netCents)}</TD>
                  <TD numeric>{Math.round(VAT_RATE * 100)} %</TD>
                  <TD numeric className="font-semibold">
                    {euros(invoiceLineTotalCents(line))}
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </div>

        {/* Totals, right aligned */}
        <div className="mt-4 flex justify-end border-t border-outline-variant pt-4">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-body-sm text-on-surface-variant">
              <span>Subtotal:</span>
              <span className="text-label-tabular text-on-surface">{euros(subtotalCents)}</span>
            </div>
            <div className="flex justify-between text-body-sm text-on-surface-variant">
              <span>IVA ({Math.round(VAT_RATE * 100)} %):</span>
              <span className="text-label-tabular text-on-surface">{euros(vatCents)}</span>
            </div>
            <div className="flex items-baseline justify-between border-t border-outline-variant pt-2.5">
              <span className="font-display text-headline-sm text-on-surface">Total:</span>
              <span className="font-display text-headline-lg tabular-figures text-primary">
                {euros(totalCents)}
              </span>
            </div>
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
