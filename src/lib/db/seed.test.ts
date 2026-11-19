import { describe, expect, it } from "vitest";
import { invoiceStatus } from "./invoices";
import { openDb } from "./index";
import { runSeed } from "./seed";

describe("runSeed", () => {
  it("seeds demo students, invoices with all three statuses, and cuotas exactly once", () => {
    const db = openDb(":memory:");
    const today = "2026-11-19";

    expect(runSeed(db, today)).toEqual({ students: 8, invoices: 10, cuotas: 3 });

    const rows = db
      .prepare(
        `SELECT i.gross_cents, i.due_date,
                COALESCE((SELECT SUM(p.amount_cents) FROM payments p WHERE p.invoice_id = i.id), 0) AS paid
         FROM invoices i`,
      )
      .all() as { gross_cents: number; due_date: string; paid: number }[];
    const statuses = rows.map((row) => invoiceStatus(row.gross_cents, row.due_date, row.paid, today));
    expect(statuses.filter((s) => s === "paid")).toHaveLength(4);
    expect(statuses.filter((s) => s === "pending")).toHaveLength(3);
    expect(statuses.filter((s) => s === "overdue")).toHaveLength(3);

    const cuotas = db.prepare("SELECT status FROM subscriptions").all() as { status: string }[];
    expect(cuotas.filter((c) => c.status === "active")).toHaveLength(2);
    expect(cuotas.filter((c) => c.status === "paused")).toHaveLength(1);

    // Guard: a second seed on a populated database is a no-op.
    expect(runSeed(db, today)).toEqual({ students: 0, invoices: 0, cuotas: 0 });
  });
});
