import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { todayIso } from "../dates";
import { openDb } from "./index";
import { getInvoiceByNumber } from "./invoices";
import { createStudent } from "./students";
import {
  createSubscription,
  ensureDueInvoices,
  listSubscriptions,
  setSubscriptionStatus,
  updateSubscription,
} from "./subscriptions";
import type { Database } from "better-sqlite3";

function setup() {
  const path = join(mkdtempSync(join(tmpdir(), "studio-db-")), "test.db");
  const db: Database = openDb(path);
  const student = createStudent(db, { name: "Ana García" });
  return { db, student };
}

describe("ensureDueInvoices", () => {
  it("generates exactly one invoice for a due period and is idempotent", () => {
    const { db, student } = setup();
    const sub = createSubscription(
      db,
      { studentId: student.id, concept: "Cuota mensual", amountCents: 45000, billingDay: 15, startDate: "2026-01-15" },
      "2026-01-15",
    );
    expect(sub.nextInvoiceDate).toBe("2026-01-15");

    const first = ensureDueInvoices(db, "2026-01-15");
    expect(first.created).toEqual(["V-2026-0001"]);

    const again = ensureDueInvoices(db, "2026-01-15");
    expect(again.created).toEqual([]);

    const invoice = getInvoiceByNumber(db, "V-2026-0001");
    expect(invoice?.subscriptionId).toBe(sub.id);
    expect(invoice?.netCents).toBe(45000);
    expect(invoice?.grossCents).toBe(54450); // 45000 net + 21% IVA
    expect(listSubscriptions(db)[0]).toMatchObject({ studentName: "Ana García" });
  });

  it("skips paused cuotas and recomputes the next date on resume", () => {
    const { db, student } = setup();
    const sub = createSubscription(
      db,
      { studentId: student.id, concept: "Cuota mensual", amountCents: 45000, billingDay: 15, startDate: "2026-01-15" },
      "2026-01-15",
    );

    setSubscriptionStatus(db, sub.id, "paused");
    expect(ensureDueInvoices(db, "2026-01-15").created).toEqual([]);

    const resumed = setSubscriptionStatus(db, sub.id, "active");
    expect(resumed.status).toBe("active");
    expect(resumed.nextInvoiceDate >= todayIso()).toBe(true); // spec: resume recomputes >= today

    const created = ensureDueInvoices(db, resumed.nextInvoiceDate);
    expect(created.created).toHaveLength(1);
    expect(getInvoiceByNumber(db, created.created[0] as string)?.subscriptionId).toBe(sub.id);
  });

  it("applies amount edits only to future invoices", () => {
    const { db, student } = setup();
    const sub = createSubscription(
      db,
      { studentId: student.id, concept: "Cuota mensual", amountCents: 20000, billingDay: 15, startDate: "2026-01-15" },
      "2026-01-15",
    );

    ensureDueInvoices(db, "2026-01-15");
    expect(getInvoiceByNumber(db, "V-2026-0001")?.netCents).toBe(20000);

    updateSubscription(db, sub.id, { concept: "Cuota mensual", amountCents: 25000, billingDay: 15 });
    // The issued invoice is immutable.
    expect(getInvoiceByNumber(db, "V-2026-0001")?.netCents).toBe(20000);

    expect(ensureDueInvoices(db, "2026-02-15").created).toEqual(["V-2026-0002"]);
    expect(getInvoiceByNumber(db, "V-2026-0002")?.netCents).toBe(25000);
    expect(getInvoiceByNumber(db, "V-2026-0002")?.grossCents).toBe(30250);
  });

  it("clamps billing day 31 to 28 and advances month over month", () => {
    const { db, student } = setup();
    const high = createSubscription(
      db,
      { studentId: student.id, concept: "Cuota", amountCents: 30000, billingDay: 31, startDate: "2026-01-01" },
      "2026-01-01",
    );
    expect(high.billingDay).toBe(28);
    expect(high.nextInvoiceDate).toBe("2026-01-28");

    ensureDueInvoices(db, "2026-01-28");
    expect(listSubscriptions(db)[0]?.nextInvoiceDate).toBe("2026-02-28");
    ensureDueInvoices(db, "2026-02-28");
    expect(listSubscriptions(db)[0]?.nextInvoiceDate).toBe("2026-03-28");

    const low = createSubscription(
      db,
      { studentId: student.id, concept: "Cuota", amountCents: 30000, billingDay: 15, startDate: "2026-01-01" },
      "2026-01-01",
    );
    expect(low.nextInvoiceDate).toBe("2026-01-15");
    ensureDueInvoices(db, "2026-01-15");
    ensureDueInvoices(db, "2026-02-15");
    const lowAfter = listSubscriptions(db).find((s) => s.id === low.id);
    expect(lowAfter?.nextInvoiceDate).toBe("2026-03-15");
  });

  it("stops generating for ended cuotas and records the end date", () => {
    const { db, student } = setup();
    const sub = createSubscription(
      db,
      { studentId: student.id, concept: "Cuota mensual", amountCents: 45000, billingDay: 15, startDate: "2026-01-15" },
      "2026-01-15",
    );

    const ended = setSubscriptionStatus(db, sub.id, "ended");
    expect(ended.status).toBe("ended");
    expect(ended.endDate).toBe(todayIso());

    expect(ensureDueInvoices(db, "2026-01-15").created).toEqual([]);
  });
});
