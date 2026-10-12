"use client";

import { usePathname } from "next/navigation";
import { Avatar, Icon } from "@/components/ui";
import { titleForPath } from "@/lib/nav";

/**
 * DESIGN.md §Layout → app shell top bar.
 * 64px, page title on the left, search field, notification bell, avatar menu.
 */
export function Topbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 flex h-[var(--topbar-height)] shrink-0 items-center gap-4 border-b border-outline-variant bg-surface px-8">
      <h1 className="font-display text-headline-sm text-on-surface">
        {titleForPath(pathname)}
      </h1>

      <div className="relative ml-auto w-72 max-w-full">
        <Icon
          name="search"
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[1.125rem] text-on-surface-variant"
        />
        <input
          type="search"
          placeholder="Buscar clase, alumno…"
          aria-label="Buscar"
          className="h-9 w-full rounded-sm border border-outline-variant bg-surface pr-3 pl-9 text-body-sm text-on-surface placeholder:text-on-surface-variant outline-none transition-shadow focus:border-primary focus:shadow-[var(--focus-ring-input)]"
        />
      </div>

      <button
        type="button"
        aria-label="Notificaciones, 3 sin leer"
        className="relative flex h-9 w-9 items-center justify-center rounded-md text-on-surface-variant transition-colors hover:bg-surface-container-low focus-visible:shadow-[var(--focus-ring)]"
      >
        <Icon name="notifications" className="text-[1.25rem]" />
        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-pill bg-primary" />
      </button>

      <div className="flex items-center gap-2">
        <Avatar name="Lucía Moreno" role="student" size={32} />
        <div className="hidden flex-col leading-tight sm:flex">
          <span className="text-body-sm font-medium text-on-surface">Lucía Moreno</span>
          <span className="text-label uppercase text-on-surface-variant">Alumno</span>
        </div>
      </div>
    </header>
  );
}
