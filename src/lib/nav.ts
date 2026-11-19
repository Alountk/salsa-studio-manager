/**
 * Sidebar navigation and page titles, shared by every authenticated route.
 *
 * The three entries are the whole visible product after the billing
 * simplification (spec S2): Inicio, Facturación, Alumnos. Hidden sections
 * (calendario, clases, ajustes, tarifas, registro, recuperar) stay in the
 * codebase but are unreachable — `src/proxy.ts` redirects them.
 */
export interface NavItem {
  href: string;
  label: string;
  icon: string;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Inicio", icon: "home" },
  { href: "/facturacion", label: "Facturación", icon: "receipt_long" },
  { href: "/alumnos", label: "Alumnos", icon: "group" },
];

const TITLES: Record<string, string> = {
  "/": "Inicio",
  "/facturacion": "Facturación",
  "/facturacion/cuotas": "Cuotas",
  "/facturacion/nueva": "Nueva factura",
  "/facturacion/facturas": "Facturación",
  "/alumnos": "Alumnos",
  "/alumnos/nuevo": "Nuevo alumno",
  "/calendario/mis-reservas": "Mis reservas",
  "/calendario": "Calendario",
  "/clases/nueva": "Nueva clase",
  "/clases/disponibilidad": "Disponibilidad",
  "/clases/lista": "Lista y asistencia",
  "/clases/mi-semana": "Mi semana",
  "/clases": "Clases",
  "/ajustes": "Ajustes",
};

/**
 * Page title shown in the top bar for a pathname.
 *
 * Exact match first, then the longest prefix, so a nested route such as
 * `/facturacion/facturas/V-2026-0184` reads "Facturación" instead of falling
 * through to the brand. Role-aware titles ended with the role homes (S2).
 */
export function titleForPath(pathname: string): string {
  const exact = TITLES[pathname];
  if (exact) return exact;

  const prefixes = Object.keys(TITLES)
    .filter((key) => key !== "/" && pathname.startsWith(`${key}/`))
    .sort((a, b) => b.length - a.length);

  return prefixes.length > 0 ? (TITLES[prefixes[0]] as string) : "Estudio Salsa";
}
