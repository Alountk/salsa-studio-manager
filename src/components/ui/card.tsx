import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * DESIGN.md §Components → Cards and metrics.
 * Surface fill, 1px outline-variant border, 14px radius, card elevation, 24px
 * padding, optional header row with a headline-sm title and a ghost action.
 */
export function Card({
  children,
  className,
  as: Tag = "section",
}: {
  children: ReactNode;
  className?: string;
  as?: "section" | "div" | "article" | "aside";
}) {
  return (
    <Tag
      className={cn(
        "rounded-lg border border-outline-variant bg-surface p-6 shadow-card",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({
  title,
  action,
  className,
}: {
  title: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "mb-4 flex items-start justify-between gap-4",
        className,
      )}
    >
      <h2 className="text-headline-sm text-on-surface">{title}</h2>
      {action}
    </header>
  );
}
