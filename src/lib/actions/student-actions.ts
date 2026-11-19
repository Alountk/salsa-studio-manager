/**
 * Pure validation for student forms (spec S7: admin-managed records).
 * No `next/*`, no db — the server actions own creation and update.
 */
export type StudentFormResult = { ok: true } | { ok: false; error: string };

export function parseStudentForm(form: {
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
}): StudentFormResult {
  if (form.name.trim() === "") {
    return { ok: false, error: "El nombre es obligatorio" };
  }
  return { ok: true };
}
