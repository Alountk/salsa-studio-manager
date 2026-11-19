"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Button, Input, LinkButton, Select } from "@/components/ui";
import { euros, grossOf, vatOf } from "@/lib/billing";
import { parseEuros } from "@/lib/euros-input";
import type { Student } from "@/lib/db/students";
import { createInvoiceAction, type InvoiceFormState } from "../actions";

/**
 * New-invoice form (client): live IVA/total hint from the typed base amount,
 * creation through the server action, errors surfaced inline. Entered amounts
 * are net; VAT 21% derives gross (Global Constraints).
 */
export function NewInvoiceForm({
  students,
  defaults,
}: {
  students: Student[];
  defaults: { issueDate: string; dueDate: string };
}) {
  const [state, formAction, pending] = useActionState<InvoiceFormState, FormData>(
    createInvoiceAction,
    { error: null },
  );
  const [netEuros, setNetEuros] = useState("");

  const netCents = parseEuros(netEuros);
  const hint =
    netCents === null
      ? "Se aplicará IVA del 21% sobre la base"
      : `IVA (21%): ${euros(vatOf(netCents))} · Total con IVA: ${euros(grossOf(netCents))}`;

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <div>
        <h2 className="font-display text-display text-on-surface">Nueva factura</h2>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Importe base sin IVA; el total se calcula solo.
        </p>
      </div>

      {state.error ? (
        <p role="alert" className="rounded-sm bg-error-container/40 px-4 py-3 text-body-sm text-error">
          {state.error}
        </p>
      ) : null}

      {students.length === 0 ? (
        <p className="rounded-sm bg-tertiary-container/40 px-4 py-3 text-body-sm text-on-surface">
          Todavía no hay alumnos.{" "}
          <Link href="/alumnos/nuevo" className="font-medium text-primary hover:underline">
            Crea el primero en Alumnos
          </Link>{" "}
          y vuelve aquí.
        </p>
      ) : (
        <Select label="Alumno" name="studentId" defaultValue="">
          <option value="" disabled>
            Selecciona un alumno
          </option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </Select>
      )}

      <Input label="Concepto" name="concept" placeholder="Clase suelta, Cuota mensual…" required />

      <Input
        label="Importe base (sin IVA)"
        name="netEuros"
        inputMode="decimal"
        placeholder="45,50"
        value={netEuros}
        onChange={(event) => setNetEuros(event.target.value)}
        hint={hint}
      />

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <Input label="Fecha de emisión" name="issueDate" type="date" defaultValue={defaults.issueDate} />
        <Input label="Fecha de vencimiento" name="dueDate" type="date" defaultValue={defaults.dueDate} />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <LinkButton href="/facturacion" variant="ghost">
          Cancelar
        </LinkButton>
        <Button type="submit" icon="check_circle" disabled={pending}>
          {pending ? "Creando…" : "Crear factura"}
        </Button>
      </div>
    </form>
  );
}
