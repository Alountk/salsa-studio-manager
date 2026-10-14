import Link from "next/link";
import { Icon, LinkButton } from "@/components/ui";
import { cn } from "@/lib/cn";

/**
 * Design 3, screen 01 — public marketing header: sticky brand bar, centred
 * nav, session link and booking call to action.
 *
 * Destinations follow route mapping IA call 3 (odd/tasks/design-3-billing.md):
 * links whose destination a design covers go to the real route; the rest keep
 * the export's inert `#`, because inventing a page would promise content that
 * does not exist.
 */
const NAV_ITEMS = [
  { label: "Clases", href: "#" },
  { label: "Precios", href: "/tarifas" },
  { label: "Horarios", href: "#" },
  { label: "Profesores", href: "#" },
  { label: "Eventos", href: "#" },
];

function navLinkClass(active: boolean) {
  return cn(
    "text-button transition-colors",
    active
      ? "border-b-2 border-primary pb-1 text-primary"
      : "text-on-surface-variant hover:text-primary",
  );
}

export function SiteHeader({ active = "Precios" }: { active?: string }) {
  return (
    <header className="sticky top-0 z-50 w-full bg-surface shadow-sm">
      <div className="mx-auto flex w-full max-w-[var(--content-max-width)] items-center justify-between gap-6 px-4 py-2 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-headline-md font-display tracking-tight text-primary transition-transform active:scale-95"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-container text-primary shadow-inner">
            <Icon name="music_note" filled className="text-2xl" />
          </span>
          <span>Estudio Salsa</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) =>
            item.href === "#" ? (
              <a
                key={item.label}
                href="#"
                className={navLinkClass(item.label === active)}
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className={navLinkClass(item.label === active)}
                aria-current={item.label === active ? "page" : undefined}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-md px-4 py-2 text-button text-on-surface transition-colors hover:text-primary sm:inline-flex"
          >
            Iniciar Sesión
          </Link>
          <LinkButton href="/login">Reservar Clase</LinkButton>
        </div>
      </div>
    </header>
  );
}
