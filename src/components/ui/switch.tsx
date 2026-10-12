"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * DESIGN.md §Components → toggles (pill radius).
 * Used by profile notification preferences and the "Renovación automática"
 * switch.
 *
 * Deliberately controlled with local state rather than `peer-checked`: the knob
 * is a descendant of the track, so a sibling-based variant can never reach it.
 * The real checkbox stays in the DOM with `sr-only` so keyboard, focus and
 * assistive technology behaviour is native.
 */
export function Switch({
  label,
  description,
  defaultChecked = false,
  disabled = false,
  name,
  className,
  onChange,
}: {
  label: string;
  description?: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  name?: string;
  className?: string;
  onChange?: (checked: boolean) => void;
}) {
  const id = useId();
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-start justify-between gap-4",
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      <span className="flex flex-col gap-0.5">
        <span className="text-body-md text-on-surface">{label}</span>
        {description ? (
          <span className="text-body-sm text-on-surface-variant">{description}</span>
        ) : null}
      </span>

      <input
        id={id}
        type="checkbox"
        name={name}
        role="switch"
        checked={checked}
        disabled={disabled}
        onChange={(event) => {
          setChecked(event.target.checked);
          onChange?.(event.target.checked);
        }}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={cn(
          "relative mt-0.5 h-6 w-11 shrink-0 rounded-pill transition-colors",
          "peer-focus-visible:shadow-[var(--focus-ring)]",
          checked ? "bg-primary" : "bg-surface-container-highest",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-5 w-5 rounded-pill bg-surface shadow-card transition-transform",
            checked && "translate-x-5",
          )}
        />
      </span>
    </label>
  );
}
