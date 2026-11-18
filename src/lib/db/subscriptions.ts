/**
 * Recurring monthly fees ("cuotas").
 *
 * While `active`, `ensureDueInvoices(today)` generates one invoice per elapsed
 * billing period. Idempotency comes from advancing `next_invoice_date` inside
 * the same transaction that inserts the invoice — a second run finds nothing
 * due. Edits to a cuota never touch already-issued invoices (spec S6).
 */
import type { Database } from "better-sqlite3";
import { grossOf, vatOf } from "../billing";
import { addDays, nextMonthlyDate, todayIso } from "../dates";
import { allocateInvoiceNumber } from "./invoices";

export type CuotaStatus = "active" | "paused" | "ended";

export interface Subscription {
  id: number;
  studentId: number;
  studentName: string;
  concept: string;
  /** NET cents (Global Constraints); lists show `grossOf(amountCents)`. */
  amountCents: number;
  /** Stored value clamped to 1..28 (UI rejects >28 with a friendly error). */
  billingDay: number;
  status: CuotaStatus;
  startDate: string;
  endDate: string | null;
  nextInvoiceDate: string;
  createdAt: string;
}

export interface SubscriptionInput {
  studentId: number;
  concept: string;
  amountCents: number;
  billingDay: number;
  startDate: string;
}

interface SubscriptionRow {
  id: number;
  student_id: number;
  student_name: string;
  concept: string;
  amount_cents: number;
  billing_day: number;
  status: CuotaStatus;
  start_date: string;
  end_date: string | null;
  next_invoice_date: string;
  created_at: string;
}

const SELECT_SUB = `
  SELECT c.id, c.student_id, s.name AS student_name, c.concept, c.amount_cents,
         c.billing_day, c.status, c.start_date, c.end_date, c.next_invoice_date, c.created_at
  FROM subscriptions c
  JOIN students s ON s.id = c.student_id
`;

function clampDay(day: number): number {
  return Math.min(Math.max(day, 1), 28);
}

function toSubscription(row: SubscriptionRow): Subscription {
  return {
    id: row.id,
    studentId: row.student_id,
    studentName: row.student_name,
    concept: row.concept,
    amountCents: row.amount_cents,
    billingDay: row.billing_day,
    status: row.status,
    startDate: row.start_date,
    endDate: row.end_date,
    nextInvoiceDate: row.next_invoice_date,
    createdAt: row.created_at,
  };
}

/**
 * First occurrence of `billingDay` (clamped 1..28) on or after
 * `max(startDate, today)` — a new cuota never backfills periods before it
 * starts, and a past billing day of the current month bills next month.
 */
function firstDue(startDate: string, billingDay: number, today: string): string {
  const day = clampDay(billingDay);
  const anchor = startDate > today ? startDate : today;
  const anchorDay = Number(anchor.slice(8, 10));
  if (day >= anchorDay) return `${anchor.slice(0, 8)}${String(day).padStart(2, "0")}`;
  return nextMonthlyDate(anchor, day);
}

function getSubscription(db: Database, id: number): Subscription | null {
  const row = db.prepare(`${SELECT_SUB} WHERE c.id = ?`).get(id);
  return row ? toSubscription(row as SubscriptionRow) : null;
}

/** All cuotas, grouped by student name then creation time. */
export function listSubscriptions(db: Database): Subscription[] {
  const rows = db.prepare(`${SELECT_SUB} ORDER BY s.name, c.created_at, c.id`).all();
  return (rows as SubscriptionRow[]).map(toSubscription);
}

/**
 * Create a cuota. `today` exists for deterministic tests and defaults to the
 * real local date; `billingDay` is clamped to 1..28 here.
 */
export function createSubscription(
  db: Database,
  input: SubscriptionInput,
  today: string = todayIso(),
): Subscription {
  const billingDay = clampDay(input.billingDay);
  const nextInvoiceDate = firstDue(input.startDate, billingDay, today);
  const info = db
    .prepare(
      `INSERT INTO subscriptions (student_id, concept, amount_cents, billing_day, status, start_date, end_date, next_invoice_date)
       VALUES (@studentId, @concept, @amountCents, @billingDay, 'active', @startDate, NULL, @nextInvoiceDate)`,
    )
    .run({
      studentId: input.studentId,
      concept: input.concept,
      amountCents: input.amountCents,
      billingDay,
      startDate: input.startDate,
      nextInvoiceDate,
    });
  const created = getSubscription(db, Number(info.lastInsertRowid));
  if (!created) throw new Error(`Subscription not found after insert: ${String(info.lastInsertRowid)}`);
  return created;
}

