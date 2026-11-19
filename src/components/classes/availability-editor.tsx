"use client";

import { useState } from "react";
import { Avatar, Button, Card, CardHeader, Icon, Select } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  AVAILABILITY,
  BLACKOUT_DATES,
  classesForTeacher,
  formatHours,
  HOUR_PX,
  hoursOf,
  minutesOf,
  TEACHERS,
  WEEK,
} from "@/lib/schedule";

/**
 * Design 2, screen 06 — Editor de disponibilidad.
 * Spec: scripts/design-plan.mjs, designs/02-calendario-y-clases/06-editor-disponibilidad.png
 *
 * The three totals in the summary rail are computed from AVAILABILITY and the
 * teacher's classes, never hard-coded: for Marcos Delgado they resolve to 32 h
 * available, 6,5 h programmed and 25,5 h free — the figures the export shows.
 *
 * Window dragging is out of scope (the feature's non-goals), so the windows
 * render as the designed blocks with a visual resize affordance only.
 */

const AVAIL_START = 10;
const AVAIL_END = 23;
const AVAIL_HOURS = AVAIL_END - AVAIL_START;

export function AvailabilityEditor() {
  const [teacherId, setTeacherId] = useState("t1");

  const windows = AVAILABILITY[teacherId] ?? [];
  const scheduled = classesForTeacher(teacherId);
  const available = hoursOf(windows);
  const programmed = scheduled.reduce((total, entry) => total + entry.durationMin / 60, 0);
  const free = available - programmed;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-headline-lg text-on-surface">Disponibilidad</h2>
          <p className="mt-1 text-body-md text-on-surface-variant">
            Define cuándo pueden programarse clases.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-3 rounded-md border border-outline-variant bg-surface px-3 py-2 shadow-card">
            <Avatar
              name={TEACHERS.find((entry) => entry.id === teacherId)?.name ?? ""}
              role="teacher"
              size={32}
            />
            <span className="sr-only">Profesor</span>
            <select
              value={teacherId}
              onChange={(event) => setTeacherId(event.target.value)}
              className="bg-transparent pr-6 font-sans text-body-md text-on-surface outline-none"
            >
              {TEACHERS.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.name}
                </option>
              ))}
            </select>
          </label>
          <Select label="" name="room" defaultValue="" className="w-48 self-center">
            <option value="">Todas las salas</option>
          </Select>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* --------------------------------------------------------- grid */}
        <section
          aria-label="Disponibilidad semanal"
          className="overflow-hidden rounded-lg border border-outline-variant bg-surface shadow-card"
        >
          {/* Day header with each day's available hours */}
          <div className="grid grid-cols-[4rem_repeat(7,minmax(0,1fr))] border-b border-outline-variant bg-surface-container">
            <div className="border-r border-outline-variant" />
            {WEEK.map((day) => {
              const dayHours = hoursOf(windows.filter((window) => window.day === day.index));
              return (
                <div
                  key={day.index}
                  className="border-r border-outline-variant px-3 py-2 text-center last:border-r-0"
                >
                  <p className="text-label uppercase text-on-surface-variant">{day.short}</p>
                  <p className="text-body-md tabular-figures text-on-surface">
                    {dayHours > 0 ? formatHours(dayHours) : "—"}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-[4rem_repeat(7,minmax(0,1fr))]">
            {/* Hour gutter */}
            <div
              className="relative border-r border-outline-variant"
              style={{ height: AVAIL_HOURS * HOUR_PX }}
            >
              {Array.from({ length: AVAIL_HOURS + 1 }, (_, i) => AVAIL_START + i).map((hour) => (
                <span
                  key={hour}
                  className={cn(
                    "absolute right-2 text-label tabular-figures text-on-surface-variant",
                    /* First label sits below its line, last one above it, so
                       neither half-overflows the grid and gets clipped by the
                       card's overflow-hidden. */
                    hour === AVAIL_START
                      ? ""
                      : hour === AVAIL_END
                        ? "-translate-y-full"
                        : "-translate-y-1/2",
                  )}
                  style={{ top: (hour - AVAIL_START) * HOUR_PX }}
                >
                  {String(hour).padStart(2, "0")}:00
                </span>
              ))}
            </div>

            {WEEK.map((day) => {
              const dayWindows = windows.filter((window) => window.day === day.index);
              const dayClasses = scheduled.filter((entry) => entry.day === day.index);
              const closed = dayWindows.length === 0;

              return (
                <div
                  key={day.index}
                  className={cn(
                    "relative border-r border-outline-variant last:border-r-0",
                    closed && "bg-surface-container-high/70",
                  )}
                  style={{ height: AVAIL_HOURS * HOUR_PX }}
                >
                  {/* Hour rules */}
                  {Array.from({ length: AVAIL_HOURS + 1 }, (_, i) => i).map((i) => (
                    <span
                      key={i}
                      className="absolute inset-x-0 border-t border-outline-variant"
                      style={{ top: i * HOUR_PX }}
                      aria-hidden="true"
                    />
                  ))}

                  {closed ? (
                    <span className="absolute inset-x-2 top-3 text-center text-label text-on-surface-disabled">
                      No disponible
                    </span>
                  ) : null}

                  {/* Availability windows */}
                  {dayWindows.map((window) => {
                    const top = ((minutesOf(window.start) - AVAIL_START * 60) / 60) * HOUR_PX;
                    const height = ((minutesOf(window.end) - minutesOf(window.start)) / 60) * HOUR_PX;
                    return (
                      <div
                        key={`${window.start}-${window.end}`}
                        className="absolute inset-x-1 rounded-md border-2 border-dashed border-primary bg-primary-container/70"
                        style={{ top: top + 1, height: height - 3 }}
                        title={`${window.start} – ${window.end} disponible`}
                      >
                        {/* Designed resize affordance */}
                        <span
                          className="absolute right-1.5 bottom-1.5 h-3 w-3 rounded-sm border-r-2 border-b-2 border-primary"
                          aria-hidden="true"
                        />
                      </div>
                    );
                  })}

                  {/* Classes that already occupy the window */}
                  {dayClasses.map((entry) => {
                    const start = minutesOf(entry.start);
                    const top = ((start - AVAIL_START * 60) / 60) * HOUR_PX;
                    const height = (entry.durationMin / 60) * HOUR_PX;
                    return (
                      <div
                        key={entry.id}
                        className="absolute inset-x-1 z-[5] overflow-hidden rounded-sm border border-outline-variant bg-surface px-1.5 py-1 shadow-card"
                        style={{ top: top + 1, height: Math.max(height - 3, 20) }}
                        title={`${entry.start} ${entry.title}`}
                      >
                        <p className="truncate text-label tabular-figures text-on-surface-variant">
                          {entry.start}
                        </p>
                        <p className="truncate text-label text-on-surface">{entry.title}</p>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </section>

        {/* ----------------------------------------------------- side rail */}
        <aside className="flex flex-col gap-6">
          <Card>
            <CardHeader title="Resumen" />
            <dl className="flex flex-col divide-y divide-outline-variant">
              <Total label="Disponibles por semana" value={formatHours(available)} emphasis />
              <Total label="Ya programadas" value={formatHours(programmed)} />
              <Total label="Libres" value={formatHours(free)} highlight />
            </dl>
          </Card>

          <Card>
            <CardHeader title="Excepciones" />
            <ul className="flex flex-col divide-y divide-outline-variant">
              {BLACKOUT_DATES.map((entry) => (
                <li
                  key={entry.date}
                  className="flex items-center justify-between gap-3 py-3 text-body-md text-on-surface"
                >
                  <span className="tabular-figures">
                    {entry.date} - {entry.reason}
                  </span>
                  <button
                    type="button"
                    aria-label={`Eliminar excepción ${entry.date}`}
                    className="flex h-8 w-8 items-center justify-center rounded-sm text-on-surface-variant transition-colors hover:bg-error-container hover:text-error"
                  >
                    <Icon name="delete" className="text-[1.125rem]" />
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          <div className="flex flex-col gap-3">
            <Button variant="secondary" icon="content_copy" fullWidth>
              Copiar esta semana a todas
            </Button>
            <Button fullWidth>Guardar disponibilidad</Button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Total({
  label,
  value,
  emphasis = false,
  highlight = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <dt className="text-body-md text-on-surface-variant">{label}</dt>
      <dd
        className={cn(
          "tabular-figures",
          emphasis
            ? "font-display text-headline-md text-on-surface"
            : highlight
              ? "font-display text-headline-md text-primary"
              : "text-body-md text-on-surface",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
