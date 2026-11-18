/**
 * Pure form logic for billing actions — validation and creation, free of
 * `next/*` imports so it carries the unit tests (the `"use server"` wrappers
 * live in `src/app/(app)/facturacion/actions.ts`).
 *
 * Money is entered as euros ("45,50" or "45.50") and stored as integer net
 * cents; VAT and gross are derived by `createManualInvoice` (Global
 * Constraints: entered amounts are net).
 */
import type { Database } from "better-sqlite3";
import { parseEuros } from "../euros-input";
import { createManualInvoice, getInvoiceByNumber } from "../db/invoices";
import { getStudent } from "../db/students";

export type InvoiceFormResult = { ok: true; number: string } | { ok: false; error: string };

// Re-exported so callers (and tests) keep one import for form parsing; the
// implementation lives in the dependency-free `../euros-input` for client use.
export { parseEuros } from "../euros-input";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Validate the new-invoice form and, when valid, create the invoice.
 * Returns the allocated `V-YYYY-NNNN` number so the action can redirect.
 */
export function parseInvoiceForm(
  db: Database,
  form: {
    studentId: number;
    concept: string;
    netEuros: string;
    issueDate: string;
    dueDate: string;
  },
): InvoiceFormResult {
  if (!Number.isFinite(form.studentId) || !getStudent(db, form.studentId)) {
    return { ok: false, error: "Selecciona un alumno" };
  }

  const netCents = parseEuros(form.netEuros);
  if (netCents === null) {
    return { ok: false, error: "El importe debe ser mayor que 0" };
  }

  if (!ISO_DATE.test(form.issueDate) || !ISO_DATE.test(form.dueDate)) {
    return { ok: false, error: "El formato de la fecha no es válido" };
  }
  if (form.dueDate < form.issueDate) {
    return {
      ok: false,
      error: "La fecha de vencimiento no puede ser anterior a la de emisión",
    };
  }

  const concept = form.concept.trim();
  if (concept === "") {
    return { ok: false, error: "El concepto es obligatorio" };
  }

  const invoice = createManualInvoice(db, {
    studentId: form.studentId,
    concept,
    netCents,
    issueDate: form.issueDate,
    dueDate: form.dueDate,
  });

  // Re-read so callers get an existing number, never a half-allocated one.
  return getInvoiceByNumber(db, invoice.number)
    ? { ok: true, number: invoice.number }
    : { ok: false, error: "No se pudo crear la factura" };
}
