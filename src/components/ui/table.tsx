import type { ReactNode, TdHTMLAttributes, ThHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * DESIGN.md §Components → Tables.
 * 48px rows, sticky header on surface-container in label style, outline-variant
 * dividers, no zebra striping. Numeric and currency columns are right-aligned
 * with tabular figures. Row hover is primary-container at 40% opacity.
 *
 * These are presentational pieces; each screen composes its own rows so the
 * table never needs to know about invoices versus attendance.
 */
export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full border-collapse text-left">{children}</table>
    </div>
  );
}

export function THead({ children }: { children: ReactNode }) {
  return (
    <thead className="sticky top-0 z-10 bg-surface-container">
      <tr className="border-b border-outline-variant">{children}</tr>
    </thead>
  );
}

export function TH({
  numeric = false,
  className,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement> & { numeric?: boolean }) {
  return (
    <th
      scope="col"
      className={cn(
        "px-4 py-3 text-label uppercase text-on-surface-variant",
        numeric && "text-right tabular-figures",
        className,
      )}
      {...props}
    />
  );
}

export function TBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TR({
  children,
  className,
  marked = false,
}: {
  children: ReactNode;
  className?: string;
  /** Overdue rows carry a 3px error left border as well as their pill. */
  marked?: boolean;
}) {
  return (
    <tr
      className={cn(
        "border-b border-outline-variant transition-colors",
        "hover:bg-primary-container/40",
        marked && "border-l-[3px] border-l-error",
        className,
      )}
    >
      {children}
    </tr>
  );
}

export function TD({
  numeric = false,
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement> & { numeric?: boolean }) {
  return (
    <td
      className={cn(
        "h-12 px-4 py-2 text-body-md text-on-surface",
        numeric && "text-right tabular-figures",
        className,
      )}
      {...props}
    />
  );
}
