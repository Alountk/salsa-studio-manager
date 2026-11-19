import { describe, expect, it } from "vitest";
import { addDays, formatEs, nextMonthlyDate, todayIso } from "./dates";

describe("formatEs", () => {
  it("converts ISO dates to Spanish dd/MM/yyyy", () => {
    expect(formatEs("2026-11-19")).toBe("19/11/2026");
    expect(formatEs("2026-01-05")).toBe("05/01/2026");
  });
});

describe("todayIso", () => {
  it("returns today as a local YYYY-MM-DD string", () => {
    expect(todayIso()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const local = new Date();
    const expected = `${local.getFullYear()}-${String(local.getMonth() + 1).padStart(2, "0")}-${String(local.getDate()).padStart(2, "0")}`;
    expect(todayIso()).toBe(expected);
  });
});

describe("addDays", () => {
  it("adds days across month boundaries", () => {
    expect(addDays("2026-11-15", 14)).toBe("2026-11-29");
    expect(addDays("2026-11-30", 5)).toBe("2026-12-05");
  });
});

describe("nextMonthlyDate", () => {
  it("advances to the billing day of the next month", () => {
    expect(nextMonthlyDate("2026-01-15", 15)).toBe("2026-02-15");
    expect(nextMonthlyDate("2026-12-15", 15)).toBe("2027-01-15");
  });

  it("clamps billing days 29-31 to the end of short months", () => {
    expect(nextMonthlyDate("2026-01-28", 31)).toBe("2026-02-28");
    expect(nextMonthlyDate("2026-02-28", 31)).toBe("2026-03-28");
  });
});
