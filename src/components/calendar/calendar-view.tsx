"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardHeader, Select } from "@/components/ui";
import { cn } from "@/lib/cn";
import { MonthView } from "./month-view";
import { WeekView } from "./week-view";
import { ClassDetailDrawer } from "./class-detail-drawer";
import { ROOMS, TEACHERS, unassignedClasses, WEEK, type ScheduledClass } from "@/lib/schedule";

/**
 * The calendar page: toolbar, filter bar, the active view and its right rail.
 *
 * The view segment and the class drawer both live in the URL (?vista= and
 * ?clase=) so a screen can be linked and reloaded as-is; only the filter bar is
 * local state, because filters are a transient control and not part of the
 * page's identity.
 */
export function CalendarView({
  vista,
  clase,
}: {
  vista: "mes" | "semana";
  clase?: string;
}) {
  const router = useRouter();
  const [room, setRoom] = useState("");
  const [teacher, setTeacher] = useState("");
  const [level, setLevel] = useState("");
  const [query, setQuery] = useState("");

  function navigate(next: { vista?: "mes" | "semana"; clase?: string | null }) {
    const params = new URLSearchParams();
    const nextVista = next.vista ?? vista;
    // null clears the drawer, undefined keeps whatever is in the URL.
    const nextClase = next.clase === null ? undefined : (next.clase ?? clase);
    if (nextVista !== "mes") params.set("vista", nextVista);
    if (nextClase) params.set("clase", nextClase);
    const search = params.toString();
    router.replace(search ? `/calendario?${search}` : "/calendario", { scroll: false });
  }

  const match = useMemo(() => {
    return (entry: ScheduledClass) => {
      if (room && entry.roomId !== room) return false;
      if (teacher && entry.teacherId !== teacher) return false;
      if (level && entry.level !== level) return false;
      if (query) {
        const needle = query.trim().toLowerCase();
        const haystack = `${entry.title} ${entry.style}`.toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      return true;
    };
  }, [room, teacher, level, query]);

  const filteredOut = !room && !teacher && !level && !query;
  const periodLabel = vista === "mes" ? "Octubre 2026" : "12 - 18 de octubre de 2026";

  return (
    <div className="flex flex-col gap-6">
      {/* Page header: period navigation and the primary action */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            size="compact"
            variant="secondary"
            icon="chevron_left"
            aria-label="Periodo anterior"
            disabled
          >
            Anterior
          </Button>
          <h2 className="font-display text-headline-md tabular-figures text-on-surface">
            {periodLabel}
          </h2>
          <Button
            size="compact"
            variant="secondary"
            icon="chevron_right"
            aria-label="Periodo siguiente"
            disabled
          >
            Siguiente
          </Button>
        </div>
        <Button icon="add" onClick={() => router.push("/clases/nueva")}>
          Crear clase
        </Button>
      </header>

      {/* Filter bar */}
      <div className="flex flex-wrap items-end gap-4 rounded-lg border border-outline-variant bg-surface p-4 shadow-card">
        <div
          role="group"
          aria-label="Vista del calendario"
          className="flex rounded-md border border-outline-variant p-1"
        >
          {(["mes", "semana"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={vista === option}
              onClick={() => navigate({ vista: option })}
              className={cn(
                "rounded-sm px-4 py-1.5 text-body-sm font-medium capitalize transition-colors",
                vista === option
                  ? "bg-primary text-on-primary"
                  : "text-on-surface-variant hover:bg-surface-container-low",
              )}
            >
              {option}
            </button>
          ))}
        </div>

        <Select
          label="Sala"
          value={room}
          onChange={(event) => setRoom(event.target.value)}
          className="w-40"
        >
          <option value="">Todas</option>
          {ROOMS.map((entry) => (
            <option key={entry.id} value={entry.id}>
              {entry.name}
            </option>
          ))}
        </Select>

        <Select
          label="Profesor"
          value={teacher}
          onChange={(event) => setTeacher(event.target.value)}
          className="w-48"
        >
          <option value="">Todos</option>
          {TEACHERS.map((entry) => (
            <option key={entry.id} value={entry.id}>
              {entry.name}
            </option>
          ))}
        </Select>

        <Select
          label="Nivel"
          value={level}
          onChange={(event) => setLevel(event.target.value)}
          className="w-44"
        >
          <option value="">Todos</option>
          <option value="Principiante">Principiante</option>
          <option value="Intermedio">Intermedio</option>
          <option value="Avanzado">Avanzado</option>
        </Select>

        <label className="flex-1 min-w-52">
          <span className="mb-1.5 block text-label uppercase text-on-surface-variant">
            Buscar clase
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Salsa, bachata…"
            className="h-11 w-full rounded-sm border border-outline-variant bg-surface px-4 py-3 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant outline-none transition-shadow focus:border-primary focus:shadow-[var(--focus-ring-input)]"
          />
        </label>

        {!filteredOut ? (
          <Button
            variant="ghost"
            size="compact"
            icon="filter_alt_off"
            onClick={() => {
              setRoom("");
              setTeacher("");
              setLevel("");
              setQuery("");
            }}
          >
            Limpiar
          </Button>
        ) : null}
      </div>

      {vista === "mes" ? (
        <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
          <MonthView match={match} onSelect={(id) => navigate({ clase: id })} />
          <WaitlistAndUnassigned />
        </div>
      ) : (
        <WeekView match={match} onSelect={(id) => navigate({ clase: id })} />
      )}

      {clase ? (
        <ClassDetailDrawer classId={clase} onClose={() => navigate({ clase: null })} />
      ) : null}
    </div>
  );
}

/** The right-hand rail of screen 01: the two queues a human must decide. */
function WaitlistAndUnassigned(): ReactNode {
  const waitlist = [
    { student: "Ana Prieto", className: "Salsa Intermedio", since: "hace 2 días" },
    { student: "Hugo Cabrera", className: "Salsa Cubana", since: "hace 1 día" },
    { student: "Rocío Navarro", className: "Bachata Iniciación", since: "hace 4 h" },
  ];
  const unassigned = unassignedClasses();

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader title="Listas de espera" />
        <ul className="flex flex-col divide-y divide-outline-variant">
          {waitlist.map((entry) => (
            <li key={entry.student} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="text-body-md text-on-surface">{entry.student}</p>
                <p className="truncate text-body-sm text-on-surface-variant">
                  {entry.className}
                </p>
              </div>
              <span className="shrink-0 text-label text-on-surface-variant">{entry.since}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardHeader title="Sin asignar" />
        {unassigned.length === 0 ? (
          <p className="text-body-md text-on-surface-variant">
            Todas las clases tienen profesor.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-outline-variant">
            {unassigned.map((entry) => (
              <li key={entry.id} className="flex items-start justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="text-body-md text-on-surface">{entry.title}</p>
                  <p className="text-body-sm tabular-figures text-on-surface-variant">
                    {WEEK[entry.day].long} {WEEK[entry.day].date}/10 · {entry.start}
                  </p>
                </div>
                <a
                  href="/clases/nueva"
                  className="shrink-0 text-body-sm text-primary hover:underline"
                >
                  Asignar
                </a>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
