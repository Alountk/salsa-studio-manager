"use client";

import { useActionState } from "react";
import { Button, Input, LinkButton } from "@/components/ui";
import type { Student } from "@/lib/db/students";
import type { StudentFormState } from "./actions";

/**
 * Shared student form (client) for create and edit — same fields, same server
 * action contract; the action reference is passed in from the server page.
 * There is deliberately no delete control anywhere (spec S7).
 */
export function StudentForm({
  action,
  student,
  submitLabel,
  cancelHref,
}: {
  action: (prev: StudentFormState, formData: FormData) => Promise<StudentFormState>;
  student?: Student;
  submitLabel: string;
  cancelHref: string;
}) {
  const [state, formAction, pending] = useActionState<StudentFormState, FormData>(action, {
    error: null,
  });

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      {student ? <input type="hidden" name="id" value={student.id} /> : null}

      {state.error ? (
        <p
          role="alert"
          className="rounded-sm bg-error-container/40 px-4 py-3 text-body-sm text-error"
        >
          {state.error}
        </p>
      ) : null}

      <Input
        label="Nombre completo"
        name="name"
        defaultValue={student?.name ?? ""}
        placeholder="Ana García"
        required
      />

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <Input
          label="Correo electrónico"
          name="email"
          type="email"
          defaultValue={student?.email ?? ""}
          placeholder="ana@ejemplo.com"
        />
        <Input
          label="Teléfono"
          name="phone"
          type="tel"
          defaultValue={student?.phone ?? ""}
          placeholder="600 000 000"
        />
      </div>

      <div>
        <label
          htmlFor="student-notes"
          className="mb-1.5 block text-label uppercase text-on-surface-variant"
        >
          Notas (opcional)
        </label>
        <textarea
          id="student-notes"
          name="notes"
          rows={3}
          defaultValue={student?.notes ?? ""}
          placeholder="Prefiere clases por la tarde…"
          className="w-full resize-none rounded-sm border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface outline-none transition-all placeholder:text-outline focus:border-primary focus:shadow-[var(--focus-ring-input)]"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <LinkButton href={cancelHref} variant="ghost">
          Cancelar
        </LinkButton>
        <Button type="submit" icon="check_circle" disabled={pending}>
          {pending ? "Guardando…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
