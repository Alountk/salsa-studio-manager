import { Icon } from "@/components/ui";
import { COMPARE_HEADER, PLAN_COMPARISON, type CompareCell } from "@/lib/billing";
import { cn } from "@/lib/cn";

/**
 * Design 3, screen 01 — the five-row plan comparison table (S1).
 *
 * Hand-rolled instead of the ui/Table primitives: the design's headers are
 * sentence-case headline-sm (the primitive forces uppercase label style) and
 * the highlighted middle column needs a per-cell tint the primitives do not
 * carry. Row and cell conventions (48px rows, tabular figures, teal checks)
 * still follow DESIGN.md §Tables.
 */
function Cell({ cell, highlighted }: { cell: CompareCell; highlighted: boolean }) {
  const tint = highlighted ? "bg-primary-container/20" : undefined;

  if (cell.kind === "check") {
    return (
      <td className={cn("px-6 py-4 text-center", tint)}>
        {cell.note ? (
          <span className="inline-flex items-center gap-1.5 text-body-sm font-semibold text-secondary">
            <Icon name="check" className="text-lg" />
            {cell.note}
          </span>
        ) : (
          <Icon name="check_circle" className="text-2xl text-secondary" />
        )}
      </td>
    );
  }

  if (cell.kind === "dash") {
    return (
      <td className={cn("px-6 py-4 text-center text-lg text-on-surface-variant", tint)}>
        —
      </td>
    );
  }

  return (
    <td className={cn("px-6 py-4 text-center", tint)}>
      <span
        className={cn(
          "text-label-tabular",
          cell.emphasis === "strong" && "font-semibold text-on-surface",
          cell.emphasis === "accent" && "font-bold text-primary",
          !cell.emphasis && "text-on-surface-variant",
        )}
      >
        {cell.value}
      </span>
    </td>
  );
}

export function ComparisonTable() {
  return (
    <section className="mb-24">
      <div className="mb-8 max-w-3xl">
        <h2 className="mb-2 font-display text-headline-lg text-on-surface">
          Comparativa de planes y beneficios
        </h2>
        <p className="text-body-md text-on-surface-variant">
          Compara detalladamente las prestaciones de cada formato para encontrar
          la fórmula que mejor se adapte a tu nivel y disponibilidad semanal.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-outline-variant bg-surface shadow-card">
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-surface-container text-on-surface">
                <th
                  scope="col"
                  className="w-2/5 px-6 py-4 font-display text-headline-sm"
                >
                  {COMPARE_HEADER[0]}
                </th>
                <th
                  scope="col"
                  className="w-1/5 px-6 py-4 text-center font-display text-headline-sm"
                >
                  {COMPARE_HEADER[1]}
                </th>
                <th
                  scope="col"
                  className="w-1/5 bg-primary-container/40 px-6 py-4 text-center font-display text-headline-sm text-primary"
                >
                  {COMPARE_HEADER[2]}
                </th>
                <th
                  scope="col"
                  className="w-1/5 px-6 py-4 text-center font-display text-headline-sm"
                >
                  {COMPARE_HEADER[3]}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {PLAN_COMPARISON.map((row) => (
                <tr
                  key={row.feature}
                  className="transition-colors hover:bg-surface-container-low"
                >
                  <td className="px-6 py-4 text-body-md font-medium text-on-surface">
                    {row.feature}
                  </td>
                  {row.cells.map((cell, index) => (
                    <Cell key={index} cell={cell} highlighted={index === 1} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
