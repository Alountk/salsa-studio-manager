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
  "/calendario": "Calendario",
  "/clases": "Clases",
  "/alumnos": "Alumnos",
  "/facturacion": "Facturación",
  "/ajustes": "Ajustes",
};

/** Page title shown in the top bar for a pathname. */
export function titleForPath(pathname: string): string {
  return TITLES[pathname] ?? "Estudio Salsa";
}
