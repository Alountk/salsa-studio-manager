import { cn } from "@/lib/cn";

/**
 * DESIGN.md §Components → Credits ring.
 * A progress ring in primary on surface-container-highest, with the remaining
 * count as a headline-md value in the centre.
 *
 * `value` and `total` are unitless counts (credits, classes); the arc is the
 * share of `total`. The centre slot is supplied by the caller so it can carry
 * its own units and label.
 */
export function ProgressRing({
  value,
  total,
  size = 96,
  stroke = 8,
  className,
  children,
}: {
  value: number;
  total: number;
  size?: number;
  stroke?: number;
  className?: string;
  children?: React.ReactNode;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const ratio = total > 0 ? Math.min(Math.max(value / total, 0), 1) : 0;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${value} de ${total}`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-surface-container-highest"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - ratio)}
          className="stroke-primary transition-[stroke-dashoffset] duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}
