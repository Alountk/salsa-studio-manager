/**
 * ISO date helpers shared by the billing repositories and forms.
 *
 * Dates are plain `YYYY-MM-DD` strings end to end; no `Date` parsing happens
 * on local-time inputs, so timezone shifts can never move an invoice a day.
 */

/** Today in the local timezone as `YYYY-MM-DD`. */
export function todayIso(): string {
  return new Intl.DateTimeFormat("en-CA").format(new Date());
}

/** `"2026-11-19"` → `"19/11/2026"` (display format used across the UI). */
export function formatEs(iso: string): string {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

/** Add whole days to an ISO date (UTC-based, DST-free). */
export function addDays(iso: string, days: number): string {
  const date = new Date(`${iso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/**
 * The next occurrence of `billingDay` after `fromIso`'s month.
 *
 * `billingDay` is clamped to 1..28 so the target always exists: a cuota on
 * day 31 bills on the 28th of February, never skipping or doubling.
 */
export function nextMonthlyDate(fromIso: string, billingDay: number): string {
  const [year, month] = fromIso.split("-").map(Number);
  const day = Math.min(Math.max(billingDay, 1), 28);
  const nextYear = month === 12 ? (year as number) + 1 : (year as number);
  const nextMonth = month === 12 ? 1 : (month as number) + 1;
  return `${nextYear}-${String(nextMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