/**
 * Edit concept, amount, or billing day. FUTURE invoices only: issued invoice
 * rows are never rewritten, and an already-due `next_invoice_date` is left
 * alone so an edit can never cancel a period that is waiting to bill.
 */
export function updateSubscription(
  db: Database,
  id: number,
  input: Pick<SubscriptionInput, "concept" | "amountCents" | "billingDay">,
): Subscription {
  const info = db
    .prepare(
      "UPDATE subscriptions SET concept = @concept, amount_cents = @amountCents, billing_day = @billingDay WHERE id = @id",
    )
    .run({
      id,
      concept: input.concept,
      amountCents: input.amountCents,
      billingDay: clampDay(input.billingDay),
    });
  if (info.changes === 0) throw new Error(`Subscription not found: ${id}`);
  return getSubscription(db, id) as Subscription;
}

/**
 * Pause, resume, or end a cuota. Resume recomputes `next_invoice_date` to the
 * next occurrence on or after today (spec S2 of the cuota design: paused
 * months are skipped, not back-billed); ending stamps `endDate` with today.
 */
export function setSubscriptionStatus(
  db: Database,
  id: number,
  status: "active" | "paused" | "ended",
): Subscription {
  const current = getSubscription(db, id);
  if (!current) throw new Error(`Subscription not found: ${id}`);
  const today = todayIso();

  if (status === "ended") {
    db.prepare("UPDATE subscriptions SET status = 'ended', end_date = ? WHERE id = ?").run(today, id);
    return getSubscription(db, id) as Subscription;
  }

  const nextInvoiceDate =
    status === "active" ? firstDue(current.startDate, current.billingDay, today) : current.nextInvoiceDate;
  db.prepare("UPDATE subscriptions SET status = ?, next_invoice_date = ? WHERE id = ?").run(
    status,
    nextInvoiceDate,
    id,
  );
  return getSubscription(db, id) as Subscription;
}

/**
 * Generate one invoice for every elapsed period of every `active` cuota,
 * advancing `next_invoice_date` per invoice inside its transaction. Returns
 * the invoice numbers created (empty when nothing was due).
 */
export function ensureDueInvoices(db: Database, today: string): { created: string[] } {
  const created: string[] = [];
  const due = db
    .prepare("SELECT id FROM subscriptions WHERE status = 'active' AND next_invoice_date <= ?")
    .all(today) as { id: number }[];

  for (const { id } of due) {
    const sub = getSubscription(db, id);
    if (!sub) continue;

    let next = sub.nextInvoiceDate;
    let iterations = 0;
    while (next <= today && iterations < 60) {
      iterations += 1;
      const number = db.transaction(() => {
        const invoiceNumber = allocateInvoiceNumber(db, today.slice(0, 4));
        db.prepare(
          `INSERT INTO invoices (number, student_id, subscription_id, concept, net_cents, iva_cents, gross_cents, issue_date, due_date)
           VALUES (@number, @studentId, @subscriptionId, @concept, @netCents, @ivaCents, @grossCents, @issueDate, @dueDate)`,
        ).run({
          number: invoiceNumber,
          studentId: sub.studentId,
          subscriptionId: sub.id,
          concept: sub.concept,
          netCents: sub.amountCents,
          ivaCents: vatOf(sub.amountCents),
          grossCents: grossOf(sub.amountCents),
          issueDate: today,
          dueDate: addDays(today, 14),
        });
        db.prepare("UPDATE subscriptions SET next_invoice_date = ? WHERE id = ?").run(
          nextMonthlyDate(next, sub.billingDay),
          id,
        );
        return invoiceNumber;
      })();
      created.push(number);
      next = nextMonthlyDate(next, sub.billingDay);
    }
  }

  return { created };
}
