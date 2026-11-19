import { describe, expect, it } from "vitest";
import { parseStudentForm } from "./student-actions";

describe("parseStudentForm", () => {
  it("accepts a form with a name and trims it", () => {
    expect(
      parseStudentForm({
        name: "  Ana García  ",
        email: " ana@example.com ",
        phone: "",
        notes: " Prefiere tardes ",
      }),
    ).toEqual({ ok: true });
  });

  it("rejects empty or whitespace-only names", () => {
    for (const name of ["", "   ", "\t\n"]) {
      expect(parseStudentForm({ name, email: "", phone: "", notes: "" })).toEqual({
        ok: false,
        error: "El nombre es obligatorio",
      });
    }
  });
});
