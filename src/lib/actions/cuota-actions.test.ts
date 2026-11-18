import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { openDb } from "../db/index";
import { createStudent } from "../db/students";
import { listSubscriptions } from "../db/subscriptions";
import { parseCuotaForm, updateCuotaForm } from "./cuota-actions";
import type { Database } from "better-sqlite3";

function setup() {
  const path = join(mkdtempSync(join(tmpdir(), "studio-db-")), "test.db");
  const db: Database = openDb(path);
  const student = createStudent(db, { name: "Ana García" });
  return { db, student };
}

const valid = {
  concept: "Cuota mensual",
  netEuros: "50",
  billingDay: 15,
  startDate: "2026-01-01",
};

describe("parseCuotaForm", () => {
  it("creates an active cuota with amount in cents and its first due date", () => {
    const { db, student } = setup();
    const result = parseCuotaForm(db, { studentId: student.id, ...valid }, "2026-01-01");
    expect(result).toEqual({ ok: true, id: listSubscriptions(db)[0]?.id });

    const cuota = listSubscriptions(db)[0];
    expect(cuota).toMatchObject({
      studentId: student.id,
      concept: "Cuota mensual",
      amountCents: 5000,
      billingDay: 15,
      status: "active",
      nextInvoiceDate: "2026-01-15",
    });
  });

  it("rejects a student that does not exist", () => {
    const { db } = setup();
    expect(parseCuotaForm(db, { studentId: 9999, ...valid }, "2026-01-01")).toEqual({
      ok: false,
      error: "Selecciona un alumno",
    });
  });

  it("rejects empty or non-positive amounts", () => {
    const { db, student } = setup();
    for (const netEuros of ["0", "", "nope"]) {
      expect(
        parseCuotaForm(db, { studentId: student.id, ...valid, netEuros }, "2026-01-01"),
      ).toEqual({ ok: false, error: "El importe debe ser mayor que 0" });
    }
  });

  it("rejects billing days outside 1..28 and non-integers", () => {
    const { db, student } = setup();
    for (const billingDay of [31, 0, Number.NaN]) {
      expect(
        parseCuotaForm(db, { studentId: student.id, ...valid, billingDay }, "2026-01-01"),
      ).toEqual({ ok: false, error: "El día de cobro debe estar entre 1 y 28" });
    }
  });

  it("rejects malformed dates and empty concepts", () => {
    const { db, student } = setup();
    expect(
      parseCuotaForm(
        db,
        { studentId: student.id, ...valid, startDate: "ayer" },
        "2026-01-01",
      ),
    ).toEqual({ ok: false, error: "El formato de la fecha no es válido" });
    expect(
      parseCuotaForm(
        db,
        { studentId: student.id, ...valid, concept: "   " },
        "2026-01-01",
      ),
    ).toEqual({ ok: false, error: "El concepto es obligatorio" });
  });
});

describe("updateCuotaForm", () => {
  it("updates only the mutable fields (concept, amount, billing day)", () => {
    const { db, student } = setup();
    const created = parseCuotaForm(db, { studentId: student.id, ...valid }, "2026-01-01");
    expect(created.ok).toBe(true);
    const id = (created as { ok: true; id: number }).id;
    const startDateBefore = listSubscriptions(db)[0]?.startDate;

    const result = updateCuotaForm(db, id, {
      studentId: 0, // irrelevant for updates — student and start date never change
      concept: "Cuota trimestral",
      netEuros: "60,50",
      billingDay: 20,
      startDate: "ayer", // ignored: not a mutable field
    });

    expect(result).toEqual({ ok: true, id });
    expect(listSubscriptions(db)[0]).toMatchObject({
      concept: "Cuota trimestral",
      amountCents: 6050,
      billingDay: 20,
      startDate: startDateBefore,
    });
  });

  it("rejects invalid mutable fields and unknown ids", () => {
    const { db, student } = setup();
    const created = parseCuotaForm(db, { studentId: student.id, ...valid }, "2026-01-01");
    const id = (created as { ok: true; id: number }).id;

    expect(
      updateCuotaForm(db, id, { studentId: 0, concept: "X", netEuros: "0", billingDay: 5, startDate: "2026-01-01" }),
    ).toEqual({ ok: false, error: "El importe debe ser mayor que 0" });
    expect(
      updateCuotaForm(db, id, { studentId: 0, concept: "X", netEuros: "10", billingDay: 40, startDate: "2026-01-01" }),
    ).toEqual({ ok: false, error: "El día de cobro debe estar entre 1 y 28" });
    expect(
      updateCuotaForm(db, 9999, { studentId: 0, concept: "X", netEuros: "10", billingDay: 5, startDate: "2026-01-01" }),
    ).toEqual({ ok: false, error: "La cuota ya no existe" });
  });
});
