import {
  Avatar,
  Button,
  Card,
  Icon,
  Input,
  LinkButton,
  Select,
  StatusPill,
  TBody,
  TD,
  THead,
  TH,
  TR,
  Table,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  ADMIN_INVOICES,
  ADMIN_INVOICE_TOTAL_COUNT,
  ADMIN_SELECTED_COUNT,
  ADMIN_SELECTED_TOTAL_CENTS,
  FILTERED_TOTAL_CENTS,
  euros,
} from "@/lib/billing";

/**
 * Design 3, screen 07 — «Facturas» (S7). The app shell provides the canvas;
 * this component is the page: header with the count pill and the two actions,
 * the filter bar, the bulk-selection bar for the three designed overdue rows,
 * the eight-row invoice table (overdue rows carry the pill AND the 3px red
 * left bar — the design's only row-level exception signal) and the footer with
 * the recuento, pagination and filtered total.
 *
 * Copy and figures verbatim from designs/03-facturacion/07. Destinations
 * follow route mapping IA call 2 (odd/tasks/design-3-billing.md): the open row
 * menu's «Marcar como pagada» enters the registrar-pago modal for that exact
 * invoice; the other menu items, the bulk actions, «Exportar», «Nueva factura»
 * and the filters stay inert (non-goals: no real exports or bulk operations).
 */

/** The export shows row 1's contextual menu open for demo; static screen. */
const MENU_ROW_NUMBER = "V-2026-0179";

const PAGES = [1, 2, 3, 4, 5];

