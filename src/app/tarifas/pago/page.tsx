import type { Metadata } from "next";
import { Button, Card, FieldShell, Icon, Input, LinkButton, Select } from "@/components/ui";
import { CheckoutHeader } from "@/components/marketing/checkout-header";
import { CHECKOUT_ORDER, VAT_RATE, euros } from "@/lib/billing";

export const metadata: Metadata = {
  title: "Checkout | Estudio Salsa",
};

/**
 * `/tarifas/pago` — Design 3, screen 02 (S2). Public checkout: the stepper
 * header, the payment-method and billing cards in the left seven columns and
 * the sticky order summary in the right five. Copy verbatim from the export;
 * destinations follow route mapping IA call 3 (odd/tasks/design-3-billing.md).
 *
 * The export prefills every field (a designed state, not a live payment), so
 * the form renders the designed values and processes nothing.
 */

const FOOTER_LINKS = [
  "Términos y Condiciones",
  "Política de Privacidad",
  "Soporte Técnico",
  "Contacto",
] as const;

/** Visa and Mastercard marks pinned in the card-number field (export, S9 hex only in globals.css). */
function NetworkBadges() {
  return (
    <>
      <span
        title="Visa"
        className="flex h-6 items-center rounded-sm border border-outline-variant bg-surface px-1.5"
      >
        <svg viewBox="0 0 36 12" className="h-3.5 w-auto" aria-hidden="true">
          <path
            d="M14.6 0.5L9.6 11.5H6.3L3.8 2.5C3.7 2 3.5 1.7 3.1 1.5C2.4 1.1 1.1 0.7 0 0.5L0.1 0.1H5.5C6.2 0.1 6.8 0.6 7 1.4L8.3 8.2L11.5 0.5H14.6ZM27.4 8C27.5 5 23.3 4.8 23.3 3.5C23.3 3.1 23.7 2.6 24.6 2.5C25.1 2.4 26.4 2.4 27.8 3L28.4 0.9C27.6 0.6 26.6 0.3 25.3 0.3C22.3 0.3 20.1 1.9 20.1 4.2C20.1 5.9 21.6 6.9 22.8 7.5C24 8.1 24.4 8.5 24.4 9C24.4 9.8 23.4 10.2 22.5 10.2C20.9 10.2 20 9.9 19.3 9.6L18.7 11.8C19.5 12.1 21 12.4 22.5 12.4C25.8 12.3 27.4 10.7 27.4 8ZM35.6 11.5H32.8C32.1 11.5 31.6 11.1 31.3 10.5L26.7 0.5H30L31.8 7.9L35.6 0.5H38.5L35.6 11.5ZM18.7 0.5L16.2 11.5H13.2L15.7 0.5H18.7Z"
            className="fill-brand-visa"
          />
        </svg>
      </span>
      <span
        title="Mastercard"
        className="flex h-6 items-center rounded-sm border border-outline-variant bg-surface px-1"
      >
        <svg viewBox="0 0 24 16" className="h-4 w-auto" aria-hidden="true">
          <rect width="24" height="16" rx="2" className="fill-surface" />
          <circle cx="8" cy="8" r="6" className="fill-brand-mc-red" />
          <circle cx="16" cy="8" r="6" fillOpacity="0.9" className="fill-brand-mc-orange" />
        </svg>
      </span>
    </>
  );
}

