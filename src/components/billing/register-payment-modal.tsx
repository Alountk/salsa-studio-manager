"use client";

import { useActionState, useState } from "react";
import { Button, FieldShell, Icon, LinkButton } from "@/components/ui";
import { euros, type AdminInvoice } from "@/lib/billing";
import { todayIso } from "@/lib/dates";
import { recordPaymentAction, type PaymentFormState } from "@/app/(app)/facturacion/actions";

/**
 * Design 3, screen 08 — «Registrar pago», now recording real payments (spec
 * S3). The designed dialog shell and context line stay; the form is reduced
 * to what the schema stores (amount, date, note) — email/WhatsApp notices,
 * payment methods, and the invoice selector had no backing feature and no
 * column to write to (non-goals: no email delivery; schema: payments).
 * Partial payments are allowed: the amount is editable and status stays
 * Pendiente until the gross is covered.
 */
export function RegisterPaymentModal({ invoice }: { invoice: AdminInvoice }) {
  const [state, formAction, pending] = useActionState<PaymentFormState, FormData>(
    recordPaymentAction,
    { error: null },
  );
  const [amount, setAmount] = useState(euros(invoice.amountCents, 2).replace(" €", ""));
  const detailHref = `/facturacion/facturas/${invoice.number}`;

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
              href={detailHref}
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
        <form
          id="registrar-pago-form"
          action={formAction}
          className="max-h-[70vh] space-y-4 overflow-y-auto px-7 py-5"
        >
          <input type="hidden" name="invoiceNumber" value={invoice.number} />

          {state.error ? (
            <p
              role="alert"
              className="rounded-sm bg-error-container/40 px-4 py-3 text-body-sm text-error"
            >
              {state.error}
            </p>
          ) : null}

          <FieldShell label="Importe del cobro" hint="Puedes registrar un pago parcial; la factura sigue Pendiente hasta cubrir el total.">
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                name="amountEuros"
                aria-label="Importe del cobro"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                className="h-12 w-full rounded-lg border border-outline-variant bg-surface px-4 pr-16 font-display text-display-mobile tabular-figures text-on-surface outline-none transition-all focus:border-primary focus:shadow-[var(--focus-ring-input)]"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-display text-headline-sm text-on-surface-variant">
                €
              </span>
            </div>
          </FieldShell>

          <div>
            <label
              htmlFor="paidAt"
              className="mb-1.5 block text-label uppercase text-on-surface-variant"
            >
              Fecha de cobro
            </label>
            <input
              id="paidAt"
              name="paidAt"
              type="date"
              defaultValue={todayIso()}
              className="h-11 w-full rounded-sm border border-outline-variant bg-surface px-4 py-3 font-sans text-body-md tabular-figures text-on-surface outline-none transition-shadow focus:border-primary focus:shadow-[var(--focus-ring-input)]"
            />
          </div>

          <FieldShell label="Notas internas (opcional)">
            <textarea
              name="note"
              rows={2}
              placeholder="Bizum de noviembre…"
              className="w-full resize-none rounded-sm border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface outline-none transition-all placeholder:text-outline focus:border-primary focus:shadow-[var(--focus-ring-input)]"
            />
          </FieldShell>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-outline-variant bg-background px-7 py-4">
          <LinkButton href={detailHref} variant="ghost">
            Cancelar
          </LinkButton>
          <Button type="submit" form="registrar-pago-form" icon="check_circle" disabled={pending}>
            {pending ? "Registrando…" : "Registrar pago"}
          </Button>
        </div>
      </div>
    </div>
  );
}
