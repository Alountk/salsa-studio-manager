import { Button, Card, CardHeader, MetricCard, StatusPill } from "@/components/ui";

/**
 * Design 1, screen 06 — Inicio · administración.
 * Spec: scripts/design-plan.mjs, designs/01-acceso-y-usuarios/06-inicio-administracion.png
 * Behaviour: docs/flows/01-access-and-users.md, "Primary flow — returning user".
 */

const WEEK = [
  { day: "L", date: "12", classes: 7 },
  { day: "M", date: "13", classes: 9 },
  { day: "X", date: "14", classes: 6 },
  { day: "J", date: "15", classes: 8 },
  { day: "V", date: "16", classes: 10 },
  { day: "S", date: "17", classes: 4 },
  { day: "D", date: "18", classes: 0 },
];

const MAX_CLASSES = 10;

const ATTENTION = [
  {
    text: "Factura V-2026-0179 vencida hace 6 días",
    status: "overdue" as const,
    href: "/facturacion",
  },
  {
    text: "Clase del jueves 20:00 sin profesor asignado",
    status: "unassigned" as const,
    href: "/clases",
  },
  {
    text: "Conflicto de sala el sábado de 18:00 a 19:30",
    status: "conflict" as const,
    href: "/calendario",
  },
];

export function AdminHome() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-headline-lg text-on-surface">
            Resumen del estudio
          </h2>
          <p className="mt-1 text-body-md text-on-surface-variant">
            Cifras del mes en curso y lo que necesita una decisión.
          </p>
        </div>
        <select
          aria-label="Periodo"
          defaultValue="2026-10"
          className="h-11 rounded-sm border border-outline-variant bg-surface px-4 py-3 font-sans text-body-md text-on-surface outline-none focus:border-primary focus:shadow-[var(--focus-ring-input)]"
        >
          <option value="2026-10">Octubre 2026</option>
          <option value="2026-09">Septiembre 2026</option>
          <option value="2026-08">Agosto 2026</option>
        </select>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Clases este mes" value="184" delta={{ label: "+12", tone: "positive" }} />
        <MetricCard label="Reservas" value="1.247" delta={{ label: "+8 %", tone: "positive" }} />
        <MetricCard
          label="Ingresos del mes"
          value="14.320 €"
          delta={{ label: "+5 %", tone: "positive" }}
        />
        <MetricCard
          label="Facturas pendientes"
          value="3.180 €"
          delta={{ label: "-0,4 %", tone: "negative" }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <Card>
          <CardHeader
            title="Semana en curso"
            action={
              <a href="/calendario" className="text-body-sm text-primary hover:underline">
                Ver calendario
              </a>
            }
          />
          <ul className="grid grid-cols-7 gap-2">
            {WEEK.map((entry) => (
              <li
                key={entry.date}
                className="flex flex-col items-center gap-2 rounded-md border border-outline-variant bg-surface-container-low p-3"
              >
                <span className="text-label uppercase text-on-surface-variant">{entry.day}</span>
                <span className="text-body-md tabular-figures text-on-surface">{entry.date}</span>
                <div className="flex h-24 w-full items-end justify-center" aria-hidden="true">
                  <span
                    className="w-full rounded-sm bg-primary"
                    style={{ height: `${Math.max((entry.classes / MAX_CLASSES) * 100, 4)}%` }}
                  />
                </div>
                <span className="text-label tabular-figures text-on-surface-variant">
                  {entry.classes > 0 ? `${entry.classes} clases` : "—"}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader title="Requiere atención" />
            <ul className="flex flex-col divide-y divide-outline-variant">
              {ATTENTION.map((item) => (
                <li key={item.text} className="flex items-center justify-between gap-3 py-3">
                  <span className="flex items-center gap-2 text-body-md text-on-surface">
                    <StatusPill status={item.status} />
                    <span className="min-w-0">{item.text}</span>
                  </span>
                  <a
                    href={item.href}
                    className="shrink-0 text-body-sm text-primary hover:underline"
                  >
                    Resolver
                  </a>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader title="Acciones rápidas" />
            <div className="grid gap-3">
              <Button variant="secondary" icon="add" fullWidth>
                Crear clase
              </Button>
              <Button variant="secondary" icon="receipt_long" fullWidth>
                Nueva factura
              </Button>
              <Button variant="secondary" icon="person_add" fullWidth>
                Invitar profesor
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
