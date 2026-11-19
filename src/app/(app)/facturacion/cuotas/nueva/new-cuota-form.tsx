"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Button, Input, LinkButton, Select } from "@/components/ui";
import { euros, grossOf, vatOf } from "@/lib/billing";
import { parseEuros } from "@/lib/euros-input";
import type { Student } from "@/lib/db/students";
import { createCuotaAction, type CuotaFormState } from "../actions";

/**
 * New-cuota form (client): student, concept, net amount with live IVA hint,
 * billing day (1..28 — enforced with a visible hint), start date. Creation
 * goes through the server action (spec S6).
 */
export function NewCuotaForm({ students, startDate }: { students: Student[]; startDate: string }) {
  const [state, formAction, pending] = useActionState<CuotaFormState, FormData>(
    createCuotaAction,
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
        <h2 className="font-display text-display text-on-surface">Nueva cuota</h2>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Se facturará sola cada mes, el día de cobro que elijas.
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

      <Input label="Concepto" name="concept" defaultValue="Cuota mensual" required />

      <Input
        label="Importe base mensual (sin IVA)"
        name="netEuros"
        inputMode="decimal"
        placeholder="50"
        value={netEuros}
        onChange={(event) => setNetEuros(event.target.value)}
        hint={hint}
      />

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <Input
          label="Día de cobro"
          name="billingDay"
          type="number"
          min={1}
          max={28}
          defaultValue={Number(startDate.slice(8, 10))}
          hint="Entre 1 y 28 para evitar meses raros"
        />
        <Input label="Fecha de inicio" name="startDate" type="date" defaultValue={startDate} />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <LinkButton href="/facturacion/cuotas" variant="ghost">
          Cancelar
        </LinkButton>
        <Button type="submit" icon="check_circle" disabled={pending}>
          {pending ? "Creando…" : "Crear cuota"}
        </Button>
      </div>
    </form>
  );
}
