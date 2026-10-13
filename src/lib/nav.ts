/**
 * Sidebar navigation and page titles, shared by every authenticated route.
 *
 * The six entries and their order come from the app shell described in
 * DESIGN.md §Layout and repeated in every screen prompt of design-plan.mjs.
 * Four sections (Calendario, Clases, Alumnos, Facturación) belong to Designs 2
 * and 3; they ship as explicit placeholders until those features land, so the
 * shell never links to a 404.
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
  "/facturacion": "Facturación",
  "/ajustes": "Ajustes",
};

/**
 * Page title shown in the top bar for a pathname.
 *
 * Exact match first, then the longest prefix, so a nested route such as
 * `/clases/nueva` reads "Nueva clase" instead of falling through to the brand
 * — which is what it did before this took sub-paths into account.
 */
export function titleForPath(pathname: string): string {
  const exact = TITLES[pathname];
  if (exact) return exact;

  const prefixes = Object.keys(TITLES)
    .filter((key) => key !== "/" && pathname.startsWith(`${key}/`))
    .sort((a, b) => b.length - a.length);

  return prefixes.length > 0 ? (TITLES[prefixes[0]] as string) : "Estudio Salsa";
}
