import type { ButtonHTMLAttributes } from "react";
import { buttonClasses } from "./button-classes";
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
 *
 * Appearance lives in `buttonClasses`, shared with `LinkButton`.
 */
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
      className={buttonClasses({ variant, size, fullWidth, className })}
      {...props}
    >
      {icon ? <Icon name={icon} className="text-[1.125rem]" /> : null}
      {children}
    </button>
  );
}
