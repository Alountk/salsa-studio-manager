import { Fragment } from "react";
import Link from "next/link";
import {
  Button,
  Card,
  Icon,
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
  CURRENT_MONTH,
  DEBTORS,
  DEBTORS_SHOWN_CENTS,
  KPIS,
  PAYMENT_MIX,
  PENDING_TOTAL_CENTS,
  PLAN_SPLIT,
  PLAN_SPLIT_STUDENTS,
  REVENUE_MEAN_CENTS,
  REVENUE_SERIES,
  barHeightPct,
  euros,
  paymentMixCents,
  planSplitCents,
  revenueSplit,
} from "@/lib/billing";

/**
 * Design 3, screen 06 — «Ingresos» (S6). The app shell (sidebar, top bar,
 * canvas) comes from the shared AppShell; this component is the page canvas:
 * the header row with the period selector and the two actions, four KPI cards,
 * the twelve-month revenue chart with its plan-split donut, the debtors table
 * and the payment-method breakdown. Copy and figures verbatim from
 * designs/03-facturacion/06; «Nueva factura» and «Ver todas las facturas» go to
 * the designed invoice list (route mapping IA call in
 * odd/tasks/design-3-billing.md).
 *
 * Every action with no designed outcome stays inert: «Exportar CSV», the period
 * selector (static state), the per-row retry, «Notificar a todos por WhatsApp»
 * and «Configurar pasarelas» (non-goals: no real exports or notifications).
 */

/** KPI icons keep the export's colour: month → primary, pending → tertiary. */
const KPI_ICON_TONE: Record<string, string> = {
  month: "text-primary",
  pending: "text-tertiary",
};

/** Method rows: glyph and rate tone per payment share (export markup). */
const METHOD_ICON: Record<string, string> = {
  card: "credit_card",
  sepa: "account_balance",
  cash: "payments",
};

/** Donut geometry exactly as exported for the 58 / 27 / 15 split (round caps). */
const DONUT_SEGMENTS: Array<{ id: string; dash: string; offset: string }> = [
  { id: "mensual", dash: "145.7 251.3", offset: "0" },
  { id: "bono", dash: "67.8 251.3", offset: "-148" },
  { id: "suelta", dash: "37.7 251.3", offset: "-218" },
];

/** Y gridlines in k€; 20 = REVENUE_AXIS_MAX_CENTS (2 000 000 ct = 20 k€). */
const AXIS = [20, 15, 10, 5, 0];

const DONUT_STROKE: Record<string, string> = {
  mensual: "stroke-primary",
  bono: "stroke-secondary",
  suelta: "stroke-series-bonos",
};

const LEGEND_DOT: Record<string, string> = {
  mensual: "bg-primary",
  bono: "bg-secondary",
  suelta: "bg-series-bonos",
};

function KpiDelta({ delta }: { delta: { text: string; tone: "positive" | "negative" } }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-pill px-2 py-0.5 text-label tabular-figures",
        delta.tone === "positive"
          ? "bg-secondary-container text-on-secondary-container"
          : "bg-error-container text-on-error-container",
      )}
    >
      <Icon name={delta.text.startsWith("-") ? "arrow_downward" : "arrow_upward"} className="text-sm" />
      {delta.text}
    </span>
  );
}

