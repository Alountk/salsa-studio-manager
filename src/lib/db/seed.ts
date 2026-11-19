/**
 * Demo/dev seed: 8 students, 10 invoices spanning paid/pending/overdue at
 * `today`, and 3 cuotas (2 active, 1 paused) — names reused from the design
 * mock (`ADMIN_INVOICES`). Production deploys start empty (spec §1).
 *
 * `today` is a parameter so tests are calendar-independent; the CLI wrapper
 * (`scripts/seed.ts`) passes the real local date. Idempotent: refuses to seed
 * a database that already has students.
 */
import type { Database } from "better-sqlite3";
import { grossOf } from "../billing";
import { addDays } from "../dates";
import { createManualInvoice } from "./invoices";
import { recordPayment } from "./payments";
import { createStudent, listStudents } from "./students";
import { createSubscription, setSubscriptionStatus } from "./subscriptions";

const STUDENT_NAMES = [
  "Javier Ruiz",
  "Carlos Méndez",
  "Sofía Navarro",
  "Lucía Moreno",
  "David Serrano",
  "Ana Prieto",
  "Marcos Domínguez",
  "Elena Morales",
];

interface InvoiceSpec {
  studentIdx: number;
  concept: string;
  netCents: number;
  issueOffset: number;
  dueOffset: number;
  paid: boolean;
}

/** Offsets are days relative to `today`; the three statuses come from due dates + payments. */
const INVOICE_SPECS: InvoiceSpec[] = [
  // Overdue (3) — unpaid past due date.
  { studentIdx: 0, concept: "Clase suelta", netCents: 1500, issueOffset: -24, dueOffset: -5, paid: false },
  { studentIdx: 1, concept: "Bono de 10 clases", netCents: 8500, issueOffset: -30, dueOffset: -10, paid: false },
  { studentIdx: 2, concept: "Clase suelta", netCents: 1500, issueOffset: -20, dueOffset: -3, paid: false },
  // Pending (3) — due in the future.
  { studentIdx: 3, concept: "Cuota mensual", netCents: 45000, issueOffset: -4, dueOffset: 10, paid: false },
  { studentIdx: 4, concept: "Clase suelta", netCents: 1500, issueOffset: -2, dueOffset: 12, paid: false },
  { studentIdx: 5, concept: "Bono de 5 clases", netCents: 5000, issueOffset: -6, dueOffset: 8, paid: false },
  // Paid (4) — full payment recorded.
  { studentIdx: 6, concept: "Clase suelta", netCents: 1500, issueOffset: -40, dueOffset: -26, paid: true },
  { studentIdx: 7, concept: "Cuota mensual", netCents: 45000, issueOffset: -35, dueOffset: -21, paid: true },
  { studentIdx: 0, concept: "Clase suelta", netCents: 4500, issueOffset: -18, dueOffset: -4, paid: true },
  { studentIdx: 3, concept: "Bono de 10 clases", netCents: 8500, issueOffset: -12, dueOffset: 2, paid: true },
];

export interface SeedCounts {
  students: number;
  invoices: number;
  cuotas: number;
}

/** Populate an empty database with demo data; returns zeros when already seeded. */
export function runSeed(db: Database, today: string): SeedCounts {
  if (listStudents(db).length > 0) return { students: 0, invoices: 0, cuotas: 0 };

  const students = STUDENT_NAMES.map((name) => createStudent(db, { name }));
  let invoices = 0;

  for (const spec of INVOICE_SPECS) {
    const student = students[spec.studentIdx] as (typeof students)[number];
    const invoice = createManualInvoice(db, {
      studentId: student.id,
      concept: spec.concept,
      netCents: spec.netCents,
      issueDate: addDays(today, spec.issueOffset),
      dueDate: addDays(today, spec.dueOffset),
    });
    invoices += 1;
    if (spec.paid) {
      recordPayment(db, {
        invoiceNumber: invoice.number,
        amountCents: grossOf(spec.netCents),
        paidAt: addDays(today, Math.min(spec.issueOffset + 7, -1)),
      });
    }
  }

  createSubscription(
    db,
    { studentId: (students[0] as { id: number }).id, concept: "Cuota mensual", amountCents: 45000, billingDay: 1, startDate: today },
    today,
  );
  createSubscription(
    db,
    { studentId: (students[3] as { id: number }).id, concept: "Cuota mensual", amountCents: 45000, billingDay: 15, startDate: today },
    today,
  );
  const paused = createSubscription(
    db,
    { studentId: (students[5] as { id: number }).id, concept: "Cuota mensual", amountCents: 39000, billingDay: 20, startDate: today },
    today,
  );
  setSubscriptionStatus(db, paused.id, "paused");

  return { students: students.length, invoices, cuotas: 3 };
}
