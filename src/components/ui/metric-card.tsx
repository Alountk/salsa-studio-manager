import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * DESIGN.md §Components → Metric cards.
 * Uppercase label caption, metric value in Outfit tabular figures, a delta chip
 * in teal or error, and an optional sparkline slot.
 */
export function MetricCard({
  label,
  value,
  delta,
  hint,
  className,
}: {
  label: string;
  value: ReactNode;
  delta?: { label: string; tone: "positive" | "negative" };
  hint?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-lg border border-outline-variant bg-surface p-6 shadow-card",
        className,
      )}
    >
      <p className="text-label uppercase text-on-surface-variant">{label}</p>
      <div className="flex items-baseline gap-3">
        <span className="font-display text-metric tabular-figures text-on-surface">
          {value}
        </span>
        {delta ? (
          <span
            className={cn(
              "rounded-pill px-2 py-0.5 text-label tabular-figures",
              delta.tone === "positive"
                ? "bg-secondary-container text-on-secondary-container"
                : "bg-error-container text-on-error-container",
            )}
          >
            {delta.label}
          </span>
        ) : null}
      </div>
      {hint ? (
        <p className="text-body-sm text-on-surface-variant">{hint}</p>
      ) : null}
    </div>
  );
}