export function AdminRevenue() {
  return (
    <div className="space-y-6">
      {/* Page header row */}
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="font-display text-headline-lg text-on-surface">Ingresos</h2>
          <p className="mt-1 text-body-md text-on-surface-variant">
            Supervisión económica, evolución mensual y control de cobros del estudio
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select aria-label="Periodo" defaultValue="12m" className="w-48">
            <option value="12m">Últimos 12 meses</option>
            <option value="ytd">Año actual (2026)</option>
            <option value="q4">Trimestre en curso (Q4)</option>
            <option value="sep">Mes anterior (Septiembre 2026)</option>
          </Select>
          <Button variant="secondary" icon="download">
            Exportar CSV
          </Button>
          <LinkButton href="/facturacion/facturas" icon="add">
            Nueva factura
          </LinkButton>
        </div>
      </section>

      {/* KPI row */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((kpi) => (
          <Card key={kpi.id} as="article" className="flex flex-col justify-between gap-3">
            <div className="flex items-start justify-between gap-2">
              <span className="text-label uppercase text-on-surface-variant">{kpi.label}</span>
              <Icon
                name={kpi.icon}
                className={cn("text-xl", KPI_ICON_TONE[kpi.id] ?? "text-on-surface-variant")}
              />
            </div>
            <span className="font-display text-[30px] font-bold tabular-figures tracking-tight text-on-surface">
              {kpi.value}
            </span>
            <div className="flex items-center justify-between gap-2">
              {kpi.delta ? (
                <KpiDelta delta={kpi.delta} />
              ) : kpi.pill ? (
                <span className="inline-flex items-center gap-1 rounded-pill bg-tertiary-container px-2 py-0.5 text-label tabular-figures text-on-tertiary-container">
                  <Icon name="schedule" className="text-sm" />
                  {kpi.pill}
                </span>
              ) : null}
              <span className="text-body-sm text-on-surface-variant">{kpi.hint}</span>
            </div>
          </Card>
        ))}
      </section>

      {/* Row: revenue evolution (8 cols) + plan split donut (4 cols) */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card as="article" className="lg:col-span-8">
          <div className="flex flex-col justify-between gap-3 border-b border-outline-variant/60 pb-4 sm:flex-row sm:items-start">
            <div>
              <h3 className="font-display text-headline-sm text-on-surface">
                Evolución de ingresos
              </h3>
              <p className="text-body-sm text-on-surface-variant">
                Facturación mensual consolidada por tipo de producto
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-on-surface-variant">
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm bg-primary" />
                <span className="text-on-surface">Suscripciones</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm bg-series-bonos" />
                <span className="text-on-surface">Bonos &amp; Clases</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-0.5 w-4 border-t border-dashed border-outline" />
                <span>
                  Media:{" "}
                  <strong className="tabular-figures text-on-surface">
                    {euros(REVENUE_MEAN_CENTS, 0)}
                  </strong>
                </span>
              </span>
            </div>
          </div>

          {/* Plot: gridlines + stacked bars, structure as exported */}
          <div className="pb-2 pt-6">
            <div className="relative h-64 w-full">
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-between text-label-tabular text-on-surface-variant">
                {AXIS.map((value, index) => (
                  <Fragment key={value}>
                    <div
                      className={cn(
                        "flex items-center justify-between border-b pb-0.5",
                        index === AXIS.length - 1
                          ? "border-outline-variant"
                          : "border-outline-variant/60",
                      )}
                    >
                      <span>{value} k€</span>
                    </div>
                    {index === 1 ? (
                      <div className="relative z-10 mt-2.5 flex items-center justify-end border-b-2 border-dashed border-outline/70 pb-0.5">
                        <span className="rounded border border-outline-variant bg-surface px-1.5 py-0.5 text-label text-on-surface-variant">
                          Media mensual {euros(REVENUE_MEAN_CENTS, 0)}
                        </span>
                      </div>
                    ) : null}
                  </Fragment>
                ))}
              </div>

              <div className="absolute inset-0 flex items-end justify-between gap-2 pl-8 pr-2">
                {REVENUE_SERIES.map((month) => {
                  const split = revenueSplit(month);
                  return (
                    <div
                      key={month.long}
                      className="group relative flex h-full flex-1 flex-col items-center justify-end"
                    >
                      {month.current ? (
                        <span className="absolute -top-7 whitespace-nowrap rounded bg-primary-container px-2 py-0.5 text-label text-on-primary-container shadow-sm">
                          {euros(month.totalCents, 0)}
                        </span>
                      ) : null}
                      <div
                        style={{ height: `${barHeightPct(month.totalCents)}%` }}
                        className={cn(
                          "flex w-full max-w-[28px] flex-col justify-end overflow-hidden rounded-t-sm transition-all duration-150 group-hover:opacity-90",
                          month.current &&
                            "rounded-t-md ring-2 ring-primary ring-offset-2 ring-offset-surface",
                        )}
                      >
                        <div
                          title={`Bonos${month.current ? " & Clases" : ""}: ${euros(split.bonosCents, 0)}`}
                          style={{ height: `${month.bonosPct}%` }}
                          className="w-full bg-series-bonos"
                        />
                        <div
                          title={`Suscripciones: ${euros(split.suscripcionesCents, 0)}`}
                          style={{ height: `${100 - month.bonosPct}%` }}
                          className="w-full bg-primary"
                        />
                      </div>
                      <span
                        className={cn(
                          "mt-2",
                          month.current
                            ? "text-label text-primary"
                            : "text-label-tabular text-on-surface-variant",
                        )}
                      >
                        {month.current ? `${month.short} ${month.long.slice(-2)}` : month.short}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-2 border-t border-outline-variant/60 pt-3 text-xs text-on-surface-variant sm:flex-row">
            <span>
              Rango analizado: {REVENUE_SERIES[0].long} – {CURRENT_MONTH.long}
            </span>
            <span className="flex items-center gap-1 font-semibold text-secondary">
              <Icon name="trending_up" className="text-sm" />
              Crecimiento interanual +27,8 %
            </span>
          </div>
        </Card>

        <Card as="article" className="flex flex-col lg:col-span-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-display text-headline-sm text-on-surface">Reparto por plan</h3>
              <p className="text-body-sm text-on-surface-variant">Total facturado este mes</p>
            </div>
            <span className="rounded bg-surface-container px-2 py-0.5 text-xs font-semibold text-on-surface-variant">
              Octubre
            </span>
          </div>

          <div className="relative my-4 flex items-center justify-center">
            <svg
              aria-hidden="true"
              viewBox="0 0 100 100"
              className="h-44 w-44 -rotate-90"
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                className="stroke-background"
                strokeWidth="12"
              />
              {DONUT_SEGMENTS.map((segment) => (
                <circle
                  key={segment.id}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  className={DONUT_STROKE[segment.id]}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={segment.dash}
                  strokeDashoffset={segment.offset}
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-label uppercase text-on-surface-variant">Facturado</span>
              <span className="font-display text-xl font-bold tabular-figures text-on-surface">
                {euros(CURRENT_MONTH.totalCents, 0)}
              </span>
              <span className="text-label text-secondary">{PLAN_SPLIT_STUDENTS} alumnos</span>
            </div>
          </div>

          <div className="space-y-3 border-t border-outline-variant pt-3">
            {PLAN_SPLIT.map((plan) => (
              <div key={plan.id} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className={cn("h-2.5 w-2.5 rounded-full", LEGEND_DOT[plan.id])} />
                  <span className="font-medium text-on-surface">{plan.label}</span>
                </span>
                <span className="flex items-center gap-3">
                  <span className="font-bold tabular-figures text-on-surface">
                    {euros(planSplitCents(plan.pct))}
                  </span>
                  <span className="w-8 text-right font-medium tabular-figures text-on-surface-variant">
                    {plan.pct} %
                  </span>
                </span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Row: debtors (7 cols) + payment methods (5 cols) */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card as="article" className="lg:col-span-7">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-headline-sm text-on-surface">
                Deudores y cobros pendientes
              </h3>
              <p className="text-body-sm text-on-surface-variant">
                Facturas con liquidación pendiente o rechazo bancario
              </p>
            </div>
            <Link
              href="/facturacion/facturas"
              className="flex shrink-0 items-center gap-1 text-button text-primary transition-colors hover:text-primary-pressed"
            >
              Ver todas las facturas
              <Icon name="arrow_forward" className="text-sm" />
            </Link>
          </div>

          <Table>
            <THead>
              <TH>Alumno &amp; Ref.</TH>
              <TH>Importe</TH>
              <TH>Retraso</TH>
              <TH>Estado</TH>
              <TH className="text-right">Acción</TH>
            </THead>
            <TBody>
              {DEBTORS.map((debtor) => (
                <TR key={debtor.ref}>
                  <TD>
                    <span className="block text-body-sm font-semibold text-on-surface">
                      {debtor.name}
                    </span>
                    <span className="block font-mono text-xs text-on-surface-variant">
                      {debtor.ref}
                    </span>
                  </TD>
                  <TD numeric className="font-semibold">
                    {euros(debtor.amountCents)}
                  </TD>
                  <TD className="tabular-figures text-on-surface-variant">
                    {debtor.daysLate} días
                  </TD>
                  <TD>
                    <StatusPill status="overdue" />
                  </TD>
                  <TD className="text-right">
                    <Button
                      variant="ghost"
                      size="compact"
                      icon="replay"
                      title="Reclamar o reintentar cobro"
                      aria-label={`Reclamar o reintentar cobro de ${debtor.ref}`}
                    />
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>

          <div className="mt-4 flex flex-col items-center justify-between gap-3 border-t border-outline-variant pt-3 text-xs sm:flex-row">
            <span className="text-on-surface-variant">
              Total pendiente mostrado:{" "}
              <strong className="font-semibold text-on-surface">
                {euros(DEBTORS_SHOWN_CENTS)}
              </strong>{" "}
              ({DEBTORS.length} de {euros(PENDING_TOTAL_CENTS, 0)} acumulados)
            </span>
            <button
              type="button"
              className="rounded-sm bg-primary-container px-2.5 py-1 text-xs font-semibold text-on-primary-container transition-colors hover:bg-primary hover:text-on-primary"
            >
              Notificar a todos por WhatsApp
            </button>
          </div>
        </Card>

        <Card as="article" className="flex flex-col lg:col-span-5">
          <div className="mb-1 flex items-start justify-between gap-2">
            <div>
              <h3 className="font-display text-headline-sm text-on-surface">Métodos de pago</h3>
              <p className="text-body-sm text-on-surface-variant">
                Distribución de transacciones del periodo actual
              </p>
            </div>
            <Icon name="account_balance_wallet" className="text-xl text-on-surface-variant" />
          </div>

          {/* Stacked share bar */}
          <div className="mt-4">
            <div className="flex h-3.5 w-full overflow-hidden rounded-full bg-background shadow-inner">
              {PAYMENT_MIX.map((method) => (
                <div
                  key={method.id}
                  title={`${method.legend}: ${method.pct}%`}
                  style={{ width: `${method.pct}%` }}
                  className={cn(
                    "h-full transition-all",
                    method.id === "card" && "bg-primary",
                    method.id === "sepa" && "bg-secondary",
                    method.id === "cash" && "bg-series-efectivo",
                  )}
                />
              ))}
            </div>
            <div className="mt-2 flex items-center justify-between px-0.5 text-xs font-medium text-on-surface-variant">
              {PAYMENT_MIX.map((method) => (
                <span key={method.id}>
                  {method.pct}% {method.legend}
                </span>
              ))}
            </div>
          </div>

          {/* Detailed legend per method */}
          <div className="mt-6 space-y-4">
            {PAYMENT_MIX.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between rounded-lg border border-outline-variant/70 bg-background p-3"
              >
                <span className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                      method.id === "card" && "bg-primary-container text-primary",
                      method.id === "sepa" && "bg-secondary-container text-secondary",
                      method.id === "cash" && "bg-tertiary-container text-series-efectivo",
                    )}
                  >
                    <Icon name={METHOD_ICON[method.id]} className="text-xl" />
                  </span>
                  <span>
                    <span className="block text-xs font-bold text-on-surface">{method.label}</span>
                    <span
                      className={cn(
                        "block text-xs font-medium",
                        method.id === "cash"
                          ? "text-on-surface-variant"
                          : "text-secondary",
                      )}
                    >
                      {method.rate}
                    </span>
                  </span>
                </span>
                <span className="text-right">
                  <span className="block text-xs font-bold tabular-figures text-on-surface">
                    {euros(paymentMixCents(method.pct))}
                  </span>
                  <span className="block text-xs tabular-figures text-on-surface-variant">
                    {method.count}
                  </span>
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-outline-variant pt-3 text-xs text-on-surface-variant">
            <span className="flex items-center gap-1">
              <Icon name="verified" className="text-sm text-secondary" />
              Stripe Connect &amp; Redsys activos
            </span>
            <a href="#" className="font-semibold text-primary hover:underline">
              Configurar pasarelas
            </a>
          </div>
        </Card>
      </section>
    </div>
  );
}
