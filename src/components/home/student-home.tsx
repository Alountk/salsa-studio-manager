import Link from "next/link";
import { Avatar, Card, CardHeader, Icon, LinkButton, ProgressRing, StatusPill } from "@/components/ui";

/**
 * Design 1, screen 04 — Inicio · alumno.
 * Spec: scripts/design-plan.mjs, designs/01-acceso-y-usuarios/04-inicio-alumno.png
 * Behaviour: docs/flows/01-access-and-users.md, "Primary flow — new student".
 */

const WEEK = [
  { day: "L", date: "12/10", className: "Salsa Iniciación", time: "18:00" },
  { day: "M", date: "13/10", className: "Salsa Intermedio", time: "19:30" },
  { day: "X", date: "14/10", className: null, time: null },
  { day: "J", date: "15/10", className: "Bachata", time: "20:00" },
  { day: "V", date: "16/10", className: null, time: null },
];

const INVOICES = [
  { number: "V-2026-0184", date: "01/10/2026", amount: "79,00 €" },
  { number: "V-2026-0171", date: "01/09/2026", amount: "79,00 €" },
];

export function StudentHome() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h2 className="font-display text-headline-lg text-on-surface">Hola, Lucía</h2>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Tienes 3 clases reservadas esta semana.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          {/* Next class — the leading block of this screen */}
          <Card>
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-label uppercase text-on-surface-variant">
                  Tu próxima clase
                </p>
                <p className="mt-2 text-label uppercase text-primary">
                  Salsa en línea
                </p>
                <h3 className="font-display text-headline-md text-on-surface">
                  Salsa Intermedio
                </h3>
              </div>
              <StatusPill status="confirmed" label="Intermedio" />
            </div>

            <dl className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <Avatar name="Marcos Delgado" role="teacher" size={40} />
                <div>
                  <dt className="text-label uppercase text-on-surface-variant">Profesor</dt>
                  <dd className="text-body-md text-on-surface">Marcos Delgado</dd>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Icon name="door_front" className="text-[1.5rem] text-primary" />
                <div>
                  <dt className="text-label uppercase text-on-surface-variant">Sala</dt>
                  <dd className="text-body-md text-on-surface">Sala 1</dd>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Icon name="calendar_today" className="text-[1.5rem] text-primary" />
                <div>
                  <dt className="text-label uppercase text-on-surface-variant">Fecha</dt>
                  <dd className="text-body-md tabular-figures text-on-surface">
                    martes, 13/10/2026
                  </dd>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Icon name="schedule" className="text-[1.5rem] text-primary" />
                <div>
                  <dt className="text-label uppercase text-on-surface-variant">Horario</dt>
                  <dd className="text-headline-sm tabular-figures text-on-surface">
                    19:30 - 21:00
                  </dd>
                </div>
              </div>
            </dl>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-outline-variant pt-5">
              <span className="inline-flex items-center gap-2 text-body-md text-on-surface-variant">
                <Icon name="hourglass_top" className="text-[1.125rem] text-tertiary" />
                en 2 días
              </span>
              <div className="flex gap-3">
                <LinkButton href="/calendario" variant="secondary">
                  Añadir al calendario
                </LinkButton>
                <LinkButton href="/calendario?clase=c-m2&amp;vista=semana">Ver clase</LinkButton>
              </div>
            </div>
          </Card>

          {/* Week strip */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-label uppercase text-on-surface-variant">Tu semana</h3>
              <Link
                href="/calendario/mis-reservas"
                className="text-body-sm text-primary hover:underline"
              >
                Ver mis reservas
              </Link>
            </div>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {WEEK.map((entry) => (
                <li
                  key={entry.date}
                  className="flex flex-col gap-1 rounded-md border border-outline-variant bg-surface p-3 shadow-card"
                >
                  <span className="text-label uppercase text-on-surface-variant">
                    {entry.day} · {entry.date}
                  </span>
                  {entry.className ? (
                    <>
                      <span className="text-body-sm font-medium text-on-surface">
                        {entry.className}
                      </span>
                      <span className="text-label tabular-figures text-primary">
                        {entry.time}
                      </span>
                    </>
                  ) : (
                    <span className="text-body-sm text-on-surface-disabled">Libre</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Credits */}
        <div className="flex flex-col gap-6">
          <Card className="flex flex-col items-center gap-4 text-center">
            <ProgressRing value={6} total={10} size={112}>
              <span className="font-display text-headline-md tabular-figures text-on-surface">
                6 de 10
              </span>
            </ProgressRing>
            <div>
              <p className="text-label uppercase text-on-surface-variant">Clases del bono</p>
              <p className="mt-1 text-body-sm text-on-surface-variant">
                Válido hasta el 01/01/2027
              </p>
            </div>
            <LinkButton href="/tarifas/pago" fullWidth>
              Comprar bono
            </LinkButton>
          </Card>

          <Card>
            <CardHeader title="Siguiente pago" />
            <p className="text-body-md text-on-surface-variant">Cuota mensual</p>
            <p className="font-display text-headline-md tabular-figures text-on-surface">
              79,00 €
            </p>
            <p className="mt-1 text-body-sm tabular-figures text-on-surface-variant">
              01/11/2026
            </p>
          </Card>

          <Card>
            <CardHeader
              title="Últimas facturas"
              action={
                <a href="/facturacion" className="text-body-sm text-primary hover:underline">
                  Ver todas
                </a>
              }
            />
            <ul className="flex flex-col divide-y divide-outline-variant">
              {INVOICES.map((invoice) => (
                <li key={invoice.number} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-mono text-body-sm text-on-surface">{invoice.number}</p>
                    <p className="text-label tabular-figures text-on-surface-variant">
                      {invoice.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-body-md tabular-figures text-on-surface">
                      {invoice.amount}
                    </span>
                    <StatusPill status="paid" />
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
