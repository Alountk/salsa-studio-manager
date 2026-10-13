import { cn } from "@/lib/cn";
import {
  classesForDate,
  LEVEL_STYLE,
  monthGrid,
  roomName,
  TODAY,
  WEEK,
  type ScheduledClass,
} from "@/lib/schedule";

/**
 * Design 1… no — Design 2, screen 01 — Calendario · mes.
 * Spec: scripts/design-plan.mjs, designs/02-calendario-y-clases/01-calendario-mes.png
 *
 * Seven-column grid, day cells with the date number and up to three chips plus
 * a "+N más" overflow, today marked with a filled circle. The right-hand rail
 * (waitlists and unassigned classes) belongs to this screen too and is rendered
 * by the parent, which owns the layout.
 */
export function MonthView({
  match,
  onSelect,
}: {
  match: (entry: ScheduledClass) => boolean;
  onSelect?: (id: string) => void;
}) {
  const weeks = monthGrid();

  return (
    <section
      aria-label="Vista de mes"
      className="overflow-hidden rounded-lg border border-outline-variant bg-surface shadow-card"
    >
      <div className="grid grid-cols-7 border-b border-outline-variant bg-surface-container">
        {WEEK.map((day) => (
          <div
            key={day.index}
            className="px-3 py-2.5 text-center text-label uppercase text-on-surface-variant"
          >
            {day.short}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {weeks.flat().map((cell, position) => {
          const entries = cell.inMonth
            ? classesForDate(cell.date).filter(match)
            : [];
          const isToday = cell.inMonth && cell.date === TODAY;
          const shown = entries.slice(0, 3);
          const overflow = entries.length - shown.length;

          return (
            <div
              key={`${cell.date}-${position}`}
              className={cn(
                "min-h-[7.5rem] border-r border-b border-outline-variant p-2",
                !cell.inMonth && "bg-surface-container-low/70",
              )}
            >
              <span
                className={cn(
                  "inline-flex h-6 w-6 items-center justify-center rounded-full text-body-sm tabular-figures",
                  isToday
                    ? "bg-primary font-medium text-on-primary"
                    : cell.inMonth
                      ? "text-on-surface"
                      : "text-on-surface-disabled",
                )}
              >
                {cell.date}
              </span>

              <ul className="mt-1.5 flex flex-col gap-1">
                {shown.map((entry) => (
                  <MonthChip key={entry.id} entry={entry} onSelect={onSelect} />
                ))}
                {overflow > 0 ? (
                  <li className="px-1 text-label text-primary tabular-figures">
                    +{overflow} más
                  </li>
                ) : null}
                {entries.length === 0 && cell.inMonth ? (
                  <li className="px-1 text-label text-on-surface-disabled">—</li>
                ) : null}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function MonthChip({
  entry,
  onSelect,
}: {
  entry: ScheduledClass;
  onSelect?: (id: string) => void;
}) {
  const tone = LEVEL_STYLE[entry.level];
  const full = entry.booked >= entry.capacity;

  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect?.(entry.id)}
        title={`${entry.start} ${entry.title} · ${roomName(entry.roomId)}`}
        className={cn(
          "block w-full overflow-hidden rounded-md border-l-4 py-1 pr-1.5 pl-2 text-left",
          "transition-shadow hover:shadow-card focus-visible:outline-2 focus-visible:outline-primary",
          tone.edge,
          tone.fill,
        )}
      >
        <span className="flex items-baseline justify-between gap-1">
          <span className="shrink-0 text-label tabular-figures text-on-surface-variant">
            {entry.start}
          </span>
          <span
            className={cn(
              "shrink-0 text-label tabular-figures",
              full ? "text-on-surface" : "text-on-surface-variant",
            )}
            title={`${entry.booked} de ${entry.capacity} plazas`}
          >
            {entry.booked}/{entry.capacity}
          </span>
        </span>
        <span className={cn("block truncate text-label", tone.text)}>{entry.title}</span>
      </button>
    </li>
  );
}
