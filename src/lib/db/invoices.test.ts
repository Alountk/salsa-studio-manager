import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { openDb } from "./index";
import { createManualInvoice, getInvoiceByNumber, invoiceStatus, listInvoices, toAdminInvoice } from "./invoices";
import { createStudent, getStudent, listStudents, updateStudent } from "./students";
import { todayIso } from "../dates";
import type { Database } from "better-sqlite3";

function testDb(): Database {
  const path = join(mkdtempSync(join(tmpdir(), "studio-db-")), "test.db");
  return openDb(path);
}

describe("students repository", () => {
  it("creates, lists, gets, and updates a student", () => {
    const db = testDb();
    const created = createStudent(db, { name: "Ana García", email: "ana@example.com" });
    expect(getStudent(db, created.id)?.name).toBe("Ana García");
    expect(listStudents(db)).toHaveLength(1);

    const updated = updateStudent(db, created.id, { name: "Ana García Ruiz", email: "ana@example.com" });
    expect(updated.name).toBe("Ana García Ruiz");
  });
});

describe("invoice numbering", () => {
  it("allocates sequential V-<year>-<4 digits> numbers per year", () => {
    const db = testDb();
    const student = createStudent(db, { name: "Ana García" });

    const first = createManualInvoice(db, {
      studentId: student.id, concept: "Clase suelta",
      netCents: 10000, issueDate: "2026-11-01", dueDate: "2026-11-15",
    });
    const second = createManualInvoice(db, {
      studentId: student.id, concept: "Clase suelta",
      netCents: 10000, issueDate: "2026-11-02", dueDate: "2026-11-16",
    });

    expect(first.number).toBe("V-2026-0001");
    expect(second.number).toBe("V-2026-0002");
  });

  it("derives VAT from the net amount and reads invoices back", () => {
    const db = testDb();
    const student = createStudent(db, { name: "Luis Pérez" });
    const invoice = createManualInvoice(db, {
      studentId: student.id, concept: "Cuota mensual",
      netCents: 10000, issueDate: "2026-11-01", dueDate: "2026-11-15",
    });

    expect(invoice.ivaCents).toBe(2100);
    expect(invoice.grossCents).toBe(12100);

    const loaded = getInvoiceByNumber(db, invoice.number);
    expect(loaded?.studentName).toBe("Luis Pérez");
    expect(loaded?.paidCents).toBe(0);
    expect(listInvoices(db)).toHaveLength(1);
    expect(toAdminInvoice(loaded!)).toMatchObject({
      number: invoice.number,
      student: "Luis Pérez",
      issuedOn: "01/11/2026",
      dueOn: "15/11/2026",
      amountCents: 12100,
      status: invoiceStatus(12100, "2026-11-15", 0, todayIso()), // calendar-independent pass-through check
    });
  });
});

describe("invoiceStatus", () => {
  it("derives pending, overdue, and paid from stored data", () => {
    expect(invoiceStatus(12100, "2026-11-15", 0, "2026-11-10")).toBe("pending");
    expect(invoiceStatus(12100, "2026-11-15", 0, "2026-11-16")).toBe("overdue");
    expect(invoiceStatus(12100, "2026-11-15", 12100, "2026-11-16")).toBe("paid");
  });
});