export function InvoiceList() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <section className="flex flex-col justify-between gap-4 md:items-end">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-display text-display text-on-surface">Facturas</h2>
            <span className="rounded-pill bg-surface-container-highest px-2.5 py-0.5 text-label text-primary">
              {ADMIN_INVOICE_TOTAL_COUNT} emitidas
            </span>
          </div>
          <p className="mt-1 text-body-md text-on-surface-variant">
            Control de cobros, domiciliaciones y emisión de recibos del estudio.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" icon="file_download">
            Exportar
          </Button>
          <Button icon="add">Nueva factura</Button>
        </div>
      </section>

      {/* Filter bar */}
      <Card as="section" className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-[280px] flex-1 flex-wrap items-center gap-3">
            <div className="relative min-w-[240px] max-w-sm flex-1">
              <Icon
                name="search"
                className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-lg text-outline"
              />
              <Input
                aria-label="Buscar facturas"
                placeholder="Buscar por alumno o número..."
                inputClassName="pl-9"
              />
            </div>

            {/* Estado carries the designed active-filter treatment (border +
                tint + primary label), which the shared Select cannot restyle
                without stacking conflicting colour utilities. */}
            <div className="relative min-w-[150px]">
              <select
                aria-label="Estado"
                defaultValue="vencidas"
                className="h-11 w-full cursor-pointer appearance-none rounded-sm border border-primary bg-primary-container/40 pl-3 pr-8 text-body-sm font-semibold text-primary outline-none transition-shadow focus:border-primary focus:shadow-[var(--focus-ring-input)]"
              >
                <option value="vencidas">Estado: Vencidas</option>
                <option value="todas">Estado: Todas</option>
                <option value="pagadas">Estado: Pagadas</option>
                <option value="pendientes">Estado: Pendientes</option>
              </select>
              <Icon
                name="arrow_drop_down"
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xl text-primary"
              />
            </div>

            <Select aria-label="Periodo" defaultValue="3m" className="min-w-[160px]">
              <option value="3m">Últimos 3 meses</option>
              <option value="mes">Mes actual</option>
              <option value="2026">Año 2026</option>
              <option value="historico">Histórico completo</option>
            </Select>

            <Select aria-label="Método" defaultValue="todos" className="min-w-[140px]">
              <option value="todos">Método: Todos</option>
              <option value="sepa">Domiciliación SEPA</option>
              <option value="tarjeta">Tarjeta bancaria</option>
              <option value="bizum">Bizum</option>
              <option value="efectivo">Efectivo en recepción</option>
            </Select>
          </div>

          <Button variant="ghost" icon="filter_alt_off">
            Limpiar filtros
          </Button>
        </div>
      </Card>

      {/* Bulk-selection bar for the three designed overdue rows */}
      <section className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-primary/40 bg-primary-container/40 px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-on-primary">
            <Icon name="check_box" filled className="text-lg" />
          </span>
          <span>
            <span className="font-display text-headline-sm text-on-surface">
              {ADMIN_SELECTED_COUNT} facturas seleccionadas
            </span>{" "}
            <span className="ml-2 text-xs font-medium text-on-surface-variant">
              Total acumulado: {euros(ADMIN_SELECTED_TOTAL_CENTS)}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-secondary px-4 text-button text-on-secondary transition-colors hover:bg-secondary/90"
          >
            <Icon name="task_alt" filled className="text-sm" />
            Marcar como pagadas
          </button>
          <Button variant="secondary" size="compact" icon="forward_to_inbox">
            Reenviar
          </Button>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-error-container px-3.5 text-button text-error transition-colors hover:bg-error-container/70"
          >
            <Icon name="block" className="text-sm" />
            Anular
          </button>
        </div>
      </section>

      {/* Invoice table */}
      <div className="overflow-visible rounded-lg border border-outline-variant bg-surface shadow-card">
        <Table>
          <THead>
            <TH className="w-12 text-center">
              <input
                type="checkbox"
                defaultChecked
                aria-label="Seleccionar todas las facturas"
                className="h-4 w-4 rounded accent-primary"
              />
            </TH>
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
            {ADMIN_INVOICES.map((invoice) => {
              const overdue = invoice.status === "overdue";
              return (
                <TR
                  key={invoice.number}
                  marked={overdue}
                  className={overdue ? "bg-primary-container/20" : undefined}
                >
                  <TD className="text-center">
                    <input
                      type="checkbox"
                      defaultChecked={invoice.selected}
                      aria-label={`Seleccionar ${invoice.number}`}
                      className="h-4 w-4 rounded accent-primary"
                    />
                  </TD>
                  <TD className="font-mono text-body-sm font-medium">{invoice.number}</TD>
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
                      overdue
                        ? "font-medium text-error"
                        : "text-on-surface-variant",
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
                  <TD className="relative text-center">
                    <button
                      type="button"
                      title="Opciones"
                      aria-label={`Opciones de ${invoice.number}`}
                      className="mx-auto flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
                    >
                      <Icon name="more_vert" />
                    </button>
                    {invoice.number === MENU_ROW_NUMBER ? (
                      <div className="absolute right-6 top-10 z-40 w-48 rounded-lg border border-outline-variant bg-surface py-1.5 text-left shadow-popover">
                        <LinkButton
                          href={`/facturacion/facturas?registrar=${invoice.number}`}
                          variant="ghost"
                          className="w-full justify-start gap-2 rounded-sm px-3.5 py-2 text-body-sm font-normal"
                        >
                          <Icon name="check_circle" className="text-base text-secondary" />
                          Marcar como pagada
                        </LinkButton>
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 rounded-sm px-3.5 py-2 text-body-sm text-on-surface transition-colors hover:bg-surface-container"
                        >
                          <Icon name="forward_to_inbox" className="text-base text-outline" />
                          Reenviar por correo
                        </button>
                        <div className="my-1 h-px bg-outline-variant" />
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 rounded-sm px-3.5 py-2 text-body-sm text-error transition-colors hover:bg-error-container"
                        >
                          <Icon name="block" className="text-base" />
                          Anular factura
                        </button>
                      </div>
                    ) : null}
                  </TD>
                </TR>
              );
            })}
          </TBody>
        </Table>

        {/* Footer: recuento, paginación y total filtrado */}
        <div className="flex select-none flex-wrap items-center justify-between gap-4 border-t border-outline-variant bg-surface px-6 py-4">
          <span className="text-body-sm text-on-surface-variant">
            Mostrando <strong className="font-semibold text-on-surface">1 a {ADMIN_INVOICES.length}</strong> de{" "}
            <strong className="font-semibold text-on-surface">{ADMIN_INVOICE_TOTAL_COUNT}</strong> facturas
          </span>
          <div className="flex items-center gap-1">
            <Button variant="secondary" size="compact" icon="chevron_left" disabled>
              Anterior
            </Button>
            {PAGES.map((page) =>
              page === 1 ? (
                <Button key={page} size="compact" aria-current="page">
                  {page}
                </Button>
              ) : (
                <Button key={page} variant="secondary" size="compact">
                  {page}
                </Button>
              ),
            )}
            <Button variant="secondary" size="compact">
              Siguiente
              <Icon name="chevron_right" className="text-base" />
            </Button>
          </div>
          <div className="flex items-baseline gap-2 rounded-lg border border-outline-variant bg-primary-container/40 px-4 py-2">
            <span className="text-label uppercase text-on-surface-variant">Total filtrado:</span>
            <span className="font-display text-headline-sm tabular-figures text-on-surface">
              {euros(FILTERED_TOTAL_CENTS)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
