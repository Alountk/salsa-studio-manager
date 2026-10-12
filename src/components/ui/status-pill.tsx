import { cn } from "@/lib/cn";
import { Icon } from "./icon";

/**
 * DESIGN.md §Components → Status pills.
 *
 * Rounded, icon plus text, label type, tinted background. Status is never
 * communicated by colour alone — every pill carries an icon and a word
 * (§Accessibility).
 */
export type StatusKind =
  | "paid"
  | "pending"
  | "overdue"
  | "cancelled"
  | "draft"
  | "waitlist"
  | "present"
  | "absent"
  | "late"
  | "confirmed"
  | "unassigned"
  | "conflict";

type Tone = "success" | "warning" | "error" | "info" | "neutral";

const TONES: Record<Tone, string> = {
  success: "bg-secondary-container text-on-secondary-container",
  warning: "bg-tertiary-container text-on-tertiary-container",
  error: "bg-error-container text-on-error-container",
  info: "bg-info-container text-info",
  neutral: "bg-surface-container text-on-surface-variant",
};

const STATUSES: Record<StatusKind, { label: string; icon: string; tone: Tone }> = {
  paid: { label: "Pagada", icon: "check_circle", tone: "success" },
  pending: { label: "Pendiente", icon: "schedule", tone: "warning" },
  overdue: { label: "Vencida", icon: "error", tone: "error" },
  cancelled: { label: "Cancelada", icon: "block", tone: "neutral" },
  draft: { label: "Borrador", icon: "edit_note", tone: "neutral" },
  waitlist: { label: "Lista de espera", icon: "hourglass_empty", tone: "info" },
  present: { label: "Presente", icon: "person_check", tone: "success" },
  absent: { label: "Ausente", icon: "person_off", tone: "error" },
  late: { label: "Retraso", icon: "timer", tone: "warning" },
  confirmed: { label: "Confirmada", icon: "verified", tone: "success" },
  unassigned: { label: "Sin asignar", icon: "person_search", tone: "warning" },
  conflict: { label: "Conflicto", icon: "warning", tone: "error" },
};

export function StatusPill({
  status,
  className,
  /** Override the label, e.g. a role-specific wording of the same state. */
  label,
}: {
  status: StatusKind;
  className?: string;
  label?: string;
}) {
  const entry = STATUSES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-pill px-2 py-1 text-label uppercase",
        TONES[entry.tone],
        className,
      )}
    >
      <Icon name={entry.icon} className="text-[0.875rem]" />
      {label ?? entry.label}
    </span>
  );
}
