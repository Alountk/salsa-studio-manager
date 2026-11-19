import Link from "next/link";
import {
  Button,
  Card,
  Icon,
  ProgressRing,
  Select,
  StatusPill,
  Switch,
  Table,
  TBody,
  TD,
  THead,
  TH,
  TR,
} from "@/components/ui";
import {
  CREDITS_LEFT,
  INVOICE_DETAIL,
  STUDENT_INVOICES,
  STUDENT_INVOICE_COUNT,
  STUDENT_METHODS,
  STUDENT_PLAN,
  euros,
} from "@/lib/billing";

/**
 * Design 3, screen 04 — «Mi facturación» (S4). The app shell (sidebar, top
 * bar, canvas) comes from the shared AppShell; this component is the page
 * canvas: header row, plan card, payment methods card and the invoice history
 * table. Copy and figures verbatim from designs/03-facturacion/04;
 * destinations follow route mapping IA call 3 (odd/tasks/design-3-billing.md):
 * «Cambiar plan» → `/tarifas`, the designed invoice number → its detail.
 *
 * Every action with no designed outcome stays inert: «Añadir método de pago»,
 * Editar/Eliminar, the annual report PDF, row download/menu and pagination
 * (non-goals: no real payment processing or downloads).
 */
export function StudentBilling() {
  return (
    <div className="space-y-8">
      {/* Page header row */}
      <section className="flex flex-col justify-between gap-4 border-b border-outline-variant/60 pb-2 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-headline-lg text-on-surface">Mi facturación</h2>
            <span className="rounded-pill bg-secondary-container px-2.5 py-0.5 text-label text-on-secondary-container">
              Plan activo
            </span>
          </div>
          <p className="mt-1 text-body-md text-on-surface-variant">
            Gestiona tu plan, métodos de pago y descarga tus comprobantes oficiales.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button icon="add">Añadir método de pago</Button>
        </div>
      </section>

      {/* Top row: plan and payment methods */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card as="article" className="flex flex-col justify-between">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-label uppercase text-on-surface-variant">Plan actual</span>
              <span className="inline-flex items-center gap-1.5 rounded-pill bg-secondary-container px-3 py-1 text-label text-secondary">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                Activo
              </span>
            </div>

            <div className="flex flex-col justify-between gap-6 py-2 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-display text-headline-md text-on-surface">
                  {STUDENT_PLAN.name}
                </h3>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="font-display text-metric tabular-figures text-on-surface">
                    {euros(STUDENT_PLAN.priceCents)}
                  </span>
                  <span className="text-body-md text-on-surface-variant">{STUDENT_PLAN.unit}</span>
                </div>
                <p className="mt-2 flex items-center gap-1.5 text-body-sm text-on-surface-variant">
                  <Icon name="check_circle" className="text-base text-secondary" />
                  {STUDENT_PLAN.accessNote}
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-outline-variant/70 bg-surface-container-low px-4 py-3">
                <ProgressRing
                  value={STUDENT_PLAN.creditsUsed}
                  total={STUDENT_PLAN.creditsTotal}
                  size={64}
                  stroke={4}
                >
                  <span className="font-display text-headline-sm tabular-figures text-on-surface">
                    {STUDENT_PLAN.creditsUsed}/{STUDENT_PLAN.creditsTotal}
                  </span>
                </ProgressRing>
                <div className="flex flex-col">
                  <span className="text-label text-on-surface">Clases del bono</span>
                  <span className="text-body-sm text-on-surface-variant">
                    {CREDITS_LEFT} disponibles este mes
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 border-t border-outline-variant/70 pt-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                  <Icon name="event_repeat" className="text-lg text-primary" />
                  <span>
                    Se renueva el{" "}
                    <strong className="font-semibold text-on-surface">
                      {STUDENT_PLAN.renewsOn}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                  <Icon name="payments" className="text-lg text-primary" />
                  <span>
                    Próximo cargo{" "}
                    <strong className="font-semibold text-on-surface">
                      {euros(STUDENT_PLAN.priceCents)}
                    </strong>
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-md border border-outline-variant bg-surface-bright p-2.5 sm:justify-end">
                <Switch
                  label="Renovación automática"
                  defaultChecked={STUDENT_PLAN.autoRenew}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-outline-variant pt-4">
            <Link
              href="/tarifas"
              className="flex items-center gap-1 text-button text-primary transition-colors hover:text-primary-pressed"
            >
              Cambiar plan
              <Icon name="arrow_forward" className="text-sm" />
            </Link>
            <button
              type="button"
              className="text-body-sm text-error transition-colors hover:underline"
            >
              Cancelar suscripción
            </button>
          </div>
        </Card>

        <Card as="article" className="flex flex-col justify-between">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-label uppercase text-on-surface-variant">Métodos de pago</span>
              <span className="text-body-sm text-on-surface-variant">
                {STUDENT_METHODS.length} configurados
              </span>
            </div>
            <h3 className="font-display text-headline-md text-on-surface">Tarjetas y cuentas</h3>
            <p className="mb-5 text-body-sm text-on-surface-variant">
              Los cobros recurrentes de tu abono mensual se procesan a través de tu método
              predeterminado.
            </p>

            <div className="space-y-3.5">
              {STUDENT_METHODS.map((method) => (
                <div
                  key={method.id}
                  className={`flex items-center justify-between rounded-md border border-outline-variant p-4 transition-colors hover:border-outline ${
                    method.principal ? "bg-surface-container-low" : "bg-surface"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {method.id === "visa" ? (
                      <span className="flex h-8 w-12 shrink-0 items-center justify-center rounded-sm bg-brand-visa-navy text-xs font-bold tracking-wider text-white shadow-sm">
                        VISA
                      </span>
                    ) : (
                      <span className="flex h-8 w-12 shrink-0 items-center justify-center rounded-sm border border-outline-variant bg-surface-container-highest">
                        <Icon name="account_balance" className="text-xl text-primary" />
                      </span>
                    )}
                    <div>
                      <span className="flex items-center gap-2.5">
                        <span className="font-display text-headline-sm text-on-surface">
                          {method.label}
                        </span>
                        {method.principal ? (
                          <span className="inline-flex items-center gap-1 rounded-pill bg-secondary-container px-2.5 py-0.5 text-label text-secondary">
                            <Icon name="check" className="text-xs" />
                            Principal
                          </span>
                        ) : null}
                      </span>
                      <span className="block text-body-sm text-on-surface-variant">
                        {method.meta}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-button">
                    <button
                      type="button"
                      className={
                        method.principal
                          ? "text-primary transition-colors hover:text-primary-pressed"
                          : "text-on-surface-variant transition-colors hover:text-on-surface"
                      }
                    >
                      Editar
                    </button>
                    {method.principal ? null : (
                      <>
                        <span className="text-outline-variant">•</span>
                        <button
                          type="button"
                          className="text-error transition-colors hover:underline"
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-outline-variant pt-4 text-body-sm text-on-surface-variant">
            <span className="flex items-center gap-1.5">
              <Icon name="lock" className="text-base text-secondary" />
              Transacciones seguras cifradas SSL de 256 bits
            </span>
            <a href="#" className="text-xs hover:underline">
              Normativa PSD2
            </a>
          </div>
        </Card>
      </section>

      {/* Invoice history */}
      <section>
        <Card as="article">
          <div className="flex flex-col justify-between gap-4 border-b border-outline-variant pb-6 md:flex-row md:items-center">
            <div>
              <h3 className="font-display text-headline-md text-on-surface">
                Historial de facturas
              </h3>
              <p className="mt-0.5 text-body-sm text-on-surface-variant">
                Consulta y descarga todas las facturas y recibos emitidos a tu nombre.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Select aria-label="Año" defaultValue="2026">
                <option value="2026">Año: 2026</option>
                <option value="2025">Año: 2025</option>
                <option value="2024">Año: 2024</option>
              </Select>
              <Select aria-label="Estado" defaultValue="todas">
                <option value="todas">Estado: Todas</option>
                <option value="pagada">Pagada</option>
                <option value="pendiente">Pendiente</option>
              </Select>
              <Button variant="secondary" size="compact" icon="picture_as_pdf">
                Descargar informe anual (PDF)
              </Button>
            </div>
          </div>

          <Table className="mt-4">
            <THead>
              <TH>Número</TH>
              <TH>Fecha</TH>
              <TH>Concepto</TH>
              <TH numeric>Importe</TH>
              <TH className="text-center">Estado</TH>
              <TH numeric>Acciones</TH>
            </THead>
            <TBody>
              {STUDENT_INVOICES.map((invoice) => (
                <TR key={invoice.number}>
                  <TD className="font-mono font-medium">
                    {invoice.number === INVOICE_DETAIL.number ? (
                      <Link
                        href={`/facturacion/facturas/${invoice.number}`}
                        className="transition-colors hover:text-primary"
                      >
                        {invoice.number}
                      </Link>
                    ) : (
                      invoice.number
                    )}
                  </TD>
                  <TD className="text-on-surface-variant">{invoice.date}</TD>
                  <TD className="font-medium">{invoice.concept}</TD>
                  <TD numeric className="font-semibold">
                    {euros(invoice.amountCents)}
                  </TD>
                  <TD className="text-center">
                    <StatusPill status={invoice.status} />
                  </TD>
                  <TD className="text-right">
                    <span className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        title="Descargar factura"
                        className="rounded-sm p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
                      >
                        <Icon name="download" className="text-lg" />
                      </button>
                      <button
                        type="button"
                        title="Más opciones"
                        className="rounded-sm p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
                      >
                        <Icon name="more_horiz" className="text-lg" />
                      </button>
                    </span>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>

          <div className="mt-4 flex flex-col items-center justify-between gap-3 border-t border-outline-variant pt-4 text-body-sm text-on-surface-variant sm:flex-row">
            <span>
              Mostrando {STUDENT_INVOICES.length} de {STUDENT_INVOICE_COUNT} facturas registradas
            </span>
            <div className="inline-flex items-center gap-1">
              <Button variant="secondary" size="compact" disabled>
                Anterior
              </Button>
              <Button size="compact" aria-current="page">
                1
              </Button>
              <Button variant="secondary" size="compact">
                2
              </Button>
              <Button variant="secondary" size="compact">
                3
              </Button>
              <Button variant="secondary" size="compact">
                Siguiente
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Institutional footer inside the canvas (export, screen 04). */}
      <footer className="flex flex-col items-center justify-between gap-2 border-t border-outline-variant/50 py-6 text-body-sm text-on-surface-variant sm:flex-row">
        <span>© 2026 Estudio Salsa S.L. • Todos los derechos reservados.</span>
        <div className="flex items-center gap-4 text-xs">
          <a href="#" className="hover:underline">
            Condiciones de servicio
          </a>
          <span>•</span>
          <a href="#" className="hover:underline">
            Política de privacidad
          </a>
          <span>•</span>
          <a href="#" className="hover:underline">
            Ayuda y soporte
          </a>
        </div>
      </footer>
    </div>
  );
}
