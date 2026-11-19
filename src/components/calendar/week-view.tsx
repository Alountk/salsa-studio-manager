import { cn } from "@/lib/cn";
import {
  classesForDay,
  HOUR_END,
  HOUR_PX,
  HOUR_START,
  LEVEL_STYLE,
  minutesOf,
  NOW,
  roomName,
  teacherName,
  TODAY,
  WEEK,
  weekdayIndexOf,
  type ScheduledClass,
} from "@/lib/schedule";

/**
 * Design 2, screen 02 — Calendario · semana.
 * Spec: scripts/design-plan.mjs, designs/02-calendario-y-clases/02-calendario-semana.png
 * Acceptance criterion 2 of this feature: a real time grid — 07:00–23:00, 56px
 * per hour, seven day columns, blocks positioned by start time and sized by
 * duration.
 */
export function WeekView({
  match,
  onSelect,
}: {
  match: (entry: ScheduledClass) => boolean;
  onSelect?: (id: string) => void;
}) {
  const hours = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => HOUR_START + i);
  const totalHeight = (HOUR_END - HOUR_START) * HOUR_PX;
  const todayIndex = weekdayIndexOf(TODAY);

  return (
    <section aria-label="Vista de semana" className="flex flex-col gap-5">
      <div className="rounded-lg border border-outline-variant bg-surface shadow-card">
        {/*
          Sticky day header. The card must NOT carry overflow-hidden: that would
          make the card the sticky scrollport, so with top-16 the header pins
          64px into the card while the page is still at scroll 0 and slides over
          the first hour row (measured: header 357..414 over grid 350..).
          Corners are rounded by the header and the grid wrapper instead.
        */}
        <div className="sticky top-16 z-10 grid grid-cols-[4rem_repeat(7,minmax(0,1fr))] rounded-t-lg border-b border-outline-variant bg-surface-container">
          <div className="border-r border-outline-variant" />
          {WEEK.map((day) => {
            const isToday = day.index === todayIndex;
            return (
              <div
                key={day.index}
                className={cn(
                  "border-r border-outline-variant px-3 py-2 text-center",
                  isToday && "bg-primary-container",
                )}
              >
                <p className="text-label uppercase text-on-surface-variant">{day.short}</p>
                <p
                  className={cn(
                    "text-body-md tabular-figures",
                    isToday ? "font-medium text-primary" : "text-on-surface",
                  )}
                >
                  {day.date}
                </p>
              </div>
            );
          })}
        </div>

        <div className="overflow-hidden rounded-b-lg">
        <div className="grid grid-cols-[4rem_repeat(7,minmax(0,1fr))]">
          {/* Hour gutter */}
          <div className="relative border-r border-outline-variant" style={{ height: totalHeight }}>
            {hours.map((hour) => (
              <span
                key={hour}
                /* Centring the first label would push half of it above the grid
                   and behind the day header, hiding 07:00; only the later
                   labels sit centred on their hour line. */
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

          {WEEK.map((day) => (
            <div
              key={day.index}
              className="relative border-r border-outline-variant last:border-r-0"
              style={{ height: totalHeight }}
            >
              {hours.map((hour) => (
                <span
                  key={hour}
                  className="absolute inset-x-0 border-t border-outline-variant"
                  style={{ top: (hour - HOUR_START) * HOUR_PX }}
                  aria-hidden="true"
                />
              ))}

              {classesForDay(day.index)
                .filter(match)
                .map((entry) => (
                  <WeekBlock key={entry.id} entry={entry} onSelect={onSelect} />
                ))}

              {day.index === todayIndex ? (
                <span
                  className="absolute inset-x-0 z-10 border-t-2 border-primary"
                  style={{
                    top:
                      ((minutesOf(NOW) - HOUR_START * 60) / 60) * HOUR_PX,
                  }}
                  aria-label={`Hora actual, ${NOW}`}
                >
                  <span className="absolute -top-1.5 -left-1 h-3 w-3 rounded-pill bg-primary" />
                </span>
              ) : null}
            </div>
          ))}
          </div>
        </div>
      </div>

      <ul className="flex flex-wrap items-center gap-4">
        {(["Principiante", "Intermedio", "Avanzado"] as const).map((level) => (
          <li key={level} className="flex items-center gap-2 text-body-sm text-on-surface-variant">
            <span
              className={cn("h-3 w-6 rounded-sm", LEVEL_STYLE[level].fill)}
              aria-hidden="true"
            />
            <span className={cn("h-3 w-1 rounded-pill", LEVEL_STYLE[level].bar)} aria-hidden="true" />
            {level}
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * A class block. Height is proportional to duration, so a 2 h class is twice a
 * 1 h one — the geometry is the point of this screen, not decoration.
 */
function WeekBlock({
  entry,
  onSelect,
}: {
  entry: ScheduledClass;
  onSelect?: (id: string) => void;
}) {
  const tone = LEVEL_STYLE[entry.level];
  const start = minutesOf(entry.start);
  const top = ((start - HOUR_START * 60) / 60) * HOUR_PX;
  const height = (entry.durationMin / 60) * HOUR_PX;
  const unassigned = entry.teacherId === null;

  return (
    <button
      type="button"
      onClick={() => onSelect?.(entry.id)}
      className={cn(
        "absolute inset-x-1 z-[5] overflow-hidden rounded-md px-2 py-1.5 text-left shadow-card",
        "transition-shadow hover:shadow-popover focus-visible:outline-2 focus-visible:outline-primary",
        tone.fill,
      )}
      style={{ top: top + 1, height: height - 3 }}
    >
      <span
        className={cn("absolute inset-y-0 left-0 w-1", tone.bar)}
        aria-hidden="true"
      />
      <div className="pl-1.5">
        <span className="flex items-baseline justify-between gap-1">
          <span className="shrink-0 text-label tabular-figures text-on-surface-variant">
            {entry.start} - {endLabel(entry)}
          </span>
          <span
            className={cn("shrink-0 text-label tabular-figures text-on-surface-variant", unassigned && "text-tertiary")}
            title={unassigned ? "Sin profesor asignado" : `${entry.booked} de ${entry.capacity} plazas`}
          >
            {unassigned ? "Sin asignar" : `${entry.booked}/${entry.capacity}`}
          </span>
        </span>
        <p className={cn("truncate text-body-sm font-medium", tone.text)}>{entry.title}</p>
        {/* Third line only when the block is tall enough to hold it; the
            occupancy moved up beside the time so a 1 h block fits in two
            lines instead of having its last line clipped. */}
        {height > 60 ? (
          <p className="mt-0.5 truncate text-label text-on-surface-variant">
            {roomName(entry.roomId)} · {teacherName(entry.teacherId)}
          </p>
        ) : null}
      </div>
    </button>
  );
}

function endLabel(entry: ScheduledClass): string {
  const end = minutesOf(entry.start) + entry.durationMin;
  return `${String(Math.floor(end / 60)).padStart(2, "0")}:${String(end % 60).padStart(2, "0")}`;
}
