/**
 * Locale-aware formatting primitives.
 *
 * Each dictionary binds these to its own locale and exposes them as `fmt`,
 * so components never have to carry a locale around with them.
 */

import type { Fmt, Locale } from "./types";

const DAYS_PER_YEAR = 365.25;

const NUMBER_LOCALE: Record<Locale, string> = {
  vi: "vi-VN",
  en: "en-US",
};

/**
 * Unit words. Vietnamese needs a genuinely short form for the receipt's
 * amount column, where "9 năm 4 tháng" would crowd out the item label.
 */
const UNITS = {
  en: { y: "y", m: "m", d: "d", h: "h" },
  vi: { y: "n", m: "th", d: "ng", h: "h" },
} as const;

const LONG_UNITS = {
  en: { year: "year", years: "years", month: "month", months: "months", day: "day", days: "days" },
  vi: { year: "năm", years: "năm", month: "tháng", months: "tháng", day: "ngày", days: "ngày" },
} as const;

/*
 * Fixed month abbreviations rather than Intl's. ICU renders September as both
 * "Sep" and "Sept" depending on its version, so the browser and the OG image
 * renderer could print different dates on the same receipt — and a four-letter
 * month is one character wider than the monospace column allows for.
 */
const MONTHS_EN = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
] as const;

const pad2 = (n: number) => String(n).padStart(2, "0");

function plural(n: number, one: string, many: string) {
  return n === 1 ? one : many;
}

export function round(value: number, places = 0) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

/** Splits a duration in years into whole years + months, or days when tiny. */
function parts(years: number) {
  const months = Math.round(years * 12);
  if (months < 1) {
    const days = Math.round(years * DAYS_PER_YEAR);
    if (days < 1) {
      return { kind: "hours" as const, value: Math.max(1, Math.round(years * DAYS_PER_YEAR * 24)) };
    }
    return { kind: "days" as const, value: days };
  }
  return { kind: "ym" as const, y: Math.floor(months / 12), m: months % 12 };
}

export function makeFmt(locale: Locale): Fmt {
  const nf = new Intl.NumberFormat(NUMBER_LOCALE[locale]);
  const u = UNITS[locale];
  const lu = LONG_UNITS[locale];

  const decimal = (value: number) =>
    new Intl.NumberFormat(NUMBER_LOCALE[locale], { maximumFractionDigits: 2 }).format(value);

  const duration = (years: number): string => {
    if (!Number.isFinite(years) || years <= 0) return `0${u.d}`;
    const p = parts(years);
    if (p.kind === "hours") return `${p.value}${u.h}`;
    if (p.kind === "days") return `${p.value}${u.d}`;
    if (p.y === 0) return `${p.m}${u.m}`;
    if (p.m === 0) return `${p.y}${u.y}`;
    return `${p.y}${u.y} ${p.m}${u.m}`;
  };

  const durationLong = (years: number): string => {
    if (!Number.isFinite(years) || years <= 0) {
      return locale === "vi" ? "không đáng kể" : "no time at all";
    }
    const p = parts(years);
    if (p.kind === "hours" || p.kind === "days") {
      const days = p.kind === "days" ? p.value : 1;
      return `${days} ${plural(days, lu.day, lu.days)}`;
    }
    if (p.y === 0) return `${p.m} ${plural(p.m, lu.month, lu.months)}`;
    if (p.m === 0) return `${p.y} ${plural(p.y, lu.year, lu.years)}`;
    return `${p.y} ${plural(p.y, lu.year, lu.years)} ${p.m} ${plural(p.m, lu.month, lu.months)}`;
  };

  const yearsDecimal = (years: number): string => {
    if (!Number.isFinite(years) || years <= 0) {
      return `0 ${lu.years}`;
    }
    if (years < 1) {
      const months = Math.max(1, Math.round(years * 12));
      return `${months} ${plural(months, lu.month, lu.months)}`;
    }
    const value = round(years, 1);
    return `${decimal(value)} ${plural(value, lu.year, lu.years)}`;
  };

  return {
    duration,
    durationLong,
    yearsDecimal,
    decimal,
    number: (value: number) => nf.format(Math.round(value)),
    ratio: (value: number) => {
      if (value >= 100) return `${nf.format(Math.round(value))}×`;
      if (value >= 10) return `${Math.round(value)}×`;
      return `${decimal(round(value, 1))}×`;
    },
    receiptDate: (date: Date) => {
      const d = pad2(date.getDate());
      const y = date.getFullYear();
      return locale === "vi"
        ? `${d}/${pad2(date.getMonth() + 1)}/${y}`
        : `${d} ${MONTHS_EN[date.getMonth()]} ${y}`;
    },
  };
}

export const DAYS_IN_YEAR = DAYS_PER_YEAR;
