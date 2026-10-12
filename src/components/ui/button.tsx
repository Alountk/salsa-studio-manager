import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./icon";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "default" | "compact";

/**
 * DESIGN.md §Components → Buttons.
 *
 * primary: primary fill, on-primary text, 10px radius, 44px height
 * secondary: surface fill, on-surface text, 1px outline-variant border
 * ghost: no fill or border, on-surface-variant text
 * danger: error fill, on-error text — cancel, void and delete only
 * compact: 36px height for table toolbars and calendar headers
 */
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

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Material Symbols glyph rendered before the label. */
  icon?: string;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "default",
  icon,
  fullWidth = false,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-sans text-button",
        "transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {icon ? <Icon name={icon} className="text-[1.125rem]" /> : null}
      {children}
    </button>
  );
}
