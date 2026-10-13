import Link from "next/link";
import {
  Avatar,
  Button,
  Card,
  CardHeader,
  ProgressRing,
  StatusPill,
  type StatusKind,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  ATTENDANCE_SUMMARY,
  attendanceRate,
  attendanceTotal,
  findClass,
  PAST_BOOKINGS,
  roomName,
  teacherName,
  UPCOMING_BOOKINGS,
} from "@/lib/schedule";

/**
 * Design 2, screen 04 — Mis reservas.
 * Spec: scripts/design-plan.mjs, designs/02-calendario-y-clases/04-mis-reservas.png
 * Behaviour: docs/flows/02-calendar-and-classes.md, step 3.
 *
 * Reachable from the student home's bookings and from the calendar; it keeps the
 * Calendario sidebar entry active because it lives under that route.
 */

const ATTENDANCE_LABEL: Record<string, StatusKind> = {
  present: "present",
  late: "late",
  absent: "absent",
};

export default function MyBookingsPage() {
  const upcoming = UPCOMING_BOOKINGS.map((booking) => ({
    ...booking,
    entry: findClass(booking.classId),
  })).filter((booking) => booking.entry);

  const groups = ["Esta semana", "Próxima semana"] as const;
  const total = attendanceTotal();
  const rate = attendanceRate();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-headline-lg text-on-surface">Mis reservas</h2>
          <p className="mt-1 text-body-md text-on-surface-variant tabular-figures">
            6 créditos disponibles
          </p>
        </div>
        <Link href="/calendario">
          <Button icon="add">Reservar clase</Button>
        </Link>
      </header>

      {/* Summary row */}
      <div className="grid gap-6 sm:grid-cols-3">
        <Card className="flex flex-col gap-1">
          <p className="text-label uppercase text-on-surface-variant">Próximas</p>
          <p className="font-display text-metric tabular-figures text-on-surface">
            {upcoming.length}
          </p>
        </Card>
        <Card className="flex items-center gap-4">
          <ProgressRing value={6} total={10} size={72} stroke={6}>
            <span className="text-body-sm font-medium tabular-figures text-on-surface">
              6/10
            </span>
          </ProgressRing>
          <div>
            <p className="text-label uppercase text-on-surface-variant">Créditos</p>
            <p className="text-body-md text-on-surface">6 de 10 del bono</p>
          </div>
        </Card>
        <Card className="flex flex-col gap-1">
          <p className="text-label uppercase text-on-surface-variant">Lista de espera</p>
          <p className="font-display text-metric tabular-figures text-on-surface">
            {upcoming.filter((booking) => booking.status === "waitlist").length}
          </p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          {/* Upcoming, grouped as the design specifies */}
          <Card>
            <CardHeader title="Próximas clases" />
            {groups.map((group) => {
              const rows = upcoming.filter((booking) => booking.group === group);
              if (rows.length === 0) return null;
              return (
                <section key={group} className="mb-5 last:mb-0">
                  <h3 className="mb-2 text-label uppercase text-on-surface-variant">
                    {group}
                  </h3>
                  <ul className="flex flex-col divide-y divide-outline-variant">
                    {rows.map((booking) => {
                      const entry = booking.entry!;
                      return (
                        <li
                          key={booking.classId}
                          className="flex flex-wrap items-center gap-x-4 gap-y-3 py-3"
                        >
                          <span className="w-20 shrink-0 text-body-sm text-on-surface-variant">
                            <span className="block font-medium text-on-surface">
                              {booking.dayLabel}
                            </span>
                            <span className="tabular-figures">{entry.start}</span>
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-body-md text-on-surface">
                              {entry.title}
                            </span>
                            <span className="block truncate text-body-sm text-on-surface-variant">
                              {teacherName(entry.teacherId)} · {roomName(entry.roomId)}
                            </span>
                          </span>
                          <StatusPill
                            status={booking.status}
                            label={booking.status === "waitlist" ? "Lista de espera" : "Confirmada"}
                          />
                          <span className="flex shrink-0 gap-2">
                            <Button size="compact" variant="secondary">
                              Reprogramar
                            </Button>
                            <Button size="compact" variant="danger">
                              Cancelar
                            </Button>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
          </Card>

          {/* Past */}
          <Card>
            <CardHeader title="Clases pasadas" />
            <ul className="flex flex-col divide-y divide-outline-variant">
              {PAST_BOOKINGS.map((booking) => (
                <li
                  key={booking.date}
                  className="flex items-center justify-between gap-4 py-3 opacity-80"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <Avatar name={booking.title} role="student" size={32} />
                    <span className="min-w-0">
                      <span className="block truncate text-body-md text-on-surface">
                        {booking.title}
                      </span>
                      <span className="block text-body-sm tabular-figures text-on-surface-variant">
                        {booking.date}
                      </span>
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-3">
                    <StatusPill status={ATTENDANCE_LABEL[booking.attendance] ?? "present"} />
                    <button
                      type="button"
                      className="text-body-sm text-primary hover:underline"
                    >
                      Ver detalle
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Attendance summary */}
        <Card>
          <CardHeader title="Resumen de asistencia" />
          <p className="text-body-sm text-on-surface-variant">
            Últimas {total} clases
          </p>

          <div
            className="mt-4 flex h-3 w-full overflow-hidden rounded-pill"
            role="img"
            aria-label={`${ATTENDANCE_SUMMARY.present} presentes, ${ATTENDANCE_SUMMARY.late} retrasos, ${ATTENDANCE_SUMMARY.absent} ausencias`}
          >
            <span
              className="h-full bg-secondary"
              style={{ width: `${(ATTENDANCE_SUMMARY.present / total) * 100}%` }}
            />
            <span
              className="h-full bg-tertiary"
              style={{ width: `${(ATTENDANCE_SUMMARY.late / total) * 100}%` }}
            />
            <span
              className="h-full bg-error"
              style={{ width: `${(ATTENDANCE_SUMMARY.absent / total) * 100}%` }}
            />
          </div>

          <ul className="mt-4 flex flex-col gap-2">
            <LegendRow colour="bg-secondary" label="Presentes" value={ATTENDANCE_SUMMARY.present} />
            <LegendRow colour="bg-tertiary" label="Retrasos" value={ATTENDANCE_SUMMARY.late} />
            <LegendRow colour="bg-error" label="Ausencias" value={ATTENDANCE_SUMMARY.absent} />
          </ul>

          <p className="mt-5 border-t border-outline-variant pt-4 font-display text-headline-md tabular-figures text-on-surface">
            {rate} % de asistencia
          </p>
        </Card>
      </div>
    </div>
  );
}

function LegendRow({ colour, label, value }: { colour: string; label: string; value: number }) {
  return (
    <li className="flex items-center gap-2 text-body-sm text-on-surface-variant">
      <span className={cn("h-3 w-3 rounded-pill", colour)} aria-hidden="true" />
      <span className="flex-1">{label}</span>
      <span className="tabular-figures text-on-surface">{value}</span>
    </li>
  );
}
