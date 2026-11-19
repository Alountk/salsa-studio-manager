"use client";

import { useMemo, useState } from "react";
import { Avatar, Button, Icon, StatusPill, TBody, TD, TH, THead, TR, Table, type StatusKind } from "@/components/ui";
import { cn } from "@/lib/cn";
import { ROSTER, type Attendance } from "@/lib/schedule";

/**
 * Design 2, screen 07 — Lista de clase y asistencia.
 * Spec: scripts/design-plan.mjs, designs/02-calendario-y-clases/07-lista-y-asistencia.png
 * Behaviour: docs/flows/02-calendar-and-classes.md, "Teacher flow".
 *
 * Attendance is real local state: the three-way control updates the row and the
 * footer counts recompute from it, so the tally can never disagree with the
 * marks on screen.
 */

const MARKS: Array<{ value: Attendance; label: string; active: string }> = [
  { value: "present", label: "Presente", active: "bg-secondary text-on-secondary" },
  { value: "late", label: "Retraso", active: "bg-tertiary text-on-tertiary" },
  { value: "absent", label: "Ausente", active: "bg-error text-on-error" },
];

const PAYMENT: Record<string, StatusKind> = { paid: "paid", pending: "pending" };

export function RosterTable() {
  const [marks, setMarks] = useState<Record<string, Attendance>>(() =>
    Object.fromEntries(ROSTER.map((entry) => [entry.name, entry.attendance])),
  );
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const tally = { present: 0, late: 0, absent: 0, unmarked: 0 };
    for (const entry of ROSTER) tally[marks[entry.name]] += 1;
    return tally;
  }, [marks]);

  const rows = ROSTER.filter((entry) =>
    query.trim()
      ? `${entry.name} ${entry.email}`.toLowerCase().includes(query.trim().toLowerCase())
      : true,
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Class header */}
      <header className="rounded-lg border border-outline-variant bg-surface p-6 shadow-card">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display text-headline-lg text-on-surface">Salsa Intermedio</h2>
          <StatusPill status="confirmed" label="Intermedio" />
        </div>
        <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-3 text-body-md">
          <Line label="Fecha" value="martes, 13/10/2026" />
          <Line label="Horario" value="19:30 - 21:00" emphasis />
          <Line label="Sala" value="Sala 1" />
          <Line label="Aforo" value="12 de 16 plazas" />
          <Line label="Profesor" value="Marcos Delgado" />
        </dl>
      </header>

      <div className="rounded-lg border border-outline-variant bg-surface p-6 shadow-card">
        {/* Toolbar */}
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <span className="text-body-md tabular-figures text-on-surface-variant">
            {ROSTER.length} alumnos
          </span>
          <label className="relative min-w-56 flex-1">
            <span className="sr-only">Buscar alumno</span>
            <Icon
              name="search"
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[1.125rem] text-on-surface-variant"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar alumno…"
              className="h-9 w-full rounded-sm border border-outline-variant bg-surface pr-3 pl-9 text-body-sm text-on-surface placeholder:text-on-surface-variant outline-none transition-shadow focus:border-primary focus:shadow-[var(--focus-ring-input)]"
            />
          </label>
          <Button size="compact" variant="secondary" icon="person_add">
            Añadir alumno
          </Button>
          <Button size="compact">Cerrar lista</Button>
        </div>

        <Table>
          <THead>
            <TH>Alumno</TH>
            <TH>Tipo</TH>
            <TH>Pago</TH>
            <TH>Asistencia</TH>
            <TH aria-label="Notas" />
          </THead>
          <TBody>
            {rows.map((entry) => {
              const mark = marks[entry.name];
              return (
                <TR key={entry.name} marked={mark === "absent"}>
                  <TD>
                    <span className="flex items-center gap-3">
                      <Avatar name={entry.name} role="student" size={32} />
                      <span className="min-w-0">
                        <span className="block truncate text-body-md">{entry.name}</span>
                        <span className="block truncate text-body-sm text-on-surface-variant">
                          {entry.email}
                        </span>
                      </span>
                    </span>
                  </TD>
                  <TD>
                    <span className="inline-flex rounded-pill bg-surface-container px-2 py-1 text-label uppercase text-on-surface-variant">
                      {entry.kind}
                    </span>
                  </TD>
                  <TD>
                    <StatusPill status={PAYMENT[entry.payment]} />
                  </TD>
                  <TD>
                    <span
                      role="group"
                      aria-label={`Asistencia de ${entry.name}`}
                      className="inline-flex rounded-md border border-outline-variant p-0.5"
                    >
                      {MARKS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          aria-pressed={mark === option.value}
                          onClick={() =>
                            setMarks((current) => ({ ...current, [entry.name]: option.value }))
                          }
                          className={cn(
                            "rounded-sm px-2.5 py-1.5 text-label uppercase transition-colors",
                            mark === option.value
                              ? option.active
                              : "text-on-surface-variant hover:bg-surface-container-low",
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </span>
                  </TD>
                  <TD>
                    <button
                      type="button"
                      aria-label={`Añadir nota a ${entry.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-sm text-on-surface-variant transition-colors hover:bg-surface-container-low"
                    >
                      <Icon name="note_add" className="text-[1.125rem]" />
                    </button>
                  </TD>
                </TR>
              );
            })}
          </TBody>
        </Table>

        {rows.length === 0 ? (
          <p className="py-8 text-center text-body-md text-on-surface-variant">
            Ningún alumno coincide con «{query}».
          </p>
        ) : null}

        {/* Live tally */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-outline-variant pt-5">
          <p className="text-body-md tabular-figures text-on-surface-variant">
            <span className="text-on-surface">Presentes {counts.present}</span> · Retrasos{" "}
            {counts.late} · Ausencias {counts.absent}
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() =>
                setMarks(Object.fromEntries(ROSTER.map((entry) => [entry.name, "present" as const])))
              }
            >
              Marcar todos presentes
            </Button>
            <Button>Guardar asistencia</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Line({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div>
      <dt className="text-label uppercase text-on-surface-variant">{label}</dt>
      <dd
        className={
          emphasis
            ? "font-display text-headline-sm tabular-figures text-on-surface"
            : "tabular-figures text-on-surface"
        }
      >
        {value}
      </dd>
    </div>
  );
}
