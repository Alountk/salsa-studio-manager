import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { addDays, todayIso } from "../dates";
import { openDb } from "./index";
import { createManualInvoice, getInvoiceByNumber } from "./invoices";
import { createStudent } from "./students";
import { listPayments, recordPayment, studentOutstandingCents, PaymentError } from "./payments";
import type { Database } from "better-sqlite3";

function setup() {
  const path = join(mkdtempSync(join(tmpdir(), "studio-db-")), "test.db");
  const db: Database = openDb(path);
  const student = createStudent(db, { name: "Ana García" });
  const invoice = createManualInvoice(db, {
    studentId: student.id,
    concept: "Clase suelta",
    netCents: 10000, // gross 12100
    issueDate: todayIso(),
    dueDate: addDays(todayIso(), 14),
  });
  return { db, student, invoice };
}

describe("recordPayment", () => {
  it("tracks partial then full payments with a floored outstanding balance", () => {
    const { db, student, invoice } = setup();
    const today = todayIso();

    recordPayment(db, { invoiceNumber: invoice.number, amountCents: 5000, paidAt: today });
    expect(getInvoiceByNumber(db, invoice.number)?.status).toBe("pending");
    expect(studentOutstandingCents(db, student.id, today)).toBe(7100);

    recordPayment(db, { invoiceNumber: invoice.number, amountCents: 7100, paidAt: today });
    expect(getInvoiceByNumber(db, invoice.number)?.status).toBe("paid");
    expect(studentOutstandingCents(db, student.id, today)).toBe(0);

    // Overpayment must never make the balance negative.
    recordPayment(db, { invoiceNumber: invoice.number, amountCents: 1000, paidAt: today });
    expect(getInvoiceByNumber(db, invoice.number)?.status).toBe("paid");
    expect(studentOutstandingCents(db, student.id, today)).toBe(0);
    expect(listPayments(db, invoice.id)).toHaveLength(3);
  });

  it("throws PaymentError for unknown invoices and non-positive amounts", () => {
    const { db, invoice } = setup();
    const today = todayIso();

    expect(() =>
      recordPayment(db, { invoiceNumber: "V-2099-9999", amountCents: 100, paidAt: today }),
    ).toThrow(PaymentError);
    expect(() =>
      recordPayment(db, { invoiceNumber: invoice.number, amountCents: 0, paidAt: today }),
    ).toThrow(PaymentError);
    expect(() =>
      recordPayment(db, { invoiceNumber: invoice.number, amountCents: -5, paidAt: today }),
    ).toThrow(PaymentError);
  });

  it("does not count invoices issued after today as outstanding", () => {
    const { db, student } = setup();
    createManualInvoice(db, {
      studentId: student.id,
      concept: "Cuota diciembre",
      netCents: 5000,
      issueDate: addDays(todayIso(), 30),
      dueDate: addDays(todayIso(), 44),
    });

    expect(studentOutstandingCents(db, student.id, todayIso())).toBe(12100);
  });
});
