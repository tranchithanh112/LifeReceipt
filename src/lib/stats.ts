/**
 * Picks the few numbers most likely to make someone stop scrolling and read.
 *
 * Every candidate declares a priority; only candidates that clear their own
 * "is this actually interesting?" test are emitted, and at most one stat per
 * `family` survives so the list never repeats the same idea twice.
 */

import type { LifeResult, LineItem } from "./calc";
import {
  formatDuration,
  formatNumber,
  formatRatio,
  formatYearsDecimal,
  plural,
  round,
} from "./format";

export interface Stat {
  id: string;
  /** The big number. Kept short — it is set at display size. */
  value: string;
  /** The sentence that gives the number its sting. */
  text: string;
  priority: number;
  family: string;
}

const SCREEN_IDS = ["social", "streaming", "gaming"];

function sum(items: LineItem[], key: "yearsSpent" | "yearsRemaining" | "yearsLifetime") {
  return items.reduce((total, item) => total + item[key], 0);
}

export function buildStats(result: LifeResult, limit = 5): Stat[] {
  const { age, lifeExpectancy, yearsRemaining, byId, items } = result;
  const candidates: Stat[] = [];

  const push = (stat: Stat | null) => {
    if (stat) candidates.push(stat);
  };

  const q = result.questionable;
  const sleep = byId.sleep;
  const work = byId.work;
  const commute = byId.commute;
  const exercise = byId.exercise;
  const loved = byId.loved;
  const screens = items.filter((item) => SCREEN_IDS.includes(item.id));

  // --- Future projections: the single most shareable shape ---
  if (q && q.yearsRemaining >= 0.25) {
    push({
      id: "future-questionable",
      value: formatDuration(q.yearsRemaining),
      text: `more ${gerund(q)} between now and ${lifeExpectancy}, if nothing changes.`,
      priority: 100,
      family: "future",
    });
  }

  if (q && q.yearsLifetime >= 1) {
    push({
      id: "lifetime-questionable",
      value: formatYearsDecimal(q.yearsLifetime),
      text: `is what ${gerund(q)} costs you across one entire life.`,
      priority: 94,
      family: "lifetime",
    });
  }

  // --- What is actually left after the unavoidable parts ---
  const committed =
    (sleep?.yearsRemaining ?? 0) +
    (work?.yearsRemaining ?? 0) +
    (commute?.yearsRemaining ?? 0);
  const free = yearsRemaining - committed;
  if (yearsRemaining > 1 && free > 0.5 && (sleep || work)) {
    push({
      id: "free-time",
      value: formatDuration(free),
      text: `of genuinely unclaimed time left, once sleep, work and commuting take their cut.`,
      priority: 98,
      family: "budget",
    });
  }

  // --- Screens, combined ---
  if (screens.length >= 2) {
    const screenLifetime = sum(screens, "yearsLifetime");
    if (screenLifetime >= 3) {
      push({
        id: "screens-lifetime",
        value: formatYearsDecimal(screenLifetime),
        text: "of your one life will happen behind a pane of glass.",
        priority: 96,
        family: "screens",
      });
    }
  }

  // --- Annualised: makes a "small" daily habit land ---
  if (q && q.daysPerYear >= 7) {
    push({
      id: "per-year",
      value: `${formatNumber(q.hoursPerYear)} hours`,
      text: `a year ${verbFor(q)} — ${formatNumber(q.daysPerYear)} entire days, every single year.`,
      priority: 90,
      family: "annual",
    });
  }

  // --- Ratios: the most quotable stat shape there is ---
  push(ratioStat(q, exercise, "exercising", 88));
  push(ratioStat(q, loved, "with the people you love", 92));
  if (!q) push(ratioStat(byId.streaming, exercise, "exercising", 70));

  // --- The budget you have left ---
  if (result.daysRemaining > 0) {
    push({
      id: "days-left",
      value: formatNumber(result.daysRemaining),
      text: `days left until you turn ${lifeExpectancy}. That is the entire remaining budget.`,
      priority: 86,
      family: "budget-days",
    });
  }

  // --- Sleep: enormous, unavoidable, still shocking ---
  if (sleep && sleep.yearsLifetime >= 5) {
    push({
      id: "sleep-lifetime",
      value: formatYearsDecimal(sleep.yearsLifetime),
      text: "spent asleep by the end. The largest purchase you will never remember.",
      priority: 78,
      family: "sleep",
    });
  }

  // --- Work ---
  if (work && work.yearsLifetime >= 5) {
    push({
      id: "work-lifetime",
      value: formatYearsDecimal(work.yearsLifetime),
      text: "of your life handed to work. Hopefully you like it.",
      priority: 74,
      family: "work",
    });
  }

  // --- Commute: small daily numbers, absurd lifetime numbers ---
  if (commute && commute.yearsLifetime >= 1) {
    push({
      id: "commute-lifetime",
      value: formatDuration(commute.yearsLifetime),
      text: "in transit. Not travelling anywhere interesting. Commuting.",
      priority: 76,
      family: "commute",
    });
  }

  // --- Already gone ---
  if (q && age > 0 && q.shareOfLife >= 0.04) {
    push({
      id: "share-so-far",
      value: `${round(q.shareOfLife * 100, 1)}%`,
      text: `of every year you have ever lived has already gone ${verbFor(q)}.`,
      priority: 84,
      family: "share",
    });
  }

  // --- Exercise, when it is conspicuously absent ---
  if (exercise && exercise.hoursPerDay > 0 && exercise.yearsLifetime < 1 && q) {
    push({
      id: "exercise-tiny",
      value: formatDuration(exercise.yearsLifetime),
      text: `of exercise across a whole lifetime, against ${formatDuration(
        q.yearsLifetime,
      )} ${verbFor(q)}.`,
      priority: 80,
      family: "exercise",
    });
  }

  return dedupe(candidates).slice(0, limit);
}

