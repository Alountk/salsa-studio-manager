"use client";

import { useEffect } from "react";
import { cn } from "@/lib/cn";
import { Avatar, Button, Icon, StatusPill } from "@/components/ui";
import {
  durationLabel,
  findClass,
  LEVEL_STYLE,
  minutesOf,
  roomName,
  teacherName,
  WEEK,
} from "@/lib/schedule";

/**
 * Design 2, screen 03 — Detalle de clase y reserva.
 * Spec: scripts/design-plan.mjs, designs/02-calendario-y-clases/03-detalle-clase.png
 * Behaviour: docs/flows/02-calendar-and-classes.md, "Primary flow — student books".
 *
 * A 480px drawer over the dimmed grid, driven by `?clase=<id>` so the view it
 * belongs to stays in the URL and a class detail can be linked directly.
 */
export function ClassDetailDrawer({
  classId,
  onClose,
}: {
  classId: string;
  onClose: () => void;
}) {
  const entry = findClass(classId);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!entry) return null;

  const tone = LEVEL_STYLE[entry.level];
  const free = entry.capacity - entry.booked;
  const day = WEEK[entry.day];
  const start = minutesOf(entry.start);
  const end = start + entry.durationMin;

  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label={entry.title}>
      {/* Dimmed calendar behind, exactly as the design shows */}
      <button
        type="button"
        aria-label="Cerrar detalle"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-inverse-surface/45"
      />

      <aside className="absolute inset-y-0 right-0 flex w-full max-w-[480px] flex-col overflow-y-auto bg-surface shadow-modal">
        <div className="flex items-start justify-between gap-4 border-b border-outline-variant px-6 py-5">
          <div>
            <p className="text-label uppercase text-primary">{entry.style}</p>
            <h2 className="mt-1 font-display text-headline-md text-on-surface">
              {entry.title}
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <StatusPill status="confirmed" label={entry.level} />
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="flex h-9 w-9 items-center justify-center rounded-md text-on-surface-variant transition-colors hover:bg-surface-container-low"
            >
              <Icon name="close" className="text-[1.25rem]" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6 px-6 py-6">
          {/* Teacher */}
          <div className="flex items-center gap-3 rounded-md bg-surface-container-low p-4">
            <Avatar name={teacherName(entry.teacherId)} role="teacher" size={40} />
            <div className="min-w-0 flex-1">
              <p className="text-label uppercase text-on-surface-variant">Profesor</p>
              <p className="truncate text-body-md text-on-surface">
                {teacherName(entry.teacherId)}
              </p>
            </div>
            {entry.teacherId ? (
              <button type="button" className="shrink-0 text-body-sm text-primary hover:underline">
                Ver perfil
              </button>
            ) : (
              <StatusPill status="unassigned" />
            )}
          </div>

          {/* Data list */}
          <dl className="grid grid-cols-2 gap-y-4">
            <Field icon="door_front" label="Sala" value={roomName(entry.roomId)} />
            <Field
              icon="event"
              label="Fecha"
              value={`${day.long}, ${String(day.date).padStart(2, "0")}/10/2026`}
            />
            <Field
              icon="schedule"
              label="Horario"
              value={`${entry.start} - ${pad(Math.floor(end / 60))}:${pad(end % 60)}`}
              emphasis
            />
            <Field icon="timer" label="Duración" value={durationLabel(entry.durationMin)} />
            <Field icon="stairs" label="Nivel" value={entry.level} />
            <Field icon="payments" label="Precio" value={entry.price} />
          </dl>

          <p className="text-body-md text-on-surface-variant">{entry.description}</p>

          {/* Price comparison */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-md border border-outline-variant bg-surface-container-low p-4">
              <p className="text-label uppercase text-on-surface-variant">Clase suelta</p>
              <p className="mt-1 font-display text-headline-md tabular-figures text-on-surface">
                {entry.price}
              </p>
            </div>
            <div className="rounded-md border border-outline-variant bg-surface-container-low p-4">
              <p className="text-label uppercase text-on-surface-variant">Con bono</p>
              <p className="mt-1 font-display text-headline-md tabular-figures text-on-surface">
                {entry.credits} crédito{entry.credits > 1 ? "s" : ""}
              </p>
              <p className="text-body-sm tabular-figures text-on-surface-variant">
                Te quedan 6
              </p>
            </div>
          </div>

          {/* Occupancy */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-body-md tabular-figures text-on-surface">
                {entry.booked} de {entry.capacity} plazas
              </span>
              {free === 0 ? (
                <StatusPill status="waitlist" label="Completa" />
              ) : free <= 4 ? (
                <StatusPill status="few_spots" />
              ) : (
                <span className="text-body-sm tabular-figures text-on-surface-variant">
                  {free} libres
                </span>
              )}
            </div>
            <div
              className="h-2 w-full overflow-hidden rounded-pill bg-surface-container-highest"
              role="progressbar"
              aria-valuenow={entry.booked}
              aria-valuemin={0}
              aria-valuemax={entry.capacity}
            >
              <span
                className={cn(
                  "block h-full rounded-pill transition-[width]",
                  free <= 4 ? "bg-tertiary" : tone.bar,
                )}
                style={{ width: `${(entry.booked / entry.capacity) * 100}%` }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button fullWidth disabled={free === 0}>
              {free === 0 ? "Sin plazas disponibles" : "Reservar clase"}
            </Button>
            <Button variant="secondary" fullWidth>
              {free === 0 ? "Entrar en lista de espera" : "Añadir a mi calendario"}
            </Button>
          </div>

          <p className="flex items-center gap-2 text-body-sm text-on-surface-variant">
            <Icon name="info" className="text-[1rem]" />
            Cancelación gratuita hasta 4 horas antes.
          </p>
        </div>
      </aside>
    </div>
  );
}

function Field({
  icon,
  label,
  value,
  emphasis = false,
}: {
  icon: string;
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon name={icon} className="text-[1.375rem] text-primary" />
      <div className="min-w-0">
        <dt className="text-label uppercase text-on-surface-variant">{label}</dt>
        <dd
          className={
            emphasis
              ? "font-display text-headline-sm tabular-figures text-on-surface"
              : "truncate text-body-md text-on-surface"
          }
        >
          {value}
        </dd>
      </div>
    </div>
  );
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}
