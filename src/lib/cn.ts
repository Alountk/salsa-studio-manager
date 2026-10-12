/**
 * Minimal class-name joiner. Deliberately dependency-free: the design system has
 * no conditional logic beyond truthiness, so clsx/tailwind-merge would be
 * machinery without a job.
 */
export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}
