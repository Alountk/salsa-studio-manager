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
  hint?: string;
  error?: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}

export function FieldShell({
  label,
  hint,
  error,
  htmlFor,
  children,
  className,
}: FieldShellProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <label
          htmlFor={htmlFor}
          className="text-label uppercase text-on-surface-variant"
        >
          {label}
        </label>
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

const CONTROL =
  "h-11 w-full rounded-sm border border-outline-variant bg-surface px-4 py-3 " +
  "font-sans text-body-md text-on-surface placeholder:text-on-surface-variant " +
  "outline-none transition-shadow focus:border-primary focus:shadow-[var(--focus-ring-input)]";
const INVALID =
  "border-error bg-error-container/40 focus:border-error focus:shadow-[0_0_0_3px_rgba(185,28,28,0.22)]";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  /** Validation message. Presence switches the control to its invalid state. */
  error?: string;
}

export function Input({ label, hint, error, className, id, ...props }: InputProps) {
  const fieldId = id ?? props.name;
  return (
    <FieldShell label={label} hint={hint} error={error} htmlFor={fieldId} className={className}>
      <input
        id={fieldId}
        aria-invalid={error ? true : undefined}
        className={cn(CONTROL, error && INVALID)}
        {...props}
      />
    </FieldShell>
  );
}
