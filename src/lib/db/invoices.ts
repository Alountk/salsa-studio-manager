/**
 * Invoice repository.
 *
 * Status is always derived (never stored): `Pagada` once recorded payments
 * cover the gross amount, `Vencida` when unpaid past `due_date`, otherwise
 * `Pendiente` — the vocabulary of `STATUS_LABEL` in `../billing.ts`.
 * Amounts are integer cents; entered amounts are net and VAT is derived.
 */
import type { Database } from "better-sqlite3";
import type { AdminInvoice, InvoiceStatus } from "../billing";
import { grossOf, vatOf } from "../billing";
import { formatEs, todayIso } from "../dates";

export type InvoiceFilter = "all" | "paid" | "pending" | "overdue";

export interface Invoice {
  id: number;
  number: string;
  studentId: number;
  studentName: string;
  subscriptionId: number | null;
  concept: string;
  netCents: number;
  ivaCents: number;
  grossCents: number;
  issueDate: string;
  dueDate: string;
}

export interface InvoiceWithStatus extends Invoice {
  status: InvoiceStatus;
  paidCents: number;
}

interface InvoiceRow {
  id: number;
  number: string;
  student_id: number;
  student_name: string;
  subscription_id: number | null;
  concept: string;
  net_cents: number;
  iva_cents: number;
  gross_cents: number;
  issue_date: string;
  due_date: string;
  paid_cents: number;
}

const SELECT_INVOICE = `
  SELECT i.id, i.number, i.student_id, s.name AS student_name, i.subscription_id,
         i.concept, i.net_cents, i.iva_cents, i.gross_cents, i.issue_date, i.due_date,
         COALESCE((SELECT SUM(p.amount_cents) FROM payments p WHERE p.invoice_id = i.id), 0) AS paid_cents
  FROM invoices i
  JOIN students s ON s.id = i.student_id
`;

/** Derived status: paid covers gross → paid; past due → overdue; else pending. */
export function invoiceStatus(
  grossCents: number,
  dueDate: string,
  paidCents: number,
  today: string,
): InvoiceStatus {
  if (paidCents >= grossCents) return "paid";
  if (today > dueDate) return "overdue";
  return "pending";
}

function toInvoiceWithStatus(row: InvoiceRow, today: string): InvoiceWithStatus {
  return {
    id: row.id,
    number: row.number,
    studentId: row.student_id,
    studentName: row.student_name,
    subscriptionId: row.subscription_id,
    concept: row.concept,
    netCents: row.net_cents,
    ivaCents: row.iva_cents,
    grossCents: row.gross_cents,
    issueDate: row.issue_date,
    dueDate: row.due_date,
    paidCents: row.paid_cents,
    status: invoiceStatus(row.gross_cents, row.due_date, row.paid_cents, today),
  };
}

/** All invoices, newest first, optionally filtered by derived status. */
export function listInvoices(db: Database, filter: InvoiceFilter = "all"): InvoiceWithStatus[] {
  const today = todayIso();
  const rows = db.prepare(`${SELECT_INVOICE} ORDER BY i.issue_date DESC, i.number DESC`).all();
  const invoices = (rows as InvoiceRow[]).map((row) => toInvoiceWithStatus(row, today));
  return filter === "all" ? invoices : invoices.filter((inv) => inv.status === filter);
}

/** One invoice by its `V-YYYY-NNNN` number, or `null`. */
export function getInvoiceByNumber(db: Database, number: string): InvoiceWithStatus | null {
  const row = db.prepare(`${SELECT_INVOICE} WHERE i.number = ?`).get(number);
  return row ? toInvoiceWithStatus(row as InvoiceRow, todayIso()) : null;
}

/**
 * Next sequential invoice number for `year`: `V-<year>-<4 digits>`.
 * Callers must invoke this inside a transaction together with the insert.
 */
export function allocateInvoiceNumber(db: Database, year: string): string {
  const prefix = `V-${year}-`;
  const last = db
    .prepare("SELECT number FROM invoices WHERE number LIKE ? ORDER BY number DESC LIMIT 1")
    .get(`${prefix}%`) as { number: string } | undefined;
  const next = last ? Number.parseInt(last.number.slice(prefix.length), 10) + 1 : 1;
  return `${prefix}${String(next).padStart(4, "0")}`;
}

/**
 * Insert a manual invoice, allocating its sequential number inside the
 * transaction: `V-<issue year>-<4 digits>`, continuing the year's sequence.
 */
export function createManualInvoice(
  db: Database,
  input: {
    studentId: number;
    concept: string;
    netCents: number;
    issueDate: string;
    dueDate: string;
  },
): Invoice {
  const insert = db.transaction(() => {
    const number = allocateInvoiceNumber(db, input.issueDate.slice(0, 4));
    const ivaCents = vatOf(input.netCents);
    const grossCents = grossOf(input.netCents);

    const info = db
      .prepare(
        `INSERT INTO invoices (number, student_id, subscription_id, concept, net_cents, iva_cents, gross_cents, issue_date, due_date)
         VALUES (@number, @studentId, NULL, @concept, @netCents, @ivaCents, @grossCents, @issueDate, @dueDate)`,
      )
      .run({
        number,
        studentId: input.studentId,
        concept: input.concept,
        netCents: input.netCents,
        ivaCents,
        grossCents,
        issueDate: input.issueDate,
        dueDate: input.dueDate,
      });

    return { id: Number(info.lastInsertRowid), number };
  });

  const { id } = insert();
  const created = db
    .prepare(`${SELECT_INVOICE} WHERE i.id = ?`)
    .get(id) as InvoiceRow;
  return toInvoiceWithStatus(created, todayIso()) as Invoice;
}

/** Map a stored invoice onto the UI row shape the existing components render. */
export function toAdminInvoice(inv: InvoiceWithStatus): AdminInvoice {
  return {
    number: inv.number,
    student: inv.studentName,
    concept: inv.concept,
    issuedOn: formatEs(inv.issueDate),
    dueOn: formatEs(inv.dueDate),
    amountCents: inv.grossCents,
    status: inv.status,
  };
}
