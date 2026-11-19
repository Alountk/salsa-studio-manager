import { connection } from "next/server";
import { createStudentAction } from "../actions";
import { StudentForm } from "../student-form";

/** `/alumnos/nuevo` — create a student record (spec S7: admin-managed). */
export default async function NuevoAlumnoPage() {
  await connection();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="font-display text-display text-on-surface">Nuevo alumno</h2>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Los alumnos son fichas del estudio: solo tú los creas y editas; nunca inician sesión.
        </p>
      </div>
      <StudentForm
        action={createStudentAction}
        submitLabel="Crear alumno"
        cancelHref="/alumnos"
      />
    </div>
  );
}