export default function PagoPage() {
  const { item, card, billing, subtotalCents, ivaCents, totalCents } = CHECKOUT_ORDER;

  return (
    <>
      <CheckoutHeader />

      <main className="mx-auto mt-8 mb-16 w-full max-w-[1080px] flex-1 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Left column: payment method and billing details (~7 cols). */}
          <section className="flex flex-col gap-6 lg:col-span-7">
            <Card as="article">
              <div className="mb-4 flex items-center justify-between gap-4 border-b border-outline-variant/60 pb-4">
                <h2 className="flex items-center gap-2 font-display text-headline-sm text-on-surface">
                  <Icon name="credit_card" className="text-primary" />
                  Método de pago
                </h2>
                <span className="rounded-sm bg-surface-container px-2.5 py-1 text-label text-on-surface-variant">
                  Transacción Segura
                </span>
              </div>

              <div
                role="tablist"
                aria-label="Opciones de método de pago"
                className="mt-5 flex gap-2 rounded-md bg-surface-container p-1"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected="true"
                  className="flex flex-1 items-center justify-center gap-2 rounded-sm bg-primary-container px-3 py-2 text-button text-on-primary-container shadow-xs transition-all"
                >
                  <Icon name="credit_card" className="text-[18px]" />
                  Tarjeta
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected="false"
                  className="flex flex-1 items-center justify-center gap-2 rounded-sm px-3 py-2 text-button text-on-surface-variant transition-colors hover:text-on-surface"
                >
                  <Icon name="account_balance" className="text-[18px]" />
                  Domiciliación SEPA
                </button>
              </div>

              <form className="mt-6 space-y-4">
                <Input
                  label="Nombre del titular"
                  name="card_holder"
                  autoComplete="cc-name"
                  defaultValue={card.holder}
                />
                <Input
                  label="Número de tarjeta"
                  name="card_number"
                  autoComplete="cc-number"
                  mono
                  inputClassName="pr-24 tracking-wider"
                  defaultValue={card.number}
                  endAdornment={<NetworkBadges />}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Caducidad"
                    name="card_expiry"
                    autoComplete="cc-exp"
                    mono
                    placeholder="MM/AA"
                    defaultValue={card.expiry}
                  />
                  <Input
                    label="CVC"
                    name="card_cvc"
                    autoComplete="cc-csc"
                    type="password"
                    maxLength={4}
                    mono
                    placeholder="•••"
                    defaultValue={card.cvc}
                    inputClassName="pr-10"
                    endAdornment={<Icon name="lock" className="text-[18px] text-outline" />}
                    labelAction={
                      <button
                        type="button"
                        title="Código de seguridad de 3 dígitos situado en el reverso"
                        className="text-on-surface-variant transition-colors hover:text-primary"
                      >
                        <Icon name="help_outline" className="text-base" />
                      </button>
                    }
                  />
                </div>
                <div className="pt-2">
                  <label className="flex cursor-pointer select-none items-center gap-3">
                    <input
                      type="checkbox"
                      defaultChecked={card.saveByDefault}
                      className="h-4 w-4 cursor-pointer rounded-sm accent-primary"
                    />
                    <span className="text-body-sm font-medium text-on-surface">
                      Guardar esta tarjeta para futuros pagos y cuotas
                    </span>
                  </label>
                </div>
              </form>
            </Card>

            <Card as="article">
              <div className="mb-4 flex items-center justify-between gap-4 border-b border-outline-variant/60 pb-4">
                <h2 className="flex items-center gap-2 font-display text-headline-sm text-on-surface">
                  <Icon name="receipt_long" className="text-primary" />
                  Datos de facturación
                </h2>
                <span className="flex items-center gap-1 text-label text-secondary">
                  <Icon name="shield" className="text-[15px]" />
                  Factura legal en España
                </span>
              </div>

              <form className="mt-6 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Select
                    label="Tipo de documento"
                    name="doc_type"
                    defaultValue={billing.docType}
                  >
                    <option value="particular">Particular (DNI / NIE)</option>
                    <option value="empresa">Empresa / Autónomo (CIF)</option>
                  </Select>
                  <Input
                    label="NIF / NIE"
                    name="nif"
                    mono
                    required
                    defaultValue={billing.nif}
                  />
                </div>
                <Input
                  label="Nombre completo o Razón Social"
                  name="billing_name"
                  required
                  defaultValue={billing.name}
                />
                <Input
                  label="Dirección fiscal"
                  name="billing_address"
                  required
                  defaultValue={billing.address}
                />
              </form>
            </Card>
          </section>

          {/* Right column: sticky order summary (~5 cols). */}
          <aside className="flex flex-col gap-4 lg:col-span-5 lg:sticky lg:top-24">
            <Card as="article">
              <div className="mb-4 flex items-center justify-between gap-4 border-b border-outline-variant/60 pb-4">
                <h2 className="flex items-center gap-2 font-display text-headline-sm text-on-surface">
                  <Icon name="shopping_basket" className="text-primary" />
                  Resumen del pedido
                </h2>
                <span className="rounded-sm bg-secondary-container/40 px-2.5 py-1 text-label text-secondary">
                  1 artículo
                </span>
              </div>

              <div className="mt-5 flex items-start gap-3.5 rounded-md border border-outline-variant/50 bg-primary-container/40 p-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary-container text-on-primary-container">
                  <Icon name="confirmation_number" className="text-2xl" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="truncate text-button text-on-surface">{item.name}</h3>
                    <span className="font-mono text-body-md font-bold tabular-figures text-on-surface">
                      {euros(subtotalCents)}
                    </span>
                  </div>
                  <p className="mt-0.5 flex items-center gap-1.5 text-body-sm text-on-surface-variant">
                    <Icon name="schedule" className="text-[15px] text-tertiary" />
                    {item.meta}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-pill border border-outline-variant bg-surface px-2 py-0.5 text-label text-on-surface-variant"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-2.5 text-body-sm">
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span>Subtotal base</span>
                  <span className="font-mono font-medium tabular-figures text-on-surface">
                    {euros(subtotalCents)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    IVA ({Math.round(VAT_RATE * 100)} %)
                    <span
                      title="Impuesto sobre el Valor Añadido aplicado en España"
                      className="inline-flex"
                    >
                      <Icon name="info" className="cursor-help text-sm text-outline" />
                    </span>
                  </span>
                  <span className="font-mono font-medium tabular-figures text-on-surface">
                    {euros(ivaCents)}
                  </span>
                </div>
                <div className="my-3 flex items-baseline justify-between border-t border-outline-variant pt-3">
                  <div>
                    <span className="font-display text-headline-sm text-on-surface">Total</span>
                    <span className="block text-label text-on-surface-variant">
                      Impuestos y tasas incluidos
                    </span>
                  </div>
                  <span className="font-display text-display-mobile tabular-figures text-on-surface">
                    {euros(totalCents)}
                  </span>
                </div>
              </div>

              <FieldShell
                label="¿Tienes un código de descuento?"
                className="mt-5 border-t border-outline-variant/60 pt-4"
              >
                <div className="flex gap-2">
                  <Input
                    className="flex-1"
                    name="promo_code"
                    placeholder="Código promocional"
                    inputClassName="uppercase tracking-wider"
                  />
                  <Button variant="secondary">Aplicar</Button>
                </div>
              </FieldShell>

              <LinkButton href="/tarifas/resultado" fullWidth className="group mt-6">
                <span>Pagar {euros(totalCents)}</span>
                <Icon
                  name="arrow_forward"
                  className="text-[18px] transition-transform group-hover:translate-x-1"
                />
              </LinkButton>

              <div className="mt-4 flex items-start gap-2.5 rounded-md bg-surface-container p-3">
                <Icon
                  name="verified_user"
                  filled
                  className="mt-0.5 shrink-0 text-[18px] text-secondary"
                />
                <p className="text-body-sm text-on-surface-variant">
                  Pago seguro cifrado con protocolo TLS. No almacenamos los datos completos de tu
                  tarjeta de crédito.
                </p>
              </div>

              <div className="mt-5 flex items-center justify-center gap-4 border-t border-outline-variant/60 pt-4 text-label uppercase text-outline">
                <span className="flex items-center gap-1">
                  <Icon name="security" className="text-[15px]" />
                  PCI DSS Compliant
                </span>
                <span className="text-outline-variant">•</span>
                <span className="flex items-center gap-1">
                  <Icon name="verified" className="text-[15px]" />
                  3D Secure 2.0
                </span>
              </div>
            </Card>

            <Card className="flex items-center justify-between text-body-sm">
              <span className="flex items-center gap-2.5 text-on-surface-variant">
                <Icon name="support_agent" className="text-xl text-primary" />
                ¿Dudas con tu pago o bono?
              </span>
              <a
                href="#"
                className="flex items-center gap-0.5 font-semibold text-primary hover:underline"
              >
                Ayuda
                <Icon name="open_in_new" className="text-sm" />
              </a>
            </Card>
          </aside>
        </div>
      </main>

      <footer className="w-full border-t border-outline-variant bg-surface-container">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row md:px-8">
          <div className="flex items-center gap-2">
            <span className="font-display text-headline-sm text-on-surface">Estudio Salsa</span>
            <span className="text-body-sm text-on-surface-variant">
              · Gestión de clases de baile y eventos
            </span>
          </div>
          <p className="text-center text-body-sm text-on-surface-variant md:text-left">
            © 2024 Estudio Salsa. Todos los derechos reservados. Pago seguro con encriptación SSL
            de 256 bits.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-body-sm">
            {FOOTER_LINKS.map((label) => (
              <a
                key={label}
                href="#"
                className="text-on-surface-variant transition-colors duration-150 hover:text-primary"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
