"use client";

import { useMemo, useState } from "react";
import { Button, FieldShell, Icon, Input, Select } from "@/components/ui";
import { cn } from "@/lib/cn";
import { durationLabel, formatMinutes, minutesOf, ROOMS, TEACHERS, HOUR_START, HOUR_END, WEEK } from "@/lib/schedule";

/**
 * Design 2, screen 05 — Crear clase por horas.
 * Spec: scripts/design-plan.mjs, designs/02-calendario-y-clases/05-crear-clase.png
 * Acceptance criterion 4 of this feature: the duration stepper drives a preview
 * whose block tracks the chosen duration.
 *
 * The conflict notice renders the designed clean state. Detecting real clashes
 * is listed under this feature's non-goals, so the message is a designed state
 * rather than a live check; that boundary is recorded in the feature document.
 */

const DURATIONS = [
  { minutes: 60, label: "1 h" },
  { minutes: 90, label: "1,5 h" },
  { minutes: 120, label: "2 h" },
];

const MAX_MINUTES = 120;
const START_TIMES = Array.from({ length: (HOUR_END - HOUR_START) * 2 }, (_, i) => {
  const minutes = HOUR_START * 60 + i * 30;
  return formatMinutes(minutes);
});

/* Mini column: the preview mirrors the week grid's geometry at a reduced scale.
   20px per hour keeps a one-hour block (20px) distinguishable from a two-hour one
   (40px); at 9px every duration clamped to the same minimum height, so the
   preview stopped tracking the stepper at all. */
const PREVIEW_HOURS = HOUR_END - HOUR_START;
const PREVIEW_PX_PER_HOUR = 20;

