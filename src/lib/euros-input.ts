/**
 * User-typed euro amounts → integer cents. Kept dependency-free so client
 * forms can compute live IVA/total hints without pulling server modules.
 */

/**
 * Accepts `45`, `45.50`, `45,50`, `1.234,56`; rejects empty/garbage/negative
 * with `null`. Spanish format wins when a comma is present.
 */
export function parseEuros(raw: string): number | null {
  const normalized = raw.trim().replace(/\s/g, "");
  if (normalized === "") return null;

  const value = normalized.includes(",")
    ? normalized.replace(/\./g, "").replace(",", ".")
    : normalized;

  if (!/^\d+(\.\d+)?$/.test(value)) return null;
  const cents = Math.round(Number(value) * 100);
  return cents > 0 ? cents : null;
}
