/**
 * Picks the few numbers most likely to make someone stop scrolling and read.
 *
 * Every candidate declares a priority; only candidates that clear their own
 * "is this actually interesting?" test are emitted, and at most one stat per
 * `family` survives so the list never repeats the same idea twice.
 *
 * The selection logic lives here; the wording lives in the dictionaries, which
 * is why every builder takes a `Dict`. The two languages order their clauses
 * differently, so a shared template would force one into the other's grammar.
 */

import type { LifeResult, LineItem } from "./calc";
import { itemGerund } from "./i18n/labels";
import type { Dict } from "./i18n/types";

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

export function buildStats(result: LifeResult, t: Dict, limit = 5): Stat[] {
  const { age, lifeExpectancy, yearsRemaining, byId, items } = result;
  const { fmt } = t;
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
      value: fmt.duration(q.yearsRemaining),
      text: t.stats.future(itemGerund(q, t), lifeExpectancy),
      priority: 100,
      family: "future",
    });
  }

  if (q && q.yearsLifetime > age) {
    // The most quotable shape there is: a single habit outgrowing your whole
    // life to date. Same family as the plain lifetime stat, so only one shows.
    push({
      id: "outgrows-your-life",
      value: fmt.yearsDecimal(q.yearsLifetime),
      text: t.stats.outgrowsLife(itemGerund(q, t)),
      priority: 99,
      family: "lifetime",
    });
  }

  if (q && q.yearsLifetime >= 1) {
    push({
      id: "lifetime-questionable",
      value: fmt.yearsDecimal(q.yearsLifetime),
      text: t.stats.lifetime(itemGerund(q, t)),
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
      value: fmt.duration(free),
      text: t.stats.freeTime,
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
        value: fmt.yearsDecimal(screenLifetime),
        text: t.stats.screens,
        priority: 96,
        family: "screens",
      });
    }
  }

  // --- Annualised: makes a "small" daily habit land ---
  if (q && q.daysPerYear >= 7) {
    push({
      id: "per-year",
      value: `${fmt.number(q.hoursPerYear)}h`,
      text: t.stats.perYear(itemGerund(q, t), fmt.number(q.daysPerYear)),
      priority: 90,
      family: "annual",
    });
  }

  // --- Ratios: the most quotable stat shape there is ---
  push(ratioStat(q, exercise, t.stats.ratioVsExercise, 88, t));
  push(ratioStat(q, loved, t.stats.ratioVsLoved, 92, t));
  if (!q) push(ratioStat(byId.streaming, exercise, t.stats.ratioVsExercise, 70, t));

  // --- The budget you have left, in units people actually feel ---
  if (result.daysRemaining > 7) {
    const saturdays = Math.floor(result.daysRemaining / 7);
    const summers = Math.floor(yearsRemaining);
    push({
      id: "saturdays",
      value: fmt.number(saturdays),
      text: t.stats.saturdays(fmt.number(summers)),
      priority: 95,
      family: "budget-days",
    });
  }

  if (result.daysRemaining > 0) {
    push({
      id: "days-left",
      value: fmt.number(result.daysRemaining),
      text: t.stats.daysLeft(lifeExpectancy),
      priority: 86,
      family: "budget-days",
    });
  }

  // --- Sleep: enormous, unavoidable, still shocking ---
  if (sleep && sleep.yearsLifetime >= 5) {
    push({
      id: "sleep-lifetime",
      value: fmt.yearsDecimal(sleep.yearsLifetime),
      text: t.stats.sleepLifetime,
      priority: 78,
      family: "sleep",
    });
  }

  // --- Work ---
  if (work && work.yearsLifetime >= 5) {
    push({
      id: "work-lifetime",
      value: fmt.yearsDecimal(work.yearsLifetime),
      text: t.stats.workLifetime,
      priority: 74,
      family: "work",
    });
  }

  // --- Commute: small daily numbers, absurd lifetime numbers ---
  if (commute && commute.yearsLifetime >= 1) {
    push({
      id: "commute-lifetime",
      value: fmt.duration(commute.yearsLifetime),
      text: t.stats.commuteLifetime,
      priority: 76,
      family: "commute",
    });
  }

  // --- Already gone ---
  if (q && age > 0 && q.shareOfLife >= 0.04) {
    push({
      id: "share-so-far",
      value: `${fmt.decimal(Math.round(q.shareOfLife * 1000) / 10)}%`,
      text: t.stats.shareSoFar(itemGerund(q, t)),
      priority: 84,
      family: "share",
    });
  }

  // --- Exercise, when it is conspicuously absent ---
  if (exercise && exercise.hoursPerDay > 0 && exercise.yearsLifetime < 1 && q) {
    push({
      id: "exercise-tiny",
      value: fmt.duration(exercise.yearsLifetime),
      text: t.stats.exerciseTiny(fmt.duration(q.yearsLifetime), itemGerund(q, t)),
      priority: 80,
      family: "exercise",
    });
  }

  return dedupe(candidates).slice(0, limit);
}

function ratioStat(
  a: LineItem | undefined | null,
  b: LineItem | undefined | null,
  againstPhrase: string,
  basePriority: number,
  t: Dict,
): Stat | null {
  if (!a || !b) return null;
  if (b.hoursPerDay <= 0 || a.hoursPerDay <= 0) return null;
  const ratio = a.hoursPerDay / b.hoursPerDay;
  if (ratio < 1.8) return null;
  return {
    id: `ratio-${a.id}-${b.id}`,
    value: t.fmt.ratio(ratio),
    text: t.stats.ratio(itemGerund(a, t), againstPhrase),
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
export function buildPunchline(result: LifeResult, t: Dict): string {
  const q = result.questionable;
  if (q && q.yearsLifetime >= 1) {
    return t.share.punchline(t.fmt.yearsDecimal(q.yearsLifetime), itemGerund(q, t));
  }
  const sleep = result.byId.sleep;
  if (sleep && sleep.yearsLifetime >= 1) {
    return t.share.punchline(t.fmt.yearsDecimal(sleep.yearsLifetime), itemGerund(sleep, t));
  }
  const biggest = result.biggest;
  if (biggest) {
    return t.share.punchline(
      t.fmt.yearsDecimal(biggest.yearsLifetime),
      itemGerund(biggest, t),
    );
  }
  return t.share.punchlineFallback;
}

/** Short label for the "I DON'T HAVE TIME" card. */
export function headlineActivity(result: LifeResult): LineItem | null {
  return result.questionable ?? result.biggest;
}
