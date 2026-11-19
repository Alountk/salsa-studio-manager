/**
 * Sidebar navigation and page titles, shared by every authenticated route.
 *
 * The six entries and their order come from the app shell described in
 * DESIGN.md §Layout and repeated in every screen prompt of design-plan.mjs.
 * Calendario and Clases belong to Design 2 and Facturación to Design 3; all of
 * them link to their real routes now that those features have landed.
 */
export interface NavItem {
  href: string;
  label: string;
  icon: string;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Inicio", icon: "home" },
  { href: "/calendario", label: "Calendario", icon: "calendar_month" },
  { href: "/clases", label: "Clases", icon: "school" },
  { href: "/alumnos", label: "Alumnos", icon: "group" },
  { href: "/facturacion", label: "Facturación", icon: "receipt_long" },
  { href: "/ajustes", label: "Ajustes", icon: "settings" },
];

const TITLES: Record<string, string> = {
  "/": "Inicio",
  "/calendario/mis-reservas": "Mis reservas",
  "/calendario": "Calendario",
  "/clases/nueva": "Nueva clase",
  "/clases/disponibilidad": "Disponibilidad",
  "/clases/lista": "Lista y asistencia",
  "/clases/mi-semana": "Mi semana",
  "/clases": "Clases",
  "/alumnos": "Alumnos",
  "/facturacion": "Mi facturación",
  "/facturacion/facturas": "Facturación",
  "/facturacion/facturas/V-2026-0184": "Facturación › Detalle de Comprobante",
  "/ajustes": "Ajustes",
};

/**
 * Role-specific overrides for a pathname (Design 3 route mapping IA call 1):
 * `/facturacion` is the student billing area by default and the admin revenue
 * dashboard with `?rol=administracion`, so its top-bar title follows the role.
 * `?rol=profesor` falls back to the student screen, hence no override.
 */
const ROLE_TITLES: Record<string, Record<string, string>> = {
  "/facturacion": { administracion: "Ingresos" },
};

/**
 * Page title shown in the top bar for a pathname, optionally role-aware.
 *
 * Exact match first, then the longest prefix, so a nested route such as
 * `/clases/nueva` reads "Nueva clase" instead of falling through to the brand
 * — which is what it did before this took sub-paths into account. When a
 * `rol` query value maps the pathname to a different designed screen (only
 * `/facturacion` today), the override wins over the plain title.
 */
export function titleForPath(pathname: string, rol?: string | null): string {
  const exact = TITLES[pathname];
  if (exact) {
    const override = rol ? ROLE_TITLES[pathname]?.[rol] : undefined;
    return override ?? exact;
  }

  const prefixes = Object.keys(TITLES)
    .filter((key) => key !== "/" && pathname.startsWith(`${key}/`))
    .sort((a, b) => b.length - a.length);

  return prefixes.length > 0 ? (TITLES[prefixes[0]] as string) : "Estudio Salsa";
}