export function CreateClassForm() {
  const [start, setStart] = useState("19:30");
  const [duration, setDuration] = useState(90);
  const [custom, setCustom] = useState(false);
  const [day, setDay] = useState(1);
  const [room, setRoom] = useState("s1");
  const [teacher, setTeacher] = useState("t1");

  const endMinutes = minutesOf(start) + duration;
  const end = formatMinutes(endMinutes);

  /* The preview bar is proportional to duration out of the longest option. */
  const barWidth = `${(duration / MAX_MINUTES) * 100}%`;

  const blockTop = ((minutesOf(start) - HOUR_START * 60) / 60) * PREVIEW_PX_PER_HOUR;
  const blockHeight = (duration / 60) * PREVIEW_PX_PER_HOUR;
  const dayInfo = WEEK[day];

  const summary = useMemo(
    () => [
      { label: "Duración", value: durationLabel(duration) },
      { label: "Horario", value: `${start} - ${end}` },
      { label: "Plazas", value: "16" },
      { label: "Precio", value: "15,00 €" },
    ],
    [duration, start, end],
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,720px)_380px]">
      {/* ------------------------------------------------------------- form */}
      <form id="create-class" className="flex flex-col gap-7 rounded-lg border border-outline-variant bg-surface p-6 shadow-card">
        <Section title="Qué clase">
          <Input label="Título de la clase" name="title" defaultValue="Salsa Intermedio" />
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Select label="Estilo" name="style" defaultValue="linea">
              <option value="linea">Salsa en línea</option>
              <option value="cubana">Salsa cubana</option>
              <option value="bachata">Bachata</option>
            </Select>
            <Select label="Nivel" name="level" defaultValue="Intermedio">
              <option>Principiante</option>
              <option>Intermedio</option>
              <option>Avanzado</option>
            </Select>
          </div>
          <label className="mt-5 block">
            <span className="mb-1.5 block text-label uppercase text-on-surface-variant">
              Descripción
            </span>
            <textarea
              name="description"
              rows={3}
              defaultValue="Giros en línea, timing y combinaciones de dos tiempos."
              className="w-full rounded-sm border border-outline-variant bg-surface px-4 py-3 font-sans text-body-md text-on-surface outline-none transition-shadow focus:border-primary focus:shadow-[var(--focus-ring-input)]"
            />
          </label>
        </Section>

        <Section title="Cuándo">
          <div className="grid gap-5 sm:grid-cols-2">
            <Select
              label="Fecha"
              name="date"
              value={String(day)}
              onChange={(event) => setDay(Number(event.target.value))}
            >
              {WEEK.map((entry) => (
                <option key={entry.index} value={entry.index}>
                  {entry.long} {entry.date}/10/2026
                </option>
              ))}
            </Select>
            <Select
              label="Hora de inicio"
              name="start"
              value={start}
              onChange={(event) => setStart(event.target.value)}
            >
              {START_TIMES.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </Select>
          </div>

          {/* The duration stepper — the component this screen is named for */}
          <div className="mt-5">
            <FieldShell label="Duración">
              <div className="flex flex-wrap items-center gap-2">
                {DURATIONS.map((option) => (
                  <button
                    key={option.minutes}
                    type="button"
                    aria-pressed={!custom && duration === option.minutes}
                    onClick={() => {
                      setCustom(false);
                      setDuration(option.minutes);
                    }}
                    className={cn(
                      "min-w-20 rounded-sm border px-4 py-2.5 font-sans text-body-md tabular-figures transition-colors",
                      !custom && duration === option.minutes
                        ? "border-primary bg-primary text-on-primary"
                        : "border-outline-variant bg-surface text-on-surface hover:bg-surface-container-low",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
                <button
                  type="button"
                  aria-pressed={custom}
                  onClick={() => setCustom(true)}
                  className={cn(
                    "rounded-sm border px-4 py-2.5 font-sans text-body-md transition-colors",
                    custom
                      ? "border-primary bg-primary text-on-primary"
                      : "border-outline-variant bg-surface text-on-surface hover:bg-surface-container-low",
                  )}
                >
                  Personalizado
                </button>

                {custom ? (
                  <label className="flex items-center gap-2">
                    <span className="sr-only">Minutos personalizados</span>
                    <input
                      type="number"
                      min={30}
                      max={240}
                      step={15}
                      value={duration}
                      onChange={(event) =>
                        setDuration(Math.min(Math.max(Number(event.target.value) || 30, 30), 240))
                      }
                      className="h-11 w-24 rounded-sm border border-outline-variant bg-surface px-3 font-sans text-body-md tabular-figures text-on-surface outline-none focus:border-primary focus:shadow-[var(--focus-ring-input)]"
                    />
                    <span className="text-body-sm text-on-surface-variant">min</span>
                  </label>
                ) : null}
              </div>
            </FieldShell>

            {/* Proportional preview bar with the block's extremes labelled */}
            <div className="mt-4">
              <div className="relative h-9 w-full overflow-hidden rounded-md bg-surface-container-low">
                <div
                  className="flex h-full items-center justify-between rounded-md bg-primary-container px-3 transition-[width] duration-300"
                  style={{ width: barWidth }}
                >
                  <span className="text-label tabular-figures text-on-primary-container">
                    {start}
                  </span>
                  <span className="text-label tabular-figures text-on-primary-container">
                    {end}
                  </span>
                </div>
              </div>
              <p className="mt-1.5 text-body-sm text-on-surface-variant tabular-figures">
                Bloque de {durationLabel(duration)} · {dayInfo.long} {dayInfo.date}/10
              </p>
            </div>
          </div>
        </Section>

        <Section title="Dónde y quién">
          <div className="grid gap-5 sm:grid-cols-2">
            <Select
              label="Sala"
              name="room"
              value={room}
              onChange={(event) => setRoom(event.target.value)}
            >
              {ROOMS.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.name}
                </option>
              ))}
            </Select>
            <Select
              label="Profesor"
              name="teacher"
              value={teacher}
              onChange={(event) => setTeacher(event.target.value)}
            >
              {TEACHERS.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.name}
                </option>
              ))}
            </Select>
          </div>
        </Section>

        <Section title="Aforo y precio">
          <div className="grid gap-5 sm:grid-cols-3">
            <Input label="Plazas" name="capacity" type="number" defaultValue={16} />
            <Input label="Precio por clase" name="price" defaultValue="15,00 €" />
            <Input label="Créditos de bono" name="credits" type="number" defaultValue={1} />
          </div>
        </Section>

        <Section title="Repetición">
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex cursor-pointer items-center gap-2 text-body-md text-on-surface">
              <input
                type="radio"
                name="recurrence"
                defaultChecked
                className="h-4 w-4 accent-primary"
              />
              No se repite
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-body-md text-on-surface">
              <input type="radio" name="recurrence" className="h-4 w-4 accent-primary" />
              Semanal
            </label>
            <span className="flex gap-1.5" aria-hidden="true">
              {WEEK.slice(0, 6).map((entry) => (
                <span
                  key={entry.index}
                  className="flex h-8 w-8 items-center justify-center rounded-sm border border-outline-variant bg-surface text-body-sm text-on-surface-variant"
                >
                  {entry.short}
                </span>
              ))}
            </span>
          </div>
        </Section>
      </form>

      {/* ----------------------------------------------------------- preview */}
      <aside className="flex flex-col gap-6">
        <div className="rounded-lg border border-outline-variant bg-surface p-5 shadow-card">
          <h3 className="text-label uppercase text-on-surface-variant">
            Vista previa en el calendario
          </h3>

          <div className="mt-4 flex gap-3">
            {/* Mini hour column */}
            <div className="relative w-10" style={{ height: PREVIEW_HOURS * PREVIEW_PX_PER_HOUR }}>
              {Array.from({ length: PREVIEW_HOURS + 1 }, (_, i) => HOUR_START + i).map((hour) => (
                <span
                  key={hour}
                  className="absolute right-0 -translate-y-1/2 text-label tabular-figures text-on-surface-variant"
                  style={{ top: (hour - HOUR_START) * PREVIEW_PX_PER_HOUR }}
                >
                  {String(hour).padStart(2, "0")}
                </span>
              ))}
            </div>

            {/* Mini day column with the live block */}
            <div
              className="relative flex-1 overflow-hidden rounded-md border border-outline-variant bg-surface-container-low"
              style={{ height: PREVIEW_HOURS * PREVIEW_PX_PER_HOUR }}
            >
              {Array.from({ length: PREVIEW_HOURS + 1 }, (_, i) => (
                <span
                  key={i}
                  className="absolute inset-x-0 border-t border-outline-variant"
                  style={{ top: i * PREVIEW_PX_PER_HOUR }}
                  aria-hidden="true"
                />
              ))}
              <div
                className="absolute inset-x-1 overflow-hidden rounded-sm border-l-4 border-l-level-intermediate bg-level-intermediate-container px-1.5 py-0.5 transition-all duration-300"
                style={{ top: blockTop + 1, height: Math.max(blockHeight - 2, 16) }}
              >
                <p className="truncate text-label tabular-figures text-on-level-intermediate">
                  {start} - {end}
                </p>
                {blockHeight >= 30 ? (
                  <p className="truncate text-label text-on-level-intermediate">Salsa Intermedio</p>
                ) : null}
                {blockHeight >= 40 ? (
                  <p className="truncate text-label text-on-surface-variant">
                    {ROOMS.find((entry) => entry.id === room)?.name} ·{" "}
                    {TEACHERS.find((entry) => entry.id === teacher)?.name}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Designed clean state — see the note at the top of this file */}
        <div className="flex items-center gap-3 rounded-lg border border-secondary/40 bg-secondary-container p-4">
          <Icon name="task_alt" className="text-[1.5rem] text-on-secondary-container" />
          <p className="text-label uppercase text-on-secondary-container">
            Sin conflictos detectados
          </p>
        </div>

        <div className="rounded-lg border border-outline-variant bg-surface p-5 shadow-card">
          <h3 className="text-label uppercase text-on-surface-variant">Resumen de la clase</h3>
          <dl className="mt-3 flex flex-col divide-y divide-outline-variant">
            {summary.map((row) => (
              <div key={row.label} className="flex items-center justify-between py-2.5">
                <dt className="text-body-sm text-on-surface-variant">{row.label}</dt>
                <dd className="text-body-md tabular-figures text-on-surface">{row.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4">
            <Button variant="secondary" icon="bookmark_add" fullWidth type="button">
              Guardar como plantilla
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-outline-variant pb-6 last:border-b-0 last:pb-0">
      <h3 className="mb-4 font-display text-headline-sm text-on-surface">{title}</h3>
      {children}
    </section>
  );
}
