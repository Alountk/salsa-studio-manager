"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/cn";

const OPTIONS = [
  { value: "todas", label: "Estado: Todas" },
  { value: "pendientes", label: "Estado: Pendientes" },
  { value: "vencidas", label: "Estado: Vencidas" },
  { value: "pagadas", label: "Estado: Pagadas" },
] as const;

/**
 * Status filter for the invoice list: navigating `?estado=` re-queries the
 * repository server-side (`listInvoices(db, filter)`). The designed select
 * keeps its active treatment only when a specific status is chosen.
 */
export function EstadoFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const value = searchParams.get("estado") ?? "todas";
  const filtered = value !== "todas";

  return (
    <div className="relative min-w-[170px]">
      <select
        aria-label="Estado"
        value={value}
        onChange={(event) => {
          const next = event.target.value;
          router.replace(next === "todas" ? "/facturacion" : `/facturacion?estado=${next}`);
        }}
        className={cn(
          "h-11 w-full cursor-pointer appearance-none rounded-sm border pl-3 pr-8 text-body-sm outline-none transition-shadow focus:shadow-[var(--focus-ring-input)]",
          filtered
            ? "border-primary bg-primary-container/40 font-semibold text-primary focus:border-primary"
            : "border-outline-variant bg-surface font-medium text-on-surface focus:border-primary",
        )}
      >
        {OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Icon
        name="arrow_drop_down"
        className={cn(
          "pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xl",
          filtered ? "text-primary" : "text-outline",
        )}
      />
    </div>
  );
}
