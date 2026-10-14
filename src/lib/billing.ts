/**
 * Static billing data for Design 3.
 *
 * Like `src/lib/schedule.ts` for Design 2, every figure shown across the eight
 * billing screens comes from this module, and every derived total (VAT, plan
 * splits, chart heights, selection sums) is computed here so the screens cannot
 * contradict each other.
 *
 * Money is stored in integer cents and formatted by `euros()`. Copy and figures
 * follow the exported screens in `designs/03-facturacion/*.html` — the artifacts
 * the verification captures are compared against; where the generation prompts
 * in `scripts/design-plan.mjs` word something differently, the export wins
 * (feature doc `odd/tasks/design-3-billing.md`, Log L2).
 */

/* ---------------------------------- money ---------------------------------- */

/**
 * Spanish euro formatting over integer cents.
 *
 * `euros(14520)` → `"145,20 €"` · `euros(1432000, 0)` → `"14.320 €"`.
 * With `decimals: 0` the value is rounded to whole euros, which is how the
 * dashboard KPIs and chart tooltips render (`601440 → "6.014 €"`).
 */
export function euros(cents: number, decimals: 0 | 2 = 2): string {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  const value = decimals === 0 ? Math.round(abs / 100) : abs / 100;
  const [whole, fraction] = value.toFixed(decimals).split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${sign}${grouped}${fraction ? `,${fraction}` : ""} €`;
}

/** Flat Spanish IVA rate applied by every designed figure. */
export const VAT_RATE = 0.21;

/** VAT owed on a net amount in cents: `8595 → 1805` (`18,05 €`). */
export function vatOf(netCents: number): number {
  return Math.round(netCents * VAT_RATE);
}

/** Net amount plus its VAT: `7355 → 8900` (`89,00 €`). */
export function grossOf(netCents: number): number {
  return netCents + vatOf(netCents);
}

/* ------------------------------ invoice status ------------------------------ */

/**
 * Status vocabulary shared with `StatusPill` (`paid` → Pagada, `pending` →
 * Pendiente, `overdue` → Vencida); kept local so this module stays import-free.
 */
export type InvoiceStatus = "paid" | "pending" | "overdue";

export const STATUS_LABEL: Record<InvoiceStatus, string> = {
  paid: "Pagada",
  pending: "Pendiente",
  overdue: "Vencida",
};

/* --------------------------- 01 · plans and pricing --------------------------- */

export interface Plan {
  id: "suelta" | "bono" | "mensual";
  name: string;
  icon: string;
  priceCents: number;
  /** Unit rendered beside the price, e.g. `"/ clase"`. */
  unit: string;
  /** Lines under the price: `["Pago único por sesión"]`. */
  subnotes: string[];
  /** Terracotta ribbon on the highlighted plan (`"MÁS ELEGIDO"`). */
  badge: string | null;
  description: string;
  features: string[];
  cta: string;
  ctaVariant: "primary" | "secondary";
}

export const PLANS: Plan[] = [
  {
    id: "suelta",
    name: "Clase suelta",
    icon: "timer",
    priceCents: 1500,
    unit: "/ clase",
    subnotes: ["Pago único por sesión"],
    badge: null,
    description:
      "Ideal para probar el método de la academia, soltarte o asistir esporádicamente según tu agenda.",
    features: [
      "Acceso a cualquier nivel y estilo",
      "Reserva online inmediata",
      "Cancela hasta 4 h antes sin coste",
    ],
    cta: "Reservar suelta",
    ctaVariant: "secondary",
  },
  {
    id: "bono",
    name: "Bono de 10 clases",
    icon: "star",
    priceCents: 12000,
    unit: "/ bono",
    subnotes: ["12,00 € por clase", "Ahorro de 30 €"],
    badge: "MÁS ELEGIDO",
    description:
      "La opción predilecta para aprender con constancia técnica, ritmo sólido y máxima flexibilidad de horarios.",
    features: [
      "10 clases con 3 meses de validez",
      "Compartible con 1 acompañante",
      "1 clase de prueba gratis",
    ],
    cta: "Comprar bono",
    ctaVariant: "primary",
  },
  {
    id: "mensual",
    name: "Mensual ilimitado",
    icon: "all_inclusive",
    priceCents: 8900,
    unit: "/ mes",
    subnotes: ["Renovación automática flexible"],
    badge: null,
    description:
      "Para bailarines apasionados y estudiantes dedicados que entrenan 2 o más veces por semana en la sala.",
    features: [
      "Todas las clases de la parrilla semanal",
      "Sin límite de reservas de baile",
      "Congela 1 mes al año por vacaciones",
    ],
    cta: "Suscribirme",
    ctaVariant: "secondary",
  },
];

export type CompareCell =
  | { kind: "check"; note?: string }
  | { kind: "dash" }
  | { kind: "text"; value: string };

export interface CompareRow {
  feature: string;
  cells: [CompareCell, CompareCell, CompareCell];
}

export const COMPARE_HEADER = [
  "Prestación / Característica",
  "Clase suelta",
  "Bono 10 clases",
  "Mensual ilimitado",
];

export const PLAN_COMPARISON: CompareRow[] = [
  {
    feature: "Reserva flexible online",
    cells: [{ kind: "check" }, { kind: "check" }, { kind: "check" }],
  },
  {
    feature: "Validez temporal",
    cells: [
      { kind: "text", value: "30 días" },
      { kind: "text", value: "3 meses" },
      { kind: "text", value: "Mensual renovable" },
    ],
  },
  {
    feature: "Acompañante incluido",
    cells: [{ kind: "dash" }, { kind: "check", note: "1 invitado / sesión" }, { kind: "dash" }],
  },
  {
    feature: "Talleres especiales fin de semana",
    cells: [
      { kind: "dash" },
      { kind: "text", value: "10% de descuento" },
      { kind: "check", note: "Acceso preferente" },
    ],
  },
  {
    feature: "Congelación de cuota",
    cells: [{ kind: "dash" }, { kind: "dash" }, { kind: "check", note: "Hasta 30 días al año" }],
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ: FaqItem[] = [
  {
    question: "¿Puedo cancelar mi suscripción cuando quiera?",
    answer:
      "Sí, desde tu área privada de facturación y sin coste alguno ni penalizaciones. Mantendrás el acceso a todas las clases hasta que termine el periodo mensual pagado.",
  },
  {
    question: "¿Qué ocurre si no puedo asistir a una clase reservada?",
    answer:
      "Puedes cancelar tu plaza directamente desde la aplicación web hasta 4 horas antes del inicio de la sesión. Si tienes bono o clase suelta, el crédito se reintegrará automáticamente en tu saldo.",
  },
  {
    question: "¿Cómo comparto las clases de mi bono con un acompañante?",
    answer:
      'Al reservar cualquier clase en la plataforma, puedes marcar la casilla "Asistir con acompañante". El sistema descontará dos créditos de tu bono de 10 clases simultáneamente para reservar ambas plazas.',
  },
];

/* ------------------------------ 02 · checkout ------------------------------ */

export const CHECKOUT_ORDER = {
  item: {
    name: "Bono de 10 clases",
    meta: "Validez 3 meses · Acceso total",
    tags: ["Salsa Cubana", "Bachata", "Rueda"],
  },
  subtotalCents: 12000,
  /** `12000 → 2520` (`25,20 €`). */
  ivaCents: vatOf(12000),
  /** `14520` (`145,20 €`) — shared with the payment result. */
  totalCents: 12000 + vatOf(12000),
};

/* --------------------------- 03 · payment result --------------------------- */

export const PAYMENT_RESULT = {
  reference: "PED-2026-0184",
  concept: "Bono de 10 clases",
  /** Single source: the checkout total. */
  amountCents: CHECKOUT_ORDER.totalCents,
  method: "Visa •••• 4242",
  nextCharge: "01/11/2026",
  receiptEmail: "alicia.salsa@ejemplo.com",
};

export const PAYMENT_FAILURE = {
  code: "ERR_CARD_DECLINED_05",
  attemptMethod: PAYMENT_RESULT.method,
  attemptAmountCents: PAYMENT_RESULT.amountCents,
};

/* -------------------------- 04 · student billing area -------------------------- */

export const STUDENT_PLAN = {
  name: "Mensual Ilimitado",
  priceCents: 8900,
  unit: "/ mes",
  accessNote: "Acceso libre a clases regulares de Salsa & Bachata",
  creditsUsed: 6,
  creditsTotal: 10,
  renewsOn: "01/11/2026",
  autoRenew: true,
};

/** `"4 disponibles este mes"` — derived, never hand-written. */
export const CREDITS_LEFT = STUDENT_PLAN.creditsTotal - STUDENT_PLAN.creditsUsed;

export interface StoredMethod {
  id: string;
  label: string;
  meta: string;
  principal: boolean;
}

export const STUDENT_METHODS: StoredMethod[] = [
  { id: "visa", label: "Visa •••• 4242", meta: "Caduca 12/28", principal: false },
  { id: "sepa", label: "SEPA •••• 8891", meta: "Domiciliación bancaria directa", principal: true },
];

export interface StudentInvoice {
  number: string;
  date: string;
  concept: string;
  amountCents: number;
  status: InvoiceStatus;
}

export const STUDENT_INVOICES: StudentInvoice[] = [
  { number: "V-2026-0184", date: "01/10/2026", concept: "Mensual Ilimitado", amountCents: 8900, status: "paid" },
  { number: "V-2026-0171", date: "01/09/2026", concept: "Mensual Ilimitado", amountCents: 8900, status: "paid" },
  { number: "V-2026-0158", date: "01/08/2026", concept: "Bono de 10 clases", amountCents: 12000, status: "paid" },
  { number: "V-2026-0142", date: "01/07/2026", concept: "Mensual Ilimitado", amountCents: 8900, status: "paid" },
  { number: "V-2026-0130", date: "12/06/2026", concept: "Clase suelta", amountCents: 1500, status: "pending" },
  { number: "V-2026-0118", date: "01/06/2026", concept: "Mensual Ilimitado", amountCents: 8900, status: "paid" },
];

/** Footer `"Mostrando 6 de 18 facturas registradas" — only 6 are designed. */
export const STUDENT_INVOICE_COUNT = 18;

/* ---------------------------- 05 · invoice document ---------------------------- */

export interface InvoiceLine {
  description: string;
  detail: string;
  quantity: number;
  /** Net unit price in cents (`7355` → `73,55 €`). */
  netCents: number;
  /** First line carries the `level-intermediate-container` highlight. */
  highlight?: boolean;
}

export const INVOICE_DETAIL = {
  number: "V-2026-0184",
  status: "paid" as const,
  issuedOn: "01/10/2026",
  dueOn: "15/10/2026",
  paymentRef: "SEPA •••• 8891",
  issuer: {
    name: "Estudio Salsa S.L.",
    taxId: "CIF: B-87654321",
    address: "Calle Bailén 14",
    city: "28005 Madrid, España",
    email: "hola@estudiosalsa.es",
  },
  buyer: {
    name: "Lucía Moreno",
    taxId: "NIF: 12345678Z",
    address: "Calle Bailén 14, 2º B",
    city: "28005 Madrid, España",
  },
  lines: [
    {
      description: "Mensual Ilimitado · Octubre 2026",
      detail: "Acceso completo a Salsa Cubana, Mambo y Bachata",
      quantity: 1,
      netCents: 7355,
      highlight: true,
    },
    {
      description: "Clase suelta extra",
      detail: "Taller especial de Estilo Chico/Chica con Marcos G.",
      quantity: 1,
      netCents: 1240,
    },
  ] satisfies InvoiceLine[],
  legal: {
    badge: "Liquidación SEPA confirmada",
    note: "Documento expedido conforme al Reglamento de Facturación. Inscrita en el Registro Mercantil de Madrid.",
    registry:
      "Estudio Salsa S.L. · Tomo 34.201, Libro 0, Folio 140, Sección 8, Hoja M-615438 · Soporte: contabilidad@estudiosalsa.es",
  },
};

/** Gross total of one line: `net × qty` plus its VAT (`7355 → 8900`). */
export function invoiceLineTotalCents(line: InvoiceLine): number {
  return grossOf(line.netCents * line.quantity);
}

export interface InvoiceTotals {
  subtotalCents: number;
  vatCents: number;
  totalCents: number;
}

/**
 * Document totals derived from the lines: designed figures are
 * `85,95 € / 18,05 € / 104,00 €`, and the sum of the gross lines agrees with
 * the grand total, so every figure on the screen traces back to one source.
 */
export function invoiceTotals(lines: InvoiceLine[]): InvoiceTotals {
  const subtotalCents = lines.reduce((sum, line) => sum + line.netCents * line.quantity, 0);
  const vatCents = vatOf(subtotalCents);
  return { subtotalCents, vatCents, totalCents: subtotalCents + vatCents };
}

export const INVOICE_TOTALS = invoiceTotals(INVOICE_DETAIL.lines);

/* --------------------------- 06 · revenue dashboard --------------------------- */

export interface RevenueMonth {
  /** Axis label: `"Nov"` … current month renders `"Oct 26"`. */
  short: string;
  long: string;
  totalCents: number;
  /** Share of the stacked bar taken by "Bonos & Clases" (rest = Suscripciones). */
  bonosPct: number;
  current?: boolean;
}

export const REVENUE_SERIES: RevenueMonth[] = [
  { short: "Nov", long: "Noviembre 2025", totalCents: 1120000, bonosPct: 32 },
  { short: "Dic", long: "Diciembre 2025", totalCents: 1260000, bonosPct: 30 },
  { short: "Ene", long: "Enero 2026", totalCents: 1310000, bonosPct: 35 },
  { short: "Feb", long: "Febrero 2026", totalCents: 1190000, bonosPct: 28 },
  { short: "Mar", long: "Marzo 2026", totalCents: 1240000, bonosPct: 29 },
  { short: "Abr", long: "Abril 2026", totalCents: 1350000, bonosPct: 33 },
  { short: "May", long: "Mayo 2026", totalCents: 1410000, bonosPct: 30 },
  { short: "Jun", long: "Junio 2026", totalCents: 1450000, bonosPct: 34 },
  { short: "Jul", long: "Julio 2026", totalCents: 1080000, bonosPct: 25 },
  { short: "Ago", long: "Agosto 2026", totalCents: 920000, bonosPct: 20 },
  { short: "Sep", long: "Septiembre 2026", totalCents: 1362000, bonosPct: 38 },
  { short: "Oct", long: "Octubre 2026", totalCents: 1432000, bonosPct: 42, current: true },
];

export const CURRENT_MONTH = REVENUE_SERIES[REVENUE_SERIES.length - 1];

/** Y axis top (`20 k€`); bar height = `total / max × 100`. */
export const REVENUE_AXIS_MAX_CENTS = 2000000;

/**
 * Designed mean line label (`"Media mensual 12.850 €"`). It is *not* the
 * arithmetic mean of the series (12.603 €) — a designed figure, reproduced as
 * exported (feature doc, Findings).
 */
export const REVENUE_MEAN_CENTS = 1285000;

/**
 * Bar height as a percentage of the plot area: `1120000 → 56`.
 * Rounded to two decimals so the float artifact (`56.00000000000001`)
 * never reaches a `style` attribute — the designed heights are exact
 * (`56`, `63`, `65.5`, … `71.6`).
 */
export function barHeightPct(cents: number): number {
  return Math.round(((cents / REVENUE_AXIS_MAX_CENTS) * 100) * 100) / 100;
}

export interface RevenueSplit {
  bonosCents: number;
  suscripcionesCents: number;
}

/** Stacked split of one month: tooltips show `"Bonos: 3.584 €"` for November. */
export function revenueSplit(month: RevenueMonth): RevenueSplit {
  const bonosCents = Math.round((month.totalCents * month.bonosPct) / 100);
  return { bonosCents, suscripcionesCents: month.totalCents - bonosCents };
}

/** KPI "Ingresos del mes" and every October-derived figure share this source. */
export const PENDING_TOTAL_CENTS = 318000;

export interface DashboardKpi {
  id: string;
  label: string;
  icon: string;
  value: string;
  delta?: { text: string; tone: "positive" | "negative" };
  pill?: string;
  hint: string;
}

export const KPIS: DashboardKpi[] = [
  {
    id: "mrr",
    label: "Ingresos recurrentes",
    icon: "sync",
    value: euros(834000, 0),
    delta: { text: "+6,2 %", tone: "positive" },
    hint: "MRR suscripciones",
  },
  {
    id: "month",
    label: "Ingresos del mes",
    icon: "payments",
    value: euros(CURRENT_MONTH.totalCents, 0),
    delta: { text: "+5,1 %", tone: "positive" },
    hint: "Octubre 2026 en curso",
  },
  {
    id: "pending",
    label: "Pendiente de cobro",
    icon: "pending_actions",
    value: euros(PENDING_TOTAL_CENTS, 0),
    pill: "3 emitidas",
    hint: "Sin liquidar",
  },
  {
    id: "churn",
    label: "Bajas (Churn)",
    icon: "person_remove",
    value: "2,4 %",
    delta: { text: "-0,3 %", tone: "positive" },
    hint: "vs. sept. 2026",
  },
];

export interface PlanSplit {
  id: string;
  label: string;
  pct: number;
}

export const PLAN_SPLIT: PlanSplit[] = [
  { id: "mensual", label: "Mensual ilimitado", pct: 58 },
  { id: "bono", label: "Bono 10 clases", pct: 27 },
  { id: "suelta", label: "Clase suelta", pct: 15 },
];

/** Donut amount from the month total: `58% → 830560` (`8.305,60 €`). */
export function planSplitCents(pct: number): number {
  return Math.round((CURRENT_MONTH.totalCents * pct) / 100);
}

/** Donut centre `"184 alumnos"`. */
export const PLAN_SPLIT_STUDENTS = 184;

export interface Debtor {
  name: string;
  ref: string;
  amountCents: number;
  daysLate: number;
}

export const DEBTORS: Debtor[] = [
  { name: "Lucía Navarro Sanz", ref: "FAC-2026-0891", amountCents: 8900, daysLate: 14 },
  { name: "Marcos Delgado Ruiz", ref: "FAC-2026-0874", amountCents: 12000, daysLate: 21 },
  { name: "Sofía Valdés Mena", ref: "FAC-2026-0852", amountCents: 8900, daysLate: 28 },
  { name: "Alejandro Ortiz Gil", ref: "FAC-2026-0820", amountCents: 14520, daysLate: 35 },
];

/** `"Total pendiente mostrado: 443,20 €"` — sum of the four rows. */
export const DEBTORS_SHOWN_CENTS = DEBTORS.reduce((sum, debtor) => sum + debtor.amountCents, 0);

export interface PaymentShare {
  id: string;
  label: string;
  legend: string;
  pct: number;
  rate: string;
  count: string;
}

export const PAYMENT_MIX: PaymentShare[] = [
  {
    id: "card",
    label: "Tarjeta bancaria",
    legend: "Tarjeta",
    pct: 64,
    rate: "99,4 % tasa de cobro",
    count: "118 pagos",
  },
  {
    id: "sepa",
    label: "Domiciliación SEPA",
    legend: "SEPA",
    pct: 28,
    rate: "94,8 % tasa de cobro",
    count: "52 remesas",
  },
  {
    id: "cash",
    label: "Efectivo / Mostrador",
    legend: "Efectivo",
    pct: 8,
    rate: "Liquidación en caja diaria",
    count: "14 cobros",
  },
];

/**
 * Payment-method amount from the month total: `64% → 916480` (`9.164,80 €`),
 * and the three shares sum to the month total by construction.
 */
export function paymentMixCents(pct: number): number {
  return Math.round((CURRENT_MONTH.totalCents * pct) / 100);
}

/* --------------------------- 07 · admin invoice list --------------------------- */

export interface AdminInvoice {
  number: string;
  student: string;
  concept: string;
  issuedOn: string;
  dueOn: string;
  amountCents: number;
  status: InvoiceStatus;
  /** Initial bulk-bar selection (the three overdue rows in the export). */
  selected?: boolean;
}

export const ADMIN_INVOICES: AdminInvoice[] = [
  {
    number: "V-2026-0179",
    student: "Javier Ruiz",
    concept: "Clase suelta",
    issuedOn: "25/09/2026",
    dueOn: "09/10/2026",
    amountCents: 1500,
    status: "overdue",
    selected: true,
  },
  {
    number: "V-2026-0180",
    student: "Carlos Méndez",
    concept: "Bono de 10 clases",
    issuedOn: "18/09/2026",
    dueOn: "02/10/2026",
    amountCents: 12000,
    status: "overdue",
    selected: true,
  },
  {
    number: "V-2026-0182",
    student: "Sofía Navarro",
    concept: "Taller Intensivo Bachata",
    issuedOn: "22/09/2026",
    dueOn: "06/10/2026",
    amountCents: 4500,
    status: "overdue",
    selected: true,
  },
  {
    number: "V-2026-0184",
    student: "Lucía Moreno",
    concept: "Mensual Ilimitado",
    issuedOn: "01/10/2026",
    dueOn: "15/10/2026",
    amountCents: 8900,
    status: "paid",
  },
  {
    number: "V-2026-0185",
    student: "David Serrano",
    concept: "Bono de 10 clases + Estilo",
    issuedOn: "01/10/2026",
    dueOn: "15/10/2026",
    amountCents: 14520,
    status: "paid",
  },
  {
    number: "V-2026-0186",
    student: "Ana Prieto",
    concept: "Bono de 10 clases",
    issuedOn: "02/10/2026",
    dueOn: "16/10/2026",
    amountCents: 12000,
    status: "pending",
  },
  {
    number: "V-2026-0187",
    student: "Marcos Domínguez",
    concept: "Mensual Ilimitado",
    issuedOn: "03/10/2026",
    dueOn: "17/10/2026",
    amountCents: 8900,
    status: "pending",
  },
  {
    number: "V-2026-0188",
    student: "Elena Morales",
    concept: "Clase suelta extra",
    issuedOn: "03/10/2026",
    dueOn: "17/10/2026",
    amountCents: 1500,
    status: "paid",
  },
];

/** Footer `"Mostrando 1 a 8 de 42 facturas" — the list is a 42-invoice set. */
export const ADMIN_INVOICE_TOTAL_COUNT = 42;

/** `"Total filtrado: 3.180,00 €"` — same money as the pending KPI. */
export const FILTERED_TOTAL_CENTS = PENDING_TOTAL_CENTS;

export const ADMIN_INITIAL_SELECTION = ADMIN_INVOICES.filter((invoice) => invoice.selected);

/** Bulk bar `"3 facturas seleccionadas"`. */
export const ADMIN_SELECTED_COUNT = ADMIN_INITIAL_SELECTION.length;

/** `"Total acumulado: 180,00 €"` — the three overdue rows. */
export const ADMIN_SELECTED_TOTAL_CENTS = ADMIN_INITIAL_SELECTION.reduce(
  (sum, invoice) => sum + invoice.amountCents,
  0,
);

/** Table avatar initials: `"Javier Ruiz" → "JR"`. */
export function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

/* ------------------------- 08 · manual payment modal ------------------------- */

export interface ManualMethod {
  id: string;
  label: string;
  icon: string;
}

export const MANUAL_PAYMENT = {
  /** Designed "Fecha de cobro" default. */
  date: "09/10/2026",
  currency: "EUR €",
  methods: [
    { id: "efectivo", label: "Efectivo", icon: "payments" },
    { id: "transferencia", label: "Transferencia", icon: "account_balance" },
    { id: "datafono", label: "Datáfono", icon: "point_of_sale" },
  ] satisfies ManualMethod[],
  defaultMethodId: "efectivo",
};

/** `"Clase suelta 25/09/2026"` — concept plus the invoice's issue date. */
export function manualPaymentConcept(invoice: AdminInvoice): string {
  return `${invoice.concept} ${invoice.issuedOn}`;
}

/** `"javier.ruiz@ejemplo.es"` — accent-free, dot-joined student name. */
export function manualPaymentEmail(name: string): string {
  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, ".");
  return `${slug}@ejemplo.es`;
}

/**
 * Designed extras for the one modal instance with designed side content
 * (WhatsApp hint and pre-filled notes); other invoices render without them.
 */
export const MANUAL_PAYMENT_EXTRAS: Record<string, { phone?: string; notes?: string }> = {
  "V-2026-0179": {
    phone: "+34 612 345 678",
    notes: "Pago en mano antes de comenzar la sesión de Salsa Cubana Nivel 1",
  },
};
