"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Button, Card, Input, LinkButton } from "@/components/ui";
import { euros, grossOf, vatOf } from "@/lib/billing";
import { parseEuros } from "@/lib/euros-input";
import type { Subscription } from "@/lib/db/subscriptions";
import { setCuotaStatusAction, updateCuotaAction, type CuotaFormState } from "../actions";

/**
 * Edit cuota (client): the fields affect FUTURE invoices only (visible note,
 * spec S6); issued invoices are never rewritten. Status actions (pause,
 * resume, end) sit in their own form below — a form cannot nest.
 */
export function EditCuotaForm({ cuota }: { cuota: Subscription }) {
  const [state, formAction, pending] = useActionState<CuotaFormState, FormData>(
    updateCuotaAction,
    { error: null },
  );
  const [netEuros, setNetEuros] = useState(String(cuota.amountCents / 100).replace(".", ","));

  const netCents = parseEuros(netEuros);
  const hint =
    netCents === null
      ? "Se aplicará IVA del 21% sobre la base"
      : `IVA (21%): ${euros(vatOf(netCents))} · Total con IVA: ${euros(grossOf(netCents))}`;

  const statusActions =
    cuota.status === "active"
      ? ([
          { status: "paused", label: "Pausar", variant: "secondary" as const },
          { status: "ended", label: "Dar de baja", variant: "danger" as const },
        ] as const)
      : cuota.status === "paused"
        ? ([
            { status: "active", label: "Reanudar", variant: "primary" as const },
            { status: "ended", label: "Dar de baja", variant: "danger" as const },
          ] as const)
        : [];

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link
          href="/facturacion/cuotas"
          className="group inline-flex w-fit items-center gap-1.5 text-body-sm text-on-surface-variant transition-colors hover:text-primary"
        >
          Volver a Cuotas
        </Link>
        <h2 className="mt-2 font-display text-display text-on-surface">
          Cuota de {cuota.studentName}
        </h2>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Los cambios solo afectan a facturas futuras.
        </p>
      </div>

      <form action={formAction} className="space-y-5">
        <input type="hidden" name="id" value={cuota.id} />

        {state.error ? (
          <p
            role="alert"
            className="rounded-sm bg-error-container/40 px-4 py-3 text-body-sm text-error"
          >
            {state.error}
          </p>
        ) : null}

        {/* Student is fixed for a cuota: display, not a (disabled) control —
            a disabled select omits itself from FormData. */}
        <div>
          <span className="mb-1.5 block text-label uppercase text-on-surface-variant">
            Alumno
          </span>
          <p className="text-body-md font-medium text-on-surface">{cuota.studentName}</p>
          <input type="hidden" name="studentId" value={cuota.studentId} />
        </div>

        <Input label="Concepto" name="concept" defaultValue={cuota.concept} required />

        <Input
          label="Importe base mensual (sin IVA)"
          name="netEuros"
          inputMode="decimal"
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
            defaultValue={cuota.billingDay}
            hint="Entre 1 y 28 para evitar meses raros"
          />
          <div>
            <span className="mb-1.5 block text-label uppercase text-on-surface-variant">
              Facturación desde
            </span>
            <p className="text-body-md text-on-surface tabular-figures">{cuota.startDate}</p>
            <span className="text-body-sm text-on-surface-variant">
              La fecha de inicio no se puede cambiar.
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <LinkButton href="/facturacion/cuotas" variant="ghost">
            Cancelar
          </LinkButton>
          <Button type="submit" icon="save" disabled={pending}>
            {pending ? "Guardando…" : "Guardar cambios"}
          </Button>
        </div>
      </form>

      {statusActions.length > 0 ? (
        <Card as="section" className="p-5">
          <h3 className="font-display text-headline-sm text-on-surface">Estado de la cuota</h3>
          <p className="mt-1 text-body-sm text-on-surface-variant">
            Pausar deja de facturar sin dar de baja; reanudar calcula la próxima fecha desde hoy.
          </p>
          <form action={setCuotaStatusAction} className="mt-4 flex flex-wrap items-center gap-3">
            <input type="hidden" name="id" value={cuota.id} />
            {statusActions.map((action) => (
              <Button
                key={action.status}
                type="submit"
                name="status"
                value={action.status}
                variant={action.variant}
              >
                {action.label}
              </Button>
            ))}
          </form>
        </Card>
      ) : (
        <Card as="section" className="p-5">
          <h3 className="font-display text-headline-sm text-on-surface">Cuota dada de baja</h3>
          <p className="mt-1 text-body-sm text-on-surface-variant">
            Esta cuota ya no genera facturas. Su historial sigue en Facturación.
          </p>
        </Card>
      )}
    </div>
  );
}
