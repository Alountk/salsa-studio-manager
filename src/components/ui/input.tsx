import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * DESIGN.md §Components → Inputs, selects and pickers.
 *
 * 44px height, 1px outline-variant border, 6px radius, surface fill.
 * Focus: primary border plus the 3px terracotta ring.
 * Invalid: error border with an error-container tint and a body-sm message.
 * The label sits above the field in `label` style, uppercase, 6px gap.
 */
export interface FieldShellProps {
  label?: string;
  /** Rendered across from the label (e.g. the CVC help button on screen 02). */
  labelAction?: ReactNode;
  hint?: string;
  error?: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}

export function FieldShell({
  label,
  labelAction,
  hint,
  error,
  htmlFor,
  children,
  className,
}: FieldShellProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <div className="flex items-center justify-between gap-2">
          <label
            htmlFor={htmlFor}
            className="text-label uppercase text-on-surface-variant"
          >
            {label}
          </label>
          {labelAction}
        </div>
      ) : null}
      {children}
      {error ? (
        <p className="text-body-sm text-error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-body-sm text-on-surface-variant">{hint}</p>
      ) : null}
    </div>
  );
}

const INVALID =
  "border-error bg-error-container/40 focus:border-error focus:shadow-[0_0_0_3px_rgba(185,28,28,0.22)]";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  /** Rendered across from the label (e.g. the CVC help button on screen 02). */
  labelAction?: ReactNode;
  hint?: string;
  /** Validation message. Presence switches the control to its invalid state. */
  error?: string;
  /**
   * Rendered inside the control, pinned to its right edge (the Visa and
   * Mastercard badges and the CVC lock on screen 02). Non-interactive: the
   * wrapper is pointer-events-none so the underlying input keeps selection.
   */
  endAdornment?: ReactNode;
  /**
   * Monospace stack for reference-like values (card PAN, expiry, CVC, NIF).
   * Swaps the default sans rather than stacking a second font-family utility
   * on top of it, so the winner never depends on stylesheet order.
   */
  mono?: boolean;
  /** Extra classes for the <input> element itself (right padding behind an
   * adornment, tracking on card groups); the label wrapper is untouched. */
  inputClassName?: string;
}

export function Input({
  label,
  labelAction,
  hint,
  error,
  className,
  id,
  endAdornment,
  mono,
  inputClassName,
  ...props
}: InputProps) {
  const fieldId = id ?? props.name;
  const control = cn(
    "h-11 w-full rounded-sm border border-outline-variant bg-surface px-4 py-3 " +
      "text-body-md text-on-surface placeholder:text-on-surface-variant " +
      "outline-none transition-shadow focus:border-primary focus:shadow-[var(--focus-ring-input)]",
    mono ? "font-mono" : "font-sans",
    error && INVALID,
    inputClassName,
  );
  return (
    <FieldShell
      label={label}
      labelAction={labelAction}
      hint={hint}
      error={error}
      htmlFor={fieldId}
      className={className}
    >
      <div className="relative">
        <input id={fieldId} aria-invalid={error ? true : undefined} className={control} {...props} />
        {endAdornment ? (
          <span className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
            {endAdornment}
          </span>
        ) : null}
      </div>
    </FieldShell>
  );
}
