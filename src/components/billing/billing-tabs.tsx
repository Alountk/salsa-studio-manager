"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const TABS = [
  { href: "/facturacion", label: "Facturas" },
  { href: "/facturacion/cuotas", label: "Cuotas" },
];

/**
 * Tabs for the billing area: Facturas (T10) and Cuotas (T11). The Cuotas
 * route lands with T11 — the tab is part of the area's navigation contract.
 */
export function BillingTabs() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 border-b border-outline-variant" aria-label="Facturación">
      {TABS.map((tab) => {
        const active =
          tab.href === "/facturacion"
            ? pathname === "/facturacion" || pathname.startsWith("/facturacion/facturas") || pathname.startsWith("/facturacion/nueva")
            : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "border-b-2 px-4 py-2.5 text-body-sm font-medium transition-colors",
              active
                ? "border-primary text-primary"
                : "border-transparent text-on-surface-variant hover:text-on-surface",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
