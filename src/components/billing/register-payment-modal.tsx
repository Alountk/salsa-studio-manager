import { Button, FieldShell, Icon, Input, LinkButton, Select } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  MANUAL_PAYMENT,
  MANUAL_PAYMENT_EXTRAS,
  type AdminInvoice,
  euros,
  initials,
  manualPaymentConcept,
  manualPaymentEmail,
} from "@/lib/billing";

/**
 * Design 3, screen 08 — «Registrar pago» (S8). Rendered by
 * `/facturacion/facturas?registrar=<número>` over the dimmed invoice list
 * (route mapping IA call 2: entry is the row menu's «Marcar como pagada»).
 *
 * 560px dialog on a 45% `inverse-surface` veil, context line, the designed
 * form (Alumno, Importe, three-way method selector with Efectivo active,
 * Concepto/Fecha row, Factura asociada, the two checkboxes with the designed
 * state, Notas) and the footer actions. Copy and figures verbatim from
 * designs/03-facturacion/08; «Cancelar» and the close button leave the modal,
 * «Registrar pago» stays inert (non-goal: no real payment recording).
 */

export function RegisterPaymentModal({ invoice }: { invoice: AdminInvoice }) {
  const extras = MANUAL_PAYMENT_EXTRAS[invoice.number];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/45 p-4 backdrop-blur-[1.5px]">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="registrar-pago-title"
        className="flex max-h-full w-[560px] max-w-full flex-col overflow-hidden rounded-lg border border-outline-variant bg-surface shadow-modal"
      >
        {/* Header */}
        <div className="border-b border-outline-variant px-7 pb-4 pt-6">
          <div className="flex items-center justify-between">
            <h2
              id="registrar-pago-title"
              className="font-display text-headline-md text-on-surface"
            >
              Registrar pago
            </h2>
            <LinkButton
              href="/facturacion/facturas"
              variant="ghost"
              size="compact"
              aria-label="Cerrar modal"
              className="rounded-full p-1.5"
            >
              <Icon name="close" className="text-xl" />
            </LinkButton>
          </div>
          <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-body-sm text-on-surface-variant">
            <span>Factura</span>
            <span className="font-mono font-medium text-on-surface">{invoice.number}</span>
            <span className="text-outline">·</span>
            <span>{invoice.student}</span>
            <span className="text-outline">·</span>
            <span className="font-display text-headline-sm tabular-figures text-primary">
              {euros(invoice.amountCents)}
            </span>
          </p>
        </div>

        {/* Form */}
        <div className="max-h-[70vh] space-y-4 overflow-y-auto px-7 py-5">
          <FieldShell label="Alumno">
            <button
              type="button"
              className="flex h-11 w-full cursor-pointer items-center justify-between rounded-lg border border-outline-variant bg-surface px-3.5 shadow-xs transition-colors hover:border-outline"
            >
              <span className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-pill bg-surface-container-high text-xs font-semibold text-primary">
                  {initials(invoice.student)}
                </span>
                <span className="text-body-md font-medium text-on-surface">
                  {invoice.student}
                </span>
              </span>
              <Icon name="arrow_drop_down" className="text-xl text-outline" />
            </button>
          </FieldShell>

          <FieldShell label="Importe del cobro">
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                aria-label="Importe del cobro"
                defaultValue={euros(invoice.amountCents, 2).replace(" €", "")}
                className="h-12 w-full rounded-lg border border-outline-variant bg-surface pl-4 pr-16 font-display text-display-mobile tabular-figures text-on-surface outline-none transition-all focus:border-primary focus:shadow-[var(--focus-ring-input)]"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-display text-headline-sm text-on-surface-variant">
                {MANUAL_PAYMENT.currency}
              </span>
            </div>
          </FieldShell>

          <FieldShell label="Método de pago">
            <div className="grid grid-cols-3 gap-2.5">
              {MANUAL_PAYMENT.methods.map((method) => {
                const active = method.id === MANUAL_PAYMENT.defaultMethodId;
                return (
                  <button
                    key={method.id}
                    type="button"
                    aria-pressed={active}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1 rounded-lg px-3 py-2.5 transition-all",
                      active
                        ? "border-2 border-primary bg-primary-container font-semibold text-primary shadow-xs"
                        : "border border-outline-variant bg-surface font-medium text-on-surface-variant hover:bg-surface-container",
                    )}
                  >
                    <Icon name={method.icon} className="text-[22px]" />
                    <span className="text-xs">{method.label}</span>
                  </button>
                );
              })}
            </div>
          </FieldShell>

          <div className="grid grid-cols-2 gap-3.5">
            <Input label="Concepto" defaultValue={manualPaymentConcept(invoice)} />
            <Input
              label="Fecha de cobro"
              defaultValue={MANUAL_PAYMENT.date}
              endAdornment={<Icon name="calendar_today" className="text-xl text-outline" />}
              inputClassName="pr-10 tabular-figures"
            />
          </div>

          <Select
            label="Factura asociada"
            defaultValue={invoice.number}
            className="[&>select]:pr-10"
          >
            <option value={invoice.number}>
              {invoice.number} ({invoice.status === "paid" ? "Pagada" : "Pendiente"} -{" "}
              {euros(invoice.amountCents)})
            </option>
            <option value="nueva">Crear nueva factura simplificada</option>
          </Select>

          <div className="space-y-2 pt-1">
            <label className="flex cursor-pointer select-none items-start gap-2.5">
              <input
                type="checkbox"
                defaultChecked
                className="mt-0.5 h-4 w-4 rounded accent-primary"
              />
              <span className="text-xs leading-snug">
                <span className="font-medium text-on-surface">Enviar recibo por correo</span>
                <span className="ml-1 font-mono text-outline">
                  ({manualPaymentEmail(invoice.student)})
                </span>
              </span>
            </label>
            <label className="flex cursor-pointer select-none items-start gap-2.5">
              <input type="checkbox" className="mt-0.5 h-4 w-4 rounded accent-primary" />
              <span className="text-xs leading-snug">
                <span className="font-medium text-on-surface">Avisar también por WhatsApp</span>
                {extras?.phone ? (
                  <span className="ml-1 font-mono text-outline">({extras.phone})</span>
                ) : null}
              </span>
            </label>
          </div>

          <FieldShell label="Notas internas (opcional)">
            <textarea
              rows={2}
              defaultValue={extras?.notes}
              placeholder={extras?.notes}
              className="w-full resize-none rounded-sm border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface outline-none transition-all placeholder:text-outline focus:border-primary focus:shadow-[var(--focus-ring-input)]"
            />
          </FieldShell>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-outline-variant bg-background px-7 py-4">
          <LinkButton href="/facturacion/facturas" variant="ghost">
            Cancelar
          </LinkButton>
          <Button icon="check_circle">Registrar pago</Button>
        </div>
      </div>
    </div>
  );
}
