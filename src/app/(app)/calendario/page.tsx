import { Suspense } from "react";
import { CalendarView } from "@/components/calendar/calendar-view";

/**
 * Design 2, screens 01 and 02 — Calendario (mes y semana).
 *
 * Both live behind one Suspense boundary: Next 16 refuses to read
 * `searchParams` during prerender otherwise, which is the same correction
 * `app-scaffold` had to make on `/`.
 */
export default function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ vista?: string; clase?: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <CalendarShell searchParams={searchParams} />
    </Suspense>
  );
}

async function CalendarShell({
  searchParams,
}: {
  searchParams: Promise<{ vista?: string; clase?: string }>;
}) {
  const { vista, clase } = await searchParams;
  return (
    <CalendarView
      vista={vista === "semana" ? "semana" : "mes"}
      clase={clase}
    />
  );
}
