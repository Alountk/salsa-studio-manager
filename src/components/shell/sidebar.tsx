"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui";
import { NAV_ITEMS } from "@/lib/nav";

/**
 * DESIGN.md §Layout → app shell sidebar.
 * 240px, studio mark on top, nav items with icon and label, active item on
 * primary-container with primary text.
 */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegación principal"
      className="sticky top-0 flex h-screen w-[var(--sidebar-width)] shrink-0 flex-col gap-6 border-r border-outline-variant bg-surface px-4 py-6"
    >
      <Link href="/" className="flex items-center gap-2.5 px-2">
        <span
          aria-hidden="true"
          className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-on-primary"
        >
          <Icon name="music_note" className="text-[1.125rem]" />
        </span>
        <span className="font-display text-headline-sm text-on-surface">
          Estudio Salsa
        </span>
      </Link>

      <ul className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-body-md transition-colors",
                  active
                    ? "bg-primary-container font-medium text-primary"
                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface",
                )}
              >
                <Icon name={item.icon} className="text-[1.25rem]" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto rounded-md bg-surface-container p-4">
        <p className="text-label uppercase text-on-surface-variant">Plan actual</p>
        <p className="mt-1 font-display text-headline-sm text-on-surface">
          Mensual Ilimitado
        </p>
        <p className="text-body-sm text-on-surface-variant tabular-figures">
          89,00 €/mes · renueva 01/11/2026
        </p>
      </div>
    </nav>
  );
}
