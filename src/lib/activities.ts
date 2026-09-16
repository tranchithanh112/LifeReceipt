/**
 * The activity catalogue: ids, ranges and classification only.
 *
 * All wording — labels, questions, hints, units — lives in the dictionaries
 * under `lib/i18n`, keyed by the ids below. Keeping the numbers here and the
 * copy there means adding a language never risks changing the maths.
 */

export type Cadence = "daily" | "weekday" | "weekly";

export type ActivityId =
  | "sleep"
  | "work"
  | "social"
  | "streaming"
  | "gaming"
  | "commute"
  | "exercise"
  | "loved";

/**
 * How the stats and humour engines are allowed to talk about a line item.
 * - `given`       — unavoidable, never mocked (sleep).
 * - `obligation`  — largely imposed on you (work, commute).
 * - `discretionary` — the "most questionable purchase" candidates.
 * - `investment`  — time you are unlikely to regret.
 */
export type ActivityKind = "given" | "obligation" | "discretionary" | "investment";

export interface ActivityDef {
  id: ActivityId;
  cadence: Cadence;
  min: number;
  max: number;
  step: number;
  /** Where the slider starts. Deliberately typical, never zero. */
  fallback: number;
  /** Required steps cannot be skipped — without them the receipt is empty. */
  required: boolean;
  kind: ActivityKind;
  /** Language-neutral, so it stays here rather than in the dictionaries. */
  emoji: string;
}

export const ACTIVITIES: readonly ActivityDef[] = [
  { id: "sleep", cadence: "daily", min: 0, max: 14, step: 0.5, fallback: 7.5, required: true, kind: "given", emoji: "😴" },
  { id: "work", cadence: "weekday", min: 0, max: 18, step: 0.5, fallback: 8, required: true, kind: "obligation", emoji: "💼" },
  { id: "social", cadence: "daily", min: 0, max: 14, step: 0.25, fallback: 2.5, required: true, kind: "discretionary", emoji: "📱" },
  { id: "streaming", cadence: "daily", min: 0, max: 14, step: 0.25, fallback: 1.5, required: false, kind: "discretionary", emoji: "📺" },
  { id: "gaming", cadence: "daily", min: 0, max: 14, step: 0.25, fallback: 0.5, required: false, kind: "discretionary", emoji: "🎮" },
  { id: "commute", cadence: "weekday", min: 0, max: 8, step: 0.25, fallback: 0.75, required: false, kind: "obligation", emoji: "🚇" },
  { id: "exercise", cadence: "weekly", min: 0, max: 30, step: 0.5, fallback: 3, required: false, kind: "investment", emoji: "🏃" },
  { id: "loved", cadence: "daily", min: 0, max: 14, step: 0.25, fallback: 2, required: false, kind: "investment", emoji: "❤️" },
] as const;

export const ACTIVITY_BY_ID: Record<ActivityId, ActivityDef> = Object.fromEntries(
  ACTIVITIES.map((a) => [a.id, a]),
) as Record<ActivityId, ActivityDef>;

/** A user-defined line item. Its label is the user's own words, not a key. */
export interface CustomActivity {
  id: string;
  label: string;
  value: number;
  cadence: Extract<Cadence, "daily" | "weekly">;
}

export const AGE_MIN = 13;
export const AGE_MAX = 90;
export const LIFE_EXPECTANCY_DEFAULT = 80;
export const LIFE_EXPECTANCY_MIN = 60;
export const LIFE_EXPECTANCY_MAX = 120;
