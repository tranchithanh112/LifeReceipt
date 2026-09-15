/**
 * The activity catalogue. Pure data on purpose: this module is imported by
 * server code (the OG image route) as well as the client, so it must not pull
 * in React or any browser API.
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
  /** Sentence-case label used in prose. */
  label: string;
  /** Short label printed on the receipt. Rendered uppercase. */
  receiptLabel: string;
  question: string;
  /** Examples or a nudge, shown under the question. */
  hint?: string;
  cadence: Cadence;
  min: number;
  max: number;
  step: number;
  /** Where the slider starts. Deliberately typical, never zero. */
  fallback: number;
  /** Required steps cannot be skipped — without them the receipt is empty. */
  required: boolean;
  kind: ActivityKind;
  emoji: string;
}

export const ACTIVITIES: readonly ActivityDef[] = [
  {
    id: "sleep",
    label: "Sleep",
    receiptLabel: "Sleep",
    question: "How many hours do you sleep per day?",
    hint: "Be honest, not aspirational.",
    cadence: "daily",
    min: 0,
    max: 14,
    step: 0.5,
    fallback: 7.5,
    required: true,
    kind: "given",
    emoji: "😴",
  },
  {
    id: "work",
    label: "Work / study",
    receiptLabel: "Work",
    question: "How many hours do you work or study on an average weekday?",
    hint: "Counted across 5 days a week.",
    cadence: "weekday",
    min: 0,
    max: 18,
    step: 0.5,
    fallback: 8,
    required: true,
    kind: "obligation",
    emoji: "💼",
  },
  {
    id: "social",
    label: "Social media",
    receiptLabel: "Scrolling",
    question: "How many hours do you spend scrolling per day?",
    hint: "TikTok · Instagram · Facebook · X · Reddit · Shorts",
    cadence: "daily",
    min: 0,
    max: 14,
    step: 0.25,
    fallback: 2.5,
    required: true,
    kind: "discretionary",
    emoji: "📱",
  },
  {
    id: "streaming",
    label: "Streaming",
    receiptLabel: "Streaming",
    question: "How many hours do you watch Netflix / YouTube / TV per day?",
    hint: "Background rewatches of The Office count.",
    cadence: "daily",
    min: 0,
    max: 14,
    step: 0.25,
    fallback: 1.5,
    required: false,
    kind: "discretionary",
    emoji: "📺",
  },
  {
    id: "gaming",
    label: "Gaming",
    receiptLabel: "Gaming",
    question: "How many hours do you game per day?",
    hint: "Averaged out — weekend benders included.",
    cadence: "daily",
    min: 0,
    max: 14,
    step: 0.25,
    fallback: 0.5,
    required: false,
    kind: "discretionary",
    emoji: "🎮",
  },
  {
    id: "commute",
    label: "Commuting",
    receiptLabel: "Commute",
    question: "How long do you commute each day?",
    hint: "Both directions, on a working day.",
    cadence: "weekday",
    min: 0,
    max: 8,
    step: 0.25,
    fallback: 0.75,
    required: false,
    kind: "obligation",
    emoji: "🚇",
  },
  {
    id: "exercise",
    label: "Exercise",
    receiptLabel: "Exercise",
    question: "How many hours do you exercise per week?",
    hint: "Walking to the fridge is not cardio.",
    cadence: "weekly",
    min: 0,
    max: 30,
    step: 0.5,
    fallback: 3,
    required: false,
    kind: "investment",
    emoji: "🏃",
  },
  {
    id: "loved",
    label: "People you love",
    receiptLabel: "Loved ones",
    question:
      "How much intentional time do you spend with people you care about each day?",
    hint: "Phones down, actually present.",
    cadence: "daily",
    min: 0,
    max: 14,
    step: 0.25,
    fallback: 2,
    required: false,
    kind: "investment",
    emoji: "❤️",
  },
] as const;

export const ACTIVITY_BY_ID: Record<ActivityId, ActivityDef> = Object.fromEntries(
  ACTIVITIES.map((a) => [a.id, a]),
) as Record<ActivityId, ActivityDef>;

/** A user-defined line item. Same shape as a built-in, minus the copy. */
export interface CustomActivity {
  id: string;
  label: string;
  value: number;
  cadence: Extract<Cadence, "daily" | "weekly">;
}

export const CADENCE_UNIT: Record<Cadence, string> = {
  daily: "hours a day",
  weekday: "hours a weekday",
  weekly: "hours a week",
};

export const CADENCE_UNIT_SHORT: Record<Cadence, string> = {
  daily: "/day",
  weekday: "/weekday",
  weekly: "/week",
};

export const AGE_MIN = 13;
export const AGE_MAX = 90;
export const LIFE_EXPECTANCY_DEFAULT = 80;
export const LIFE_EXPECTANCY_MIN = 60;
export const LIFE_EXPECTANCY_MAX = 120;
