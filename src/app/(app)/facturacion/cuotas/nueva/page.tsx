import { connection } from "next/server";
import { todayIso } from "@/lib/dates";
import { getDb } from "@/lib/db";
import { listStudents } from "@/lib/db/students";
import { NewCuotaForm } from "./new-cuota-form";

/** `/facturacion/cuotas/nueva` — create a recurring monthly fee (spec S6). */
export default async function NuevaCuotaPage() {
  await connection();

  return <NewCuotaForm students={listStudents(getDb())} startDate={todayIso()} />;
}
