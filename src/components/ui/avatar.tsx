import { cn } from "@/lib/cn";

export type Role = "student" | "teacher" | "admin";

/**
 * DESIGN.md §Components → Avatars.
 * 32px, initials on primary-container, 10px text, pill radius, with a 2px ring
 * in the role colour: student outline-variant, teacher primary, admin on-surface.
 */
const ROLE_RING: Record<Role, string> = {
  student: "ring-outline-variant",
  teacher: "ring-primary",
  admin: "ring-on-surface",
};

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return (first + last).toUpperCase();
}

export function Avatar({
  name,
  role = "student",
  size = 32,
  className,
}: {
  name: string;
  role?: Role;
  /** Diameter in pixels. 32 is the design default; larger is used in headers. */
  size?: number;
  className?: string;
}) {
  return (
    <span
      title={name}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.3125) }}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-pill",
        "bg-primary-container font-sans font-semibold text-on-primary-container",
        "ring-2 ring-offset-1 ring-offset-surface",
        ROLE_RING[role],
        className,
      )}
    >
      {initialsOf(name)}
    </span>
  );
}
