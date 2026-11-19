import { Button, Card, Icon, MetricCard, Switch } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  AVAILABILITY,
  classesForTeacher,
  formatHours,
  HOUR_PX,
  HOUR_START,
  hoursOf,
  LEVEL_STYLE,
  minutesOf,
  roomName,
  teacherName,
  WEEK,
} from "@/lib/schedule";

/**
 * Design 2, screen 08 — Mi semana · profesor.
 * Spec: scripts/design-plan.mjs, designs/02-calendario-y-clases/08-mi-semana-profesor.png
 *
 * Only Marcos Delgado's classes are shown; the free hours inside his own
 * availability windows are hatched and labelled, and the closed Sunday is shaded.
 *
 * "Horas impartidas" and "Horas libres" are computed from the same data the
 * availability editor uses, so this screen cannot disagree with it: 6,5 h
 * programmed and 25,5 h free. Note that the exported screens disagree with each
 * other here — the availability export says 6,5 h while the teacher-home export
 * says 18,5 h for the same teacher and week. That contradiction is recorded as
 * an open question in the feature document rather than silently resolved.
 *
 * The "+2,5" delta and "42 alumnos distintos" have no data source behind them
 * (there is no previous-week history in this feature) and are shown as the
 * design specifies.
 */

const TEACHER_ID = "t1";
const HOURS = Array.from({ length: 23 - HOUR_START }, (_, i) => HOUR_START + i);
const TOTAL_HEIGHT = HOURS.length * HOUR_PX;
const CLOSED_DAY = 6;

export function TeacherWeek() {
  const classes = classesForTeacher(TEACHER_ID);
  const windows = AVAILABILITY[TEACHER_ID] ?? [];
  const programmed = classes.reduce((total, entry) => total + entry.durationMin / 60, 0);
  const available = hoursOf(windows);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-headline-lg text-on-surface">Mi semana</h2>
          <p className="mt-1 text-body-md tabular-figures text-on-surface-variant">
            12 - 18 de octubre de 2026 · {teacherName(TEACHER_ID)}
          </p>
        </div>
        <Button variant="secondary" icon="edit_calendar">
          Editar disponibilidad
        </Button>
      </header>

      <div className="grid gap-6 sm:grid-cols-3">
        <MetricCard
          label="Horas impartidas"
          value={formatHours(programmed)}
          delta={{ label: "+2,5", tone: "positive" }}
        />
        <MetricCard label="Alumnos distintos" value="42" />
        <MetricCard
          label="Horas libres"
          value={formatHours(available - programmed)}
          delta={{ label: "esta semana", tone: "positive" }}
        />
      </div>

      <section aria-label="Mi semana en la rejilla" className="overflow-hidden rounded-lg border border-outline-variant bg-surface shadow-card">
        <div className="grid grid-cols-[4rem_repeat(7,minmax(0,1fr))] border-b border-outline-variant bg-surface-container">
          <div className="border-r border-outline-variant" />
          {WEEK.map((day) => {
            const closed = day.index === CLOSED_DAY;
            return (
              <div
                key={day.index}
                className={cn(
                  "border-r border-outline-variant px-3 py-2 text-center last:border-r-0",
                  closed && "bg-surface-container-high/70",
                )}
              >
                <p className="text-label uppercase text-on-surface-variant">{day.short}</p>
                <p className="text-body-md tabular-figures text-on-surface">{day.date}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-[4rem_repeat(7,minmax(0,1fr))]">
          {/* Hour gutter */}
          <div className="relative border-r border-outline-variant" style={{ height: TOTAL_HEIGHT }}>
            {HOURS.map((hour) => (
              <span
                key={hour}
                className={cn(
                  "absolute right-2 text-label tabular-figures text-on-surface-variant",
                  hour === HOUR_START ? "" : "-translate-y-1/2",
                )}
                style={{ top: (hour - HOUR_START) * HOUR_PX }}
              >
                {String(hour).padStart(2, "0")}:00
              </span>
            ))}
          </div>

          {WEEK.map((day) => {
            const closed = day.index === CLOSED_DAY;
            const dayClasses = classes.filter((entry) => entry.day === day.index);
            const dayWindows = windows.filter((window) => window.day === day.index);

            return (
              <div
                key={day.index}
                className={cn(
                  "relative border-r border-outline-variant last:border-r-0",
                  closed && "bg-surface-container-high/70",
                )}
                style={{ height: TOTAL_HEIGHT }}
              >
                {HOURS.map((hour) => (
                  <span
                    key={hour}
                    className="absolute inset-x-0 border-t border-outline-variant"
                    style={{ top: (hour - HOUR_START) * HOUR_PX }}
                    aria-hidden="true"
                  />
                ))}

                {closed ? (
                  <span className="absolute inset-x-2 top-4 text-center text-label text-on-surface-disabled">
                    No disponible
                  </span>
                ) : null}

                {/* Free gaps inside the teacher's own availability */}
                {!closed
                  ? dayWindows.map((window) => {
                      const winStart = minutesOf(window.start);
                      const winEnd = minutesOf(window.end);
                      const busy = dayClasses.some((entry) => {
                        const start = minutesOf(entry.start);
                        return start < winEnd && winStart < start + entry.durationMin;
                      });
                      if (busy) return null;
                      const top = ((winStart - HOUR_START * 60) / 60) * HOUR_PX;
                      const height = ((winEnd - winStart) / 60) * HOUR_PX;
                      return (
                        <div
                          key={window.start}
                          className="absolute inset-x-1 flex items-center justify-center rounded-md bg-[repeating-linear-gradient(135deg,transparent,transparent_6px,rgba(224,86,31,0.14)_6px,rgba(224,86,31,0.14)_12px)]"
                          style={{ top: top + 1, height: height - 3 }}
                        >
                          <span className="text-label text-on-surface-variant">Libre</span>
                        </div>
                      );
                    })
                  : null}

                {dayClasses.map((entry) => {
                  const tone = LEVEL_STYLE[entry.level];
                  const start = minutesOf(entry.start);
                  const top = ((start - HOUR_START * 60) / 60) * HOUR_PX;
                  const height = (entry.durationMin / 60) * HOUR_PX;
                  return (
                    <div
                      key={entry.id}
                      className="absolute inset-x-1 z-[5] overflow-hidden rounded-md border-l-4 px-2 py-1.5 shadow-card"
                      style={{
                        top: top + 1,
                        height: height - 3,
                        borderLeftColor: `var(--color-level-${entry.level === "Principiante" ? "beginner" : entry.level === "Intermedio" ? "intermediate" : "advanced"})`,
                        backgroundColor: `var(--color-level-${entry.level === "Principiante" ? "beginner" : entry.level === "Intermedio" ? "intermediate" : "advanced"}-container)`,
                      }}
                    >
                      <p className="text-label tabular-figures text-on-surface-variant">
                        {entry.start}
                      </p>
                      <p
                        className={cn("truncate text-body-sm font-medium", tone.text)}
                      >
                        {entry.title}
                      </p>
                      <p className="truncate text-label text-on-surface-variant">
                        {roomName(entry.roomId)}
                      </p>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </section>

      <Card className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Icon name="swap_horiz" className="mt-0.5 text-[1.5rem] text-primary" />
          <div>
            <h3 className="font-display text-headline-sm text-on-surface">Puedo sustituir</h3>
            <p className="text-body-sm text-on-surface-variant">
              Acepto clases de otros profesores en mis horas libres.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Switch label="Disponible para sustituir" defaultChecked className="min-w-64" />
          <Button variant="secondary">Marcar semana como completa</Button>
        </div>
      </Card>
    </div>
  );
}
