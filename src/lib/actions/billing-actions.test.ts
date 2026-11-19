import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { openDb } from "../db/index";
import { getInvoiceByNumber } from "../db/invoices";
import { createStudent } from "../db/students";
import { parseEuros, parseInvoiceForm } from "./billing-actions";
import type { Database } from "better-sqlite3";

function setup() {
  const path = join(mkdtempSync(join(tmpdir(), "studio-db-")), "test.db");
  const db: Database = openDb(path);
  const student = createStudent(db, { name: "Ana García" });
  return { db, student };
}

describe("parseEuros", () => {
  it("parses Spanish and dot decimals into integer cents", () => {
    expect(parseEuros("45,50")).toBe(4550);
    expect(parseEuros("45.50")).toBe(4550);
    expect(parseEuros("45")).toBe(4500);
    expect(parseEuros(" 1.234,56 ")).toBe(123456);
  });

  it("rejects empty, non-numeric, and negative amounts", () => {
    expect(parseEuros("")).toBeNull();
    expect(parseEuros("abc")).toBeNull();
    expect(parseEuros("-5")).toBeNull();
  });
});

describe("parseInvoiceForm", () => {
  const valid = {
    concept: "Clase suelta",
    netEuros: "45,50",
    issueDate: "2026-11-01",
    dueDate: "2026-11-15",
  };

  it("creates the invoice and returns its sequential number", () => {
    const { db, student } = setup();
    const result = parseInvoiceForm(
      db,
      { studentId: student.id, ...valid }
    );
    expect(result).toEqual({ ok: true, number: "V-2026-0001" });

    const stored = getInvoiceByNumber(db, "V-2026-0001");
    expect(stored?.netCents).toBe(4550); // "45,50" euros in cents
    expect(stored?.concept).toBe("Clase suelta");
  });

  it("rejects a student that does not exist", () => {
    const { db } = setup();
    const result = parseInvoiceForm(db, { studentId: 9999, ...valid });
    expect(result).toEqual({ ok: false, error: "Selecciona un alumno" });
  });

  it("rejects empty or non-positive amounts", () => {
    const { db, student } = setup();
    for (const netEuros of ["0", "", "nope"]) {
      const result = parseInvoiceForm(
        db,
        { studentId: student.id, ...valid, netEuros }
      );
      expect(result).toEqual({ ok: false, error: "El importe debe ser mayor que 0" });
    }
  });

  it("rejects a due date before the issue date", () => {
    const { db, student } = setup();
    const result = parseInvoiceForm(
      db,
      { studentId: student.id, ...valid, issueDate: "2026-11-20", dueDate: "2026-11-19" }
    );
    expect(result).toEqual({
      ok: false,
      error: "La fecha de vencimiento no puede ser anterior a la de emisión",
    });
  });

  it("rejects malformed dates", () => {
    const { db, student } = setup();
    const result = parseInvoiceForm(
      db,
      { studentId: student.id, ...valid, issueDate: "ayer" }
    );
    expect(result).toEqual({ ok: false, error: "El formato de la fecha no es válido" });
  });

  it("rejects an empty concept", () => {
    const { db, student } = setup();
    const result = parseInvoiceForm(
      db,
      { studentId: student.id, ...valid, concept: "   " }
    );
    expect(result).toEqual({ ok: false, error: "El concepto es obligatorio" });
  });
});
