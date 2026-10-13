import { Avatar, Button, Card, CardHeader, Icon, MetricCard, StatusPill, type StatusKind } from "@/components/ui";

/**
 * Design 1, screen 05 — Inicio · profesor.
 * Spec: scripts/design-plan.mjs, designs/01-acceso-y-usuarios/05-inicio-profesor.png
 * Behaviour: docs/flows/01-access-and-users.md, "Primary flow — returning user".
 */

interface AgendaRow {
  time: string;
  name: string;
  room: string;
  occupancy: string;
  status: StatusKind;
  statusLabel?: string;
}

const AGENDA: AgendaRow[] = [
  { time: "11:00", name: "Salsa Iniciación", room: "Sala 2", occupancy: "8/12", status: "confirmed" },
  { time: "17:00", name: "Bachata Iniciación", room: "Sala 1", occupancy: "6/12", status: "confirmed" },
  {
    time: "19:30",
    name: "Salsa Avanzado",
    room: "Sala 1",
    occupancy: "5/10",
    status: "pending",
    statusLabel: "Falta pasar lista",
  },
  { time: "21:00", name: "Salsa Intermedio", room: "Sala 2", occupancy: "14/16", status: "waitlist" },
];

const EXPANDED = AGENDA[2];

export function TeacherHome() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h2 className="font-display text-headline-lg text-on-surface">Buenas tardes, Marcos</h2>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Hoy tienes 4 clases, 6,5 horas de clase.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader
            title="Agenda de hoy"
            action={
              <span className="text-label uppercase text-on-surface-variant tabular-figures">
                12/10/2026
              </span>
            }
          />

          <ul className="flex flex-col divide-y divide-outline-variant">
            {AGENDA.map((row) => {
              const expanded = row.time === EXPANDED.time;
              return (
                <li
                  key={row.time}
                  className={`flex flex-col gap-4 py-4 ${expanded ? "rounded-md bg-surface-container-low px-4" : ""}`}
                >
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="w-14 font-display text-headline-sm tabular-figures text-on-surface">
                      {row.time}
                    </span>
                    <span className="flex-1 text-body-md font-medium text-on-surface">
                      {row.name}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-body-sm text-on-surface-variant">
                      <Icon name="door_front" className="text-[1rem]" />
                      {row.room}
                    </span>
                    <span className="w-16 text-right text-body-sm tabular-figures text-on-surface-variant">
                      {row.occupancy}
                    </span>
                    <StatusPill status={row.status} label={row.statusLabel} />
                  </div>

                  {expanded ? (
                    <div className="flex flex-wrap items-center justify-between gap-4 pl-[4.5rem]">
                      <div className="flex items-center -space-x-2" aria-label="Alumnos de la clase">
                        <Avatar name="Javier Ruiz" role="student" />
                        <Avatar name="Ana Prieto" role="student" />
                        <Avatar name="Lucía Moreno" role="student" />
                        <span className="ml-4 text-body-sm text-on-surface-variant">
                          y 2 alumnos más
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <Button size="compact" variant="secondary">
                          Ver alumnos
                        </Button>
                        <Button size="compact">Pasar lista</Button>
                      </div>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </Card>

        <div className="flex flex-col gap-6">
          <MetricCard
            label="Horas esta semana"
            value="18,5"
            delta={{ label: "+2,5", tone: "positive" }}
            hint="Frente a la semana pasada"
          />
          <MetricCard label="Alumnos distintos" value="42" hint="En las últimas 4 semanas" />
          <MetricCard
            label="Listas sin cerrar"
            value="2"
            delta={{ label: "pendiente", tone: "negative" }}
            hint="Clases de las últimas 48 horas"
          />

          <Card>
            <CardHeader title="Acciones rápidas" />
            <div className="flex flex-col gap-3">
              <Button variant="secondary" icon="add" fullWidth>
                Crear clase
              </Button>
              <Button variant="secondary" icon="view_week" fullWidth>
                Ver mi semana
              </Button>
              <Button variant="secondary" icon="edit_calendar" fullWidth>
                Editar disponibilidad
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
