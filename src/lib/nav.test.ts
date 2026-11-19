import { describe, expect, it } from "vitest";
import { NAV_ITEMS, titleForPath } from "./nav";

describe("NAV_ITEMS", () => {
  it("shows exactly the billing trio", () => {
    expect(NAV_ITEMS.map((n) => n.href)).toEqual(["/", "/facturacion", "/alumnos"]);
  });
});

describe("titleForPath", () => {
  it("titles every visible route", () => {
    expect(titleForPath("/")).toBe("Inicio");
    expect(titleForPath("/facturacion")).toBe("Facturación");
    expect(titleForPath("/facturacion/cuotas")).toBe("Cuotas");
    expect(titleForPath("/facturacion/nueva")).toBe("Nueva factura");
    expect(titleForPath("/alumnos")).toBe("Alumnos");
    expect(titleForPath("/alumnos/nuevo")).toBe("Nuevo alumno");
  });

  it("falls back to the longest prefix for nested billing routes", () => {
    expect(titleForPath("/facturacion/facturas/V-2026-0184")).toBe("Facturación");
    expect(titleForPath("/alumnos/42")).toBe("Alumnos");
    expect(titleForPath("/desconocida")).toBe("Estudio Salsa");
  });
});
