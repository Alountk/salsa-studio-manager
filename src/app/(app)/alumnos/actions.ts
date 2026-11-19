"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { parseStudentForm } from "@/lib/actions/student-actions";
import { getDb } from "@/lib/db";
import { createStudent, updateStudent } from "@/lib/db/students";

export type StudentFormState = { error: string | null };

function readStudentForm(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    notes: String(formData.get("notes") ?? "").trim(),
  };
}

/** Create a student, then land on their detail page (spec S7). */
export async function createStudentAction(
  _prev: StudentFormState,
  formData: FormData,
): Promise<StudentFormState> {
  const raw = readStudentForm(formData);
  const parsed = parseStudentForm(raw);
  if (!parsed.ok) return { error: parsed.error };

  const student = createStudent(getDb(), {
    name: raw.name.trim(),
    ...(raw.email ? { email: raw.email } : {}),
    ...(raw.phone ? { phone: raw.phone } : {}),
    ...(raw.notes ? { notes: raw.notes } : {}),
  });

  revalidatePath("/alumnos");
  redirect(`/alumnos/${student.id}`);
}

/** Update a student's fields, then reload their detail page. */
export async function updateStudentAction(
  _prev: StudentFormState,
  formData: FormData,
): Promise<StudentFormState> {
  const id = Number(formData.get("id"));
  const raw = readStudentForm(formData);
  const parsed = parseStudentForm(raw);
  if (!parsed.ok) return { error: parsed.error };

  updateStudent(getDb(), id, {
    name: raw.name.trim(),
    ...(raw.email ? { email: raw.email } : {}),
    ...(raw.phone ? { phone: raw.phone } : {}),
    ...(raw.notes ? { notes: raw.notes } : {}),
  });

  revalidatePath("/alumnos");
  revalidatePath(`/alumnos/${id}`);
  redirect(`/alumnos/${id}`);
}
