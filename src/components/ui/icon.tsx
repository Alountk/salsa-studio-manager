import { cn } from "@/lib/cn";

/**
 * Material Symbols Outlined glyph. The font is loaded in globals.css and the
 * `.material-symbols-outlined` base rules live there too, so this component
 * only supplies the name and optional sizing.
 *
 * Icons are decorative by default: they always sit next to a text label in this
 * design system (DESIGN.md §Accessibility forbids colour- or icon-only state).
 */
export function Icon({
  name,
  className,
  filled = false,
}: {
  name: string;
  className?: string;
  filled?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn("material-symbols-outlined select-none", className)}
      style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
    >
      {name}
    </span>
  );
}
