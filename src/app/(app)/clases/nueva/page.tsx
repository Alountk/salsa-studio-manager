import Link from "next/link";
import { Button } from "@/components/ui";
import { CreateClassForm } from "@/components/classes/create-class-form";

/**
 * Design 2, screen 05 — Crear clase por horas.
 * Spec: scripts/design-plan.mjs, designs/02-calendario-y-clases/05-crear-clase.png
 *
 * The header carries Cancelar and Crear clase as the design specifies; the submit
 * button sits outside the form element, so it references it through the `form`
 * attribute rather than duplicating the actions.
 */
export default function CreateClassPage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-headline-lg text-on-surface">Nueva clase</h2>
          <p className="mt-1 text-body-md text-on-surface-variant">
            Define la clase por bloques de hora y revísala antes de crearla.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/calendario">
            <Button variant="ghost">Cancelar</Button>
          </Link>
          <Button type="submit" form="create-class">
            Crear clase
          </Button>
        </div>
      </header>

      <CreateClassForm />
    </div>
  );
}
