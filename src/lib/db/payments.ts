/**
 * Payment recording and outstanding balances.
 *
 * Payments are append-only rows against an invoice; the invoice's status is
 * never stored — it stays derived in `./invoices.ts`. The outstanding balance
 * floors at zero per invoice, so overpayments can never produce a negative
 * amount owed (Review Focus 4 of the implementation plan).
 */
import type { Database } from "better-sqlite3";

export interface Payment {
  id: number;
  invoiceId: number;
  amountCents: number;
  paidAt: string;
  note: string | null;
}

/** Thrown when a payment cannot be recorded (unknown invoice, bad amount). */
export class PaymentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PaymentError";
  }
}

interface PaymentRow {
  id: number;
  invoice_id: number;
  amount_cents: number;
  paid_at: string;
  note: string | null;
}

function toPayment(row: PaymentRow): Payment {
  return {
    id: row.id,
    invoiceId: row.invoice_id,
    amountCents: row.amount_cents,
    paidAt: row.paid_at,
    note: row.note,
  };
}

/** Record a payment against an invoice; throws `PaymentError` on bad input. */
export function recordPayment(
  db: Database,
  input: { invoiceNumber: string; amountCents: number; paidAt: string; note?: string },
): Payment {
  const invoice = db.prepare("SELECT id FROM invoices WHERE number = ?").get(input.invoiceNumber);
  if (!invoice) throw new PaymentError(`Unknown invoice: ${input.invoiceNumber}`);
  if (!Number.isFinite(input.amountCents) || input.amountCents <= 0) {
    throw new PaymentError("Payment amount must be greater than zero");
  }

  const info = db
    .prepare(
      "INSERT INTO payments (invoice_id, amount_cents, paid_at, note) VALUES (@invoiceId, @amountCents, @paidAt, @note)",
    )
    .run({
      invoiceId: (invoice as { id: number }).id,
      amountCents: input.amountCents,
      paidAt: input.paidAt,
      note: input.note ?? null,
    });

  return {
    id: Number(info.lastInsertRowid),
    invoiceId: (invoice as { id: number }).id,
    amountCents: input.amountCents,
    paidAt: input.paidAt,
    note: input.note ?? null,
  };
}

/** Every payment recorded on an invoice, oldest first. */
export function listPayments(db: Database, invoiceId: number): Payment[] {
  const rows = db
    .prepare("SELECT * FROM payments WHERE invoice_id = ? ORDER BY paid_at, id")
    .all(invoiceId);
  return (rows as PaymentRow[]).map(toPayment);
}

/**
 * Total payments recorded within `monthPrefix` (`"2026-11"`), by `paid_at`
 * prefix — the dashboard's "cobrado este mes" KPI.
 */
export function collectedInMonthCents(db: Database, monthPrefix: string): number {
  const row = db
    .prepare("SELECT COALESCE(SUM(amount_cents), 0) AS total FROM payments WHERE paid_at LIKE ?")
    .get(`${monthPrefix}%`) as { total: number };
  return row.total;
}

/** What a student still owes: the sum of (gross − paid) over invoices issued
 * on or before `today`, floored at zero per invoice. Fully paid and
 * future-dated invoices contribute nothing.
 */
export function studentOutstandingCents(db: Database, studentId: number, today: string): number {
  const row = db
    .prepare(
      `SELECT COALESCE(SUM(
         MAX(i.gross_cents - COALESCE(
           (SELECT SUM(p.amount_cents) FROM payments p WHERE p.invoice_id = i.id), 0), 0)
       ), 0) AS outstanding
       FROM invoices i
       WHERE i.student_id = ? AND i.issue_date <= ?`,
    )
    .get(studentId, today) as { outstanding: number };
  return row.outstanding;
}
