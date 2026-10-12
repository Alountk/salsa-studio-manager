import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { FieldShell } from "./input";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
}

/**
 * Native select with the shared field styling. A custom listbox would be
 * specified separately in DESIGN.md if the design needed one; it does not, so
 * the native control keeps keyboard and screen-reader behaviour for free.
 */
export function Select({
  label,
  hint,
  error,
  className,
  id,
  children,
  ...props
}: SelectProps) {
  const fieldId = id ?? props.name;
  return (
    <FieldShell label={label} hint={hint} error={error} htmlFor={fieldId} className={className}>
      <select
        id={fieldId}
        aria-invalid={error ? true : undefined}
        className={cn(
          "h-11 w-full appearance-none rounded-sm border border-outline-variant bg-surface",
          "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22%236b625c%22><path d=%22M7 10l5 5 5-5z%22/></svg>')]",
          "bg-[length:20px_20px] bg-[right_12px_center] bg-no-repeat px-4 py-3 pr-10",
          "font-sans text-body-md text-on-surface outline-none transition-shadow",
          "focus:border-primary focus:shadow-[var(--focus-ring-input)]",
          error
            ? "border-error bg-error-container/40"
            : "border-outline-variant",
          className,
        )}
        {...props}
      >
        {children}
      </select>
    </FieldShell>
  );
}
