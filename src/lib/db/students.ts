/**
 * Student records. Students are plain data the admin creates — they never log
 * in (spec non-goal S7), and there is deliberately no delete: invoices reference
 * students with `ON DELETE RESTRICT`.
 */
import type { Database } from "better-sqlite3";

export interface Student {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  createdAt: string;
}

export interface StudentInput {
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
}

interface StudentRow {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  created_at: string;
}

function toStudent(row: StudentRow): Student {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

/** All students, alphabetical. */
export function listStudents(db: Database): Student[] {
  const rows = db.prepare("SELECT * FROM students ORDER BY name").all();
  return (rows as StudentRow[]).map(toStudent);
}

/** One student by id, or `null`. */
export function getStudent(db: Database, id: number): Student | null {
  const row = db.prepare("SELECT * FROM students WHERE id = ?").get(id);
  return row ? toStudent(row as StudentRow) : null;
}

/** Insert a student and return it. */
export function createStudent(db: Database, input: StudentInput): Student {
  const info = db
    .prepare("INSERT INTO students (name, email, phone, notes) VALUES (@name, @email, @phone, @notes)")
    .run({
      name: input.name,
      email: input.email ?? null,
      phone: input.phone ?? null,
      notes: input.notes ?? null,
    });
  const created = getStudent(db, Number(info.lastInsertRowid));
  if (!created) throw new Error(`Student not found after insert: ${String(info.lastInsertRowid)}`);
  return created;
}

/** Replace the editable fields of a student; throws when the id does not exist. */
export function updateStudent(db: Database, id: number, input: StudentInput): Student {
  const info = db
    .prepare(
      "UPDATE students SET name = @name, email = @email, phone = @phone, notes = @notes WHERE id = @id",
    )
    .run({
      id,
      name: input.name,
      email: input.email ?? null,
      phone: input.phone ?? null,
      notes: input.notes ?? null,
    });
  if (info.changes === 0) throw new Error(`Student not found: ${id}`);
  return getStudent(db, id) as Student;
}
