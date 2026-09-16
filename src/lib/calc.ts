/**
 * All of the arithmetic behind a LifeReceipt.
 *
 * Every activity is normalised to an "effective hours per day" figure, and
 * every duration in the result is a number of years. Two deliberate modelling
 * choices, both of which the UI states plainly to the user:
 *
 *  1. Time is counted across the user's whole life so far. A 28-year-old who
 *     works 8h a weekday is billed for ~6.6 years of work, not for the years
 *     since they actually started working. This keeps the receipt's arithmetic
 *     transparent — every line is just `rate x lifetime` — and it is the model
 *     the projections extend forward.
 *  2. Activities are allowed to overlap. Scrolling on the commute is counted
 *     twice because it genuinely costs you attention twice. The totals are
 *     therefore an estimate, not a literal 24-hour accounting.
 */

import {
  ACTIVITIES,
  AGE_MAX,
  AGE_MIN,
  LIFE_EXPECTANCY_MAX,
  type ActivityId,
  type ActivityKind,
  type Cadence,
  type CustomActivity,
} from "./activities";
import { DAYS_IN_YEAR } from "./i18n/format";
import { clamp } from "./utils";

export const HOURS_PER_DAY = 24;
export const WEEKS_PER_YEAR = 52;
export const WEEKDAYS_PER_WEEK = 5;
const DAYS_PER_YEAR_EXACT = 365;

export interface Answers {
  age: number | null;
  lifeExpectancy: number;
  /** `null` means the user explicitly skipped the question. */
  values: Partial<Record<ActivityId, number | null>>;
  custom: CustomActivity[];
  /** Optional, purely cosmetic — printed at the top of the receipt. */
  name: string;
}

export interface LineItem {
  id: string;
  /** Only set for user-defined items; built-ins resolve their label by id. */
  customLabel?: string;
  kind: ActivityKind;
  emoji: string;
  cadence: Cadence;
  /** The raw number the user entered, in the activity's own cadence. */
  input: number;
  /** Normalised rate, comparable across cadences. */
  hoursPerDay: number;
  hoursPerYear: number;
  daysPerYear: number;
  yearsSpent: number;
  yearsRemaining: number;
  yearsLifetime: number;
  /** Share of the user's life so far, 0–1. */
  shareOfLife: number;
  isCustom: boolean;
}

export interface LifeResult {
  age: number;
  lifeExpectancy: number;
  /** Clamped so projections never go negative. */
  yearsRemaining: number;
  daysLived: number;
  daysRemaining: number;
  hoursLived: number;
  items: LineItem[];
  /** Total accounted-for time, which may exceed the user's age (see above). */
  totalYearsSpent: number;
  totalYearsRemaining: number;
  totalYearsLifetime: number;
  totalHoursPerDay: number;
  /** Age minus tracked time. Negative when the inputs overlap past 24h a day. */
  unaccountedYears: number;
  /** True when the inputs sum to more than a day — worth saying out loud. */
  overflows: boolean;
  biggest: LineItem | null;
  /** Largest discretionary line — the "most questionable purchase". */
  questionable: LineItem | null;
  byId: Partial<Record<string, LineItem>>;
  /** Stable pseudo-random seed so the barcode is the same on every render. */
  seed: number;
}

/** Converts an activity's own cadence into an average daily rate. */
export function toHoursPerDay(value: number, cadence: Cadence): number {
  switch (cadence) {
    case "daily":
      return value;
    case "weekday":
      return (value * WEEKDAYS_PER_WEEK * WEEKS_PER_YEAR) / DAYS_PER_YEAR_EXACT;
    case "weekly":
      return (value * WEEKS_PER_YEAR) / DAYS_PER_YEAR_EXACT;
  }
}

/** `hoursPerDay x years / 24` — the whole model, in one line. */
export function yearsOf(hoursPerDay: number, overYears: number): number {
  return Math.max(0, (hoursPerDay * overYears) / HOURS_PER_DAY);
}

export function createDefaultAnswers(): Answers {
  return {
    age: null,
    lifeExpectancy: 80,
    values: {},
    custom: [],
    name: "",
  };
}

/** Life expectancy must stay ahead of the user, or the projections invert. */
export function normaliseLifeExpectancy(lifeExpectancy: number, age: number) {
  return clamp(
    Math.max(lifeExpectancy, age + 1),
    Math.min(age + 1, LIFE_EXPECTANCY_MAX),
    LIFE_EXPECTANCY_MAX,
  );
}

