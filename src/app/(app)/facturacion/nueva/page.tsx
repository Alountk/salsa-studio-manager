import { connection } from "next/server";
import { addDays, todayIso } from "@/lib/dates";
import { getDb } from "@/lib/db";
import { listStudents } from "@/lib/db/students";
import { NewInvoiceForm } from "./new-invoice-form";

/** `/facturacion/nueva` — manual invoice creation (spec S3). */
export default async function NuevaFacturaPage() {
  await connection();

  return (
    <NewInvoiceForm
      students={listStudents(getDb())}
      defaults={{ issueDate: todayIso(), dueDate: addDays(todayIso(), 14) }}
    />
  );
}