/** Bare -ing form: reads correctly after "more …" and "X× more of your life …". */
function gerund(item: LineItem): string {
  switch (item.id) {
    case "social":
      return "scrolling";
    case "streaming":
      return "streaming";
    case "gaming":
      return "gaming";
    case "commute":
      return "commuting";
    case "work":
      return "working";
    case "sleep":
      return "asleep";
    default:
      return item.label.toLowerCase();
  }
}

/** Prepositional form: reads correctly after "a year …" and "already gone …". */
function verbFor(item: LineItem): string {
  switch (item.id) {
    case "social":
    case "streaming":
    case "gaming":
    case "commute":
    case "work":
    case "sleep":
      return gerund(item);
    default:
      return `on ${item.label.toLowerCase()}`;
  }
}

function ratioStat(
  a: LineItem | undefined | null,
  b: LineItem | undefined | null,
  bPhrase: string,
  basePriority: number,
): Stat | null {
  if (!a || !b) return null;
  if (b.hoursPerDay <= 0 || a.hoursPerDay <= 0) return null;
  const ratio = a.hoursPerDay / b.hoursPerDay;
  if (ratio < 1.8) return null;
  return {
    id: `ratio-${a.id}-${b.id}`,
    value: formatRatio(ratio),
    text: `more of your life goes ${gerund(a)} than ${bPhrase}.`,
    // A more extreme ratio is a more interesting stat.
    priority: basePriority + Math.min(8, Math.log2(ratio) * 3),
    family: "ratio",
  };
}

function dedupe(candidates: Stat[]): Stat[] {
  const seenFamily = new Set<string>();
  return candidates
    .sort((a, b) => b.priority - a.priority)
    .filter((stat) => {
      if (seenFamily.has(stat.family)) return false;
      seenFamily.add(stat.family);
      return true;
    });
}

/** The one-sentence punchline baked into share cards and share text. */
export function buildPunchline(result: LifeResult): string {
  const q = result.questionable;
  if (q && q.yearsLifetime >= 1) {
    return `Apparently I’ll spend ${formatYearsDecimal(
      q.yearsLifetime,
    )} of my life ${gerund(q)}.`;
  }
  const sleep = result.byId.sleep;
  if (sleep && sleep.yearsLifetime >= 1) {
    return `Apparently I’ll spend ${formatYearsDecimal(
      sleep.yearsLifetime,
    )} of my life asleep.`;
  }
  const biggest = result.biggest;
  if (biggest) {
    return `Apparently ${biggest.label.toLowerCase()} costs me ${formatYearsDecimal(
      biggest.yearsLifetime,
    )} of my life.`;
  }
  return "Apparently I have no idea where my life goes.";
}

/** Short label for the "I DON'T HAVE TIME" card, e.g. "TIKTOK". */
export function headlineActivity(result: LifeResult): LineItem | null {
  return result.questionable ?? result.biggest;
}

export function pluralYears(n: number) {
  return plural(n, "year");
}