function hashSeed(answers: Answers): number {
  const source = JSON.stringify([answers.age, answers.values, answers.custom]);
  let h = 2166136261;
  for (let i = 0; i < source.length; i++) {
    h ^= source.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/**
 * Turns a set of answers into everything the results page needs.
 * Returns `null` until the one genuinely required answer — age — is present.
 */
export function calculate(answers: Answers): LifeResult | null {
  if (answers.age == null || !Number.isFinite(answers.age)) return null;

  const age = clamp(Math.round(answers.age), AGE_MIN, AGE_MAX);
  const lifeExpectancy = normaliseLifeExpectancy(answers.lifeExpectancy, age);
  const yearsRemaining = Math.max(0, lifeExpectancy - age);

  const raw: Array<{
    id: string;
    customLabel?: string;
    kind: ActivityKind;
    emoji: string;
    cadence: Cadence;
    input: number;
    isCustom: boolean;
  }> = [];

  for (const def of ACTIVITIES) {
    const value = answers.values[def.id];
    if (value == null || !Number.isFinite(value) || value <= 0) continue;
    raw.push({
      id: def.id,
      kind: def.kind,
      emoji: def.emoji,
      cadence: def.cadence,
      input: clamp(value, def.min, def.max),
      isCustom: false,
    });
  }

  for (const custom of answers.custom) {
    if (!Number.isFinite(custom.value) || custom.value <= 0) continue;
    raw.push({
      id: custom.id,
      customLabel: custom.label.trim() || undefined,
      kind: "discretionary",
      emoji: "✳️",
      cadence: custom.cadence,
      input: custom.value,
      isCustom: true,
    });
  }

  const items: LineItem[] = raw
    .map((entry) => {
      const hoursPerDay = toHoursPerDay(entry.input, entry.cadence);
      const yearsSpent = yearsOf(hoursPerDay, age);
      const yearsRemainingForItem = yearsOf(hoursPerDay, yearsRemaining);
      return {
        ...entry,
        hoursPerDay,
        hoursPerYear: hoursPerDay * DAYS_IN_YEAR,
        daysPerYear: (hoursPerDay * DAYS_IN_YEAR) / HOURS_PER_DAY,
        yearsSpent,
        yearsRemaining: yearsRemainingForItem,
        yearsLifetime: yearsSpent + yearsRemainingForItem,
        shareOfLife: age > 0 ? yearsSpent / age : 0,
      } satisfies LineItem;
    })
    .sort((a, b) => b.yearsSpent - a.yearsSpent);

  const totalYearsSpent = items.reduce((sum, item) => sum + item.yearsSpent, 0);
  const totalYearsRemaining = items.reduce((sum, item) => sum + item.yearsRemaining, 0);
  const totalHoursPerDay = items.reduce((sum, item) => sum + item.hoursPerDay, 0);

  const discretionary = items.filter((item) => item.kind === "discretionary");
  const questionable =
    discretionary[0] ??
    items.find((item) => item.kind === "obligation" && item.id === "commute") ??
    items.find((item) => item.kind === "obligation") ??
    null;

  return {
    age,
    lifeExpectancy,
    yearsRemaining,
    daysLived: Math.round(age * DAYS_IN_YEAR),
    daysRemaining: Math.round(yearsRemaining * DAYS_IN_YEAR),
    hoursLived: Math.round(age * DAYS_IN_YEAR * HOURS_PER_DAY),
    items,
    totalYearsSpent,
    totalYearsRemaining,
    totalYearsLifetime: totalYearsSpent + totalYearsRemaining,
    totalHoursPerDay,
    unaccountedYears: age - totalYearsSpent,
    overflows: totalHoursPerDay > HOURS_PER_DAY,
    biggest: items[0] ?? null,
    questionable,
    byId: Object.fromEntries(items.map((item) => [item.id, item])),
    seed: hashSeed(answers),
  };
}

/**
 * "What if I cut this by an hour a day?" — the reclaimed time between now and
 * the user's life expectancy. Always non-negative from the user's point of
 * view; increasing an activity returns a negative number (time surrendered).
 */
export function timeReclaimed(
  item: Pick<LineItem, "cadence" | "input">,
  newInput: number,
  yearsRemaining: number,
): number {
  const before = toHoursPerDay(item.input, item.cadence);
  const after = toHoursPerDay(newInput, item.cadence);
  return yearsOf(before, yearsRemaining) - yearsOf(after, yearsRemaining);
}

/** Answers are only complete enough to bill once age and one activity exist. */
export function hasEnoughToCalculate(answers: Answers): boolean {
  if (answers.age == null) return false;
  const anyBuiltIn = ACTIVITIES.some((def) => {
    const v = answers.values[def.id];
    return v != null && v > 0;
  });
  const anyCustom = answers.custom.some((c) => c.value > 0);
  return anyBuiltIn || anyCustom;
}
