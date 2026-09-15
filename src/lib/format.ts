/** Formatting helpers. Every duration in the app is a number of years. */

const DAYS_PER_YEAR = 365.25;

/**
 * "9y 4m" / "8m" / "12d". Durations below a month drop to days so that tiny
 * line items (four minutes of exercise a week) still read as something real.
 */
export function formatDuration(years: number): string {
  if (!Number.isFinite(years) || years <= 0) return "0d";

  const months = Math.round(years * 12);
  if (months < 1) {
    const days = Math.round(years * DAYS_PER_YEAR);
    if (days < 1) {
      const hours = Math.round(years * DAYS_PER_YEAR * 24);
      return `${Math.max(hours, 1)}h`;
    }
    return `${days}d`;
  }

  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${m}m`;
  if (m === 0) return `${y}y`;
  return `${y}y ${m}m`;
}

/** "9 years 4 months" — for headlines and share copy. */
export function formatDurationLong(years: number): string {
  if (!Number.isFinite(years) || years <= 0) return "no time at all";

  const months = Math.round(years * 12);
  if (months < 1) {
    const days = Math.max(1, Math.round(years * DAYS_PER_YEAR));
    return `${days} ${plural(days, "day")}`;
  }

  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${m} ${plural(m, "month")}`;
  if (m === 0) return `${y} ${plural(y, "year")}`;
  return `${y} ${plural(y, "year")} ${m} ${plural(m, "month")}`;
}

/**
 * "9.4 years" — the punchier form used on share cards. A value that rounds to
 * a whole number loses the decimal, so nothing ever reads "15.0 years".
 */
export function formatYearsDecimal(years: number): string {
  if (years < 1) {
    const months = Math.max(1, Math.round(years * 12));
    return `${months} ${plural(months, "month")}`;
  }
  const value = round(years, 1);
  return `${value} ${plural(value, "year")}`;
}

export function plural(n: number, word: string) {
  return n === 1 ? word : `${word}s`;
}

export function round(value: number, places = 0) {
  const f = 10 ** places;
  return Math.round(value * f) / f;
}

const numberFormat = new Intl.NumberFormat("en-US");

export function formatNumber(value: number) {
  return numberFormat.format(Math.round(value));
}

/** "3.2×" — ratios are only ever shown when they are meaningfully above 1. */
export function formatRatio(ratio: number) {
  if (ratio >= 100) return `${formatNumber(ratio)}×`;
  if (ratio >= 10) return `${round(ratio, 0)}×`;
  return `${round(ratio, 1)}×`;
}

export function formatHours(hours: number) {
  const rounded = round(hours, 2);
  return Number.isInteger(rounded) ? `${rounded}` : `${rounded}`;
}

/** "SEPTEMBER 2026" — the receipt's issue date. */
export function formatReceiptDate(date: Date) {
  return date
    .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    .toUpperCase();
}

export const DAYS_IN_YEAR = DAYS_PER_YEAR;
