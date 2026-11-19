/**
 * Pure form logic for cuota actions (spec S6) — no `next/*` imports, unit
 * tested; the `"use server"` wrappers live in
 * `src/app/(app)/facturacion/cuotas/actions.ts`.
 *
 * Amounts are entered as euros and stored as NET cents; billing days are
 * restricted to 1..28 in the UI (the repository also clamps, belt and braces).
 * `today` flows into `createSubscription` so first due dates never backfill.
 */
import type { Database } from "better-sqlite3";
import { parseEuros } from "../euros-input";
import { getStudent } from "../db/students";
import { createSubscription, listSubscriptions, updateSubscription } from "../db/subscriptions";

export type CuotaFormResult = { ok: true; id: number } | { ok: false; error: string };

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

interface CuotaFormFields {
  studentId: number;
  concept: string;
  netEuros: string;
  billingDay: number;
  startDate: string;
}

/** Shared field validation; `null` means "keep going". */
function validate(form: CuotaFormFields, db: Database): { error: string } | null {
  if (!Number.isFinite(form.studentId) || !getStudent(db, form.studentId)) {
    return { error: "Selecciona un alumno" };
  }
  if (parseEuros(form.netEuros) === null) {
    return { error: "El importe debe ser mayor que 0" };
  }
  if (!Number.isInteger(form.billingDay) || form.billingDay < 1 || form.billingDay > 28) {
    return { error: "El día de cobro debe estar entre 1 y 28" };
  }
  if (!ISO_DATE.test(form.startDate)) {
    return { error: "El formato de la fecha no es válido" };
  }
  if (form.concept.trim() === "") {
    return { error: "El concepto es obligatorio" };
  }
  return null;
}

/** Validate the new-cuota form and, when valid, create the cuota. */
export function parseCuotaForm(db: Database, form: CuotaFormFields, today: string): CuotaFormResult {
  const invalid = validate(form, db);
  if (invalid) return { ok: false, error: invalid.error };

  const cuota = createSubscription(
    db,
    {
      studentId: form.studentId,
      concept: form.concept.trim(),
      amountCents: parseEuros(form.netEuros) as number,
      billingDay: form.billingDay,
      startDate: form.startDate,
    },
    today,
  );
  return { ok: true, id: cuota.id };
}

/**
 * Update the MUTABLE fields of a cuota — concept, amount, billing day — and
 * nothing else: neither the student nor the start date can change, and the
 * edit affects future invoices only (spec S6: issued invoices never rewritten).
 */
export function updateCuotaForm(db: Database, id: number, form: CuotaFormFields): CuotaFormResult {
  const existing = listSubscriptions(db).find((cuota) => cuota.id === id);
  if (!existing) return { ok: false, error: "La cuota ya no existe" };

  const amountCents = parseEuros(form.netEuros);
  if (amountCents === null) return { ok: false, error: "El importe debe ser mayor que 0" };
  if (!Number.isInteger(form.billingDay) || form.billingDay < 1 || form.billingDay > 28) {
    return { ok: false, error: "El día de cobro debe estar entre 1 y 28" };
  }
  if (form.concept.trim() === "") {
    return { ok: false, error: "El concepto es obligatorio" };
  }

  const updated = updateSubscription(db, id, {
    concept: form.concept.trim(),
    amountCents,
    billingDay: form.billingDay,
  });
  return { ok: true, id: updated.id };
}
