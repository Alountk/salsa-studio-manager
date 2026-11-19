import { cn } from "@/lib/cn";
import type { ButtonSize, ButtonVariant } from "./button";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-pressed focus-visible:shadow-[var(--focus-ring)]",
  secondary:
    "border border-outline-variant bg-surface text-on-surface hover:bg-surface-container focus-visible:shadow-[var(--focus-ring)]",
  ghost:
    "text-on-surface-variant hover:bg-surface-container-low focus-visible:shadow-[var(--focus-ring)]",
  danger:
    "bg-error text-on-error hover:bg-on-error-container focus-visible:shadow-[var(--focus-ring)]",
};

const SIZES: Record<ButtonSize, string> = {
  default: "min-h-11 px-5 py-3",
  compact: "min-h-9 px-3 py-2",
};

/**
 * The one place a button's appearance is described.
 *
 * Shared by `Button` (a real `<button>`) and `LinkButton` (an `<a>`), so a link
 * that looks like a button does not have to nest an interactive element inside
 * an anchor — which is what `<Link><Button /></Link>` did, and what was invalid
 * HTML in three places before this existed.
 */
export function buttonClasses({
  variant = "primary",
  size = "default",
  fullWidth = false,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
} = {}): string {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-md font-sans text-button",
    "transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    VARIANTS[variant],
    SIZES[size],
    fullWidth && "w-full",
    className,
  );
}
