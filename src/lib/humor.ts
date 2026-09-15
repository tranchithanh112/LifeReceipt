/**
 * A small rules engine, deliberately not an LLM.
 *
 * Tone rules: dry, slightly savage, never insulting. Nothing here comments on
 * the user as a person — only on the numbers they typed. Lines are grouped by
 * `topic` so the receipt never lands two jokes about the same habit.
 */

import type { LifeResult } from "./calc";
import { formatDuration } from "./format";

export interface Quip {
  id: string;
  text: string;
  priority: number;
  topic: string;
}

interface Rule {
  id: string;
  topic: string;
  priority: number;
  test: (ctx: Context) => boolean;
  line: (ctx: Context) => string;
}

interface Context {
  result: LifeResult;
  /** Per-day rates; 0 when an activity was skipped. */
  sleep: number;
  work: number;
  social: number;
  streaming: number;
  gaming: number;
  commute: number;
  exercise: number;
  loved: number;
  screens: number;
  /** Raw inputs in the user's own units, for the lines that quote them back. */
  workPerWeekday: number;
  commutePerWeekday: number;
  exercisePerWeek: number;
  answered: (id: string) => boolean;
}

function context(result: LifeResult): Context {
  const rate = (id: string) => result.byId[id]?.hoursPerDay ?? 0;
  const input = (id: string) => result.byId[id]?.input ?? 0;
  return {
    result,
    sleep: rate("sleep"),
    work: rate("work"),
    social: rate("social"),
    streaming: rate("streaming"),
    gaming: rate("gaming"),
    commute: rate("commute"),
    exercise: rate("exercise"),
    loved: rate("loved"),
    screens: rate("social") + rate("streaming") + rate("gaming"),
    workPerWeekday: input("work"),
    commutePerWeekday: input("commute"),
    exercisePerWeek: input("exercise"),
    answered: (id: string) => result.byId[id] != null,
  };
}

const RULES: Rule[] = [
  // --- Scrolling -----------------------------------------------------------
  {
    id: "scroll-heavy",
    topic: "social",
    priority: 90,
    test: (c) => c.social >= 3,
    line: () => "You say you don't have time. Your screen time would like a word.",
  },
  {
    id: "scroll-vs-exercise",
    topic: "social",
    priority: 95,
    test: (c) => c.exercise > 0 && c.social >= c.exercise * 10,
    line: () => "Your thumb is currently your most trained muscle.",
  },
  {
    id: "scroll-vs-loved",
    topic: "social",
    priority: 97,
    test: (c) => c.loved > 0 && c.social >= c.loved * 1.5,
    line: () => "Your phone receives more eye contact than the people in your life.",
  },
  {
    id: "scroll-moderate",
    topic: "social",
    priority: 55,
    test: (c) => c.social >= 1.5 && c.social < 3,
    line: () =>
      "A restrained scrolling habit. Still measured in years, but restrained.",
  },
  {
    id: "scroll-none",
    topic: "social",
    priority: 50,
    test: (c) => c.answered("social") && c.social < 0.5,
    line: () => "Barely any scrolling. Either admirable or a very old phone.",
  },

  // --- Sleep ---------------------------------------------------------------
  {
    id: "sleep-low",
    topic: "sleep",
    priority: 88,
    test: (c) => c.answered("sleep") && c.sleep < 6,
    line: () => "Apparently sleep is optional.",
  },
  {
    id: "sleep-low-work-high",
    topic: "sleep",
    priority: 92,
    test: (c) => c.sleep > 0 && c.sleep < 6.5 && c.workPerWeekday >= 9,
    line: () => "Sleeping less so you can work more. A flawless, undefeated strategy.",
  },
  {
    id: "sleep-high",
    topic: "sleep",
    priority: 60,
    test: (c) => c.sleep >= 9.5,
    line: () => "An impressive commitment to horizontal living.",
  },

  // --- Work ----------------------------------------------------------------
  {
    id: "work-heavy",
    topic: "work",
    priority: 87,
    test: (c) => c.workPerWeekday > 10,
    line: () => "Your employer appears prominently on your LifeReceipt.",
  },
  {
    id: "work-none",
    topic: "work",
    priority: 45,
    test: (c) => c.answered("work") && c.workPerWeekday === 0,
    line: () => "No work on the receipt. Retired, rich, or extremely optimistic.",
  },

  // --- Commute -------------------------------------------------------------
  {
    id: "commute-heavy",
    topic: "commute",
    priority: 85,
    test: (c) => c.commutePerWeekday >= 2,
    line: () => "Your second home appears to be transportation.",
  },
  {
    id: "commute-zero",
    topic: "commute",
    priority: 40,
    test: (c) => c.answered("commute") && c.commutePerWeekday === 0,
    line: () => "Zero commute. Somebody, at some point, made a very good decision.",
  },

  // --- Gaming --------------------------------------------------------------
  {
    id: "gaming-heavy",
    topic: "gaming",
    priority: 86,
    test: (c) => c.gaming > 4,
    line: () => "At least your Steam library is getting value for money.",
  },
  {
    id: "gaming-moderate",
    topic: "gaming",
    priority: 48,
    test: (c) => c.gaming >= 1 && c.gaming <= 4,
    line: () => "Gaming: present, accounted for, and quietly expensive.",
  },

  // --- Streaming -----------------------------------------------------------
  {
    id: "streaming-heavy",
    topic: "streaming",
    priority: 80,
    test: (c) => c.streaming >= 4,
    line: () =>
      "Netflix is not a personality trait, but it is now a line item on your receipt.",
  },
  {
    id: "streaming-vs-scroll",
    topic: "streaming",
    priority: 58,
    test: (c) => c.social > 0 && c.streaming > 0 && c.social >= c.streaming * 2.5,
    line: () => "You don't watch things any more. You flick past them.",
  },

  // --- Exercise ------------------------------------------------------------
  {
    id: "exercise-strong",
    topic: "exercise",
    priority: 82,
    test: (c) => c.exercise >= 1,
    line: () => "Suspiciously responsible behaviour detected.",
  },
  {
    id: "exercise-token",
    topic: "exercise",
    priority: 70,
    test: (c) => c.exercisePerWeek > 0 && c.exercisePerWeek < 1,
    line: () => "Under an hour a week of exercise. Technically non-zero.",
  },
  {
    id: "exercise-zero",
    topic: "exercise",
    priority: 66,
    test: (c) => c.answered("exercise") && c.exercisePerWeek === 0,
    line: () => "Exercise: no charge. Nothing was purchased.",
  },

  // --- Screens, combined ---------------------------------------------------
  {
    id: "screens-huge",
    topic: "screens",
    priority: 94,
    test: (c) => c.screens >= 8,
    line: () => "More than a third of your waking life happens behind glass.",
  },
  {
    id: "screens-vs-sleep",
    topic: "screens",
    priority: 84,
    test: (c) => c.sleep > 0 && c.screens > c.sleep,
    line: () => "You spend more time looking at screens than sleeping. Bold.",
  },

  // --- People --------------------------------------------------------------
  {
    id: "loved-strong",
    topic: "loved",
    priority: 76,
    test: (c) => c.loved >= 4,
    line: () =>
      "Whoever you spend this time with is lucky. This is the only line nobody regrets.",
  },
  {
    id: "loved-thin",
    topic: "loved",
    priority: 89,
    test: (c) => c.answered("loved") && c.loved < 0.5,
    line: () => "Under half an hour a day with the people you love. Noted, without comment.",
  },

  // --- Whole-receipt observations -----------------------------------------
  {
    id: "overflow",
    topic: "meta",
    priority: 72,
    test: (c) => c.result.overflows,
    line: () =>
      "Your day contains more than 24 hours. Either heroic multitasking or creative accounting.",
  },
  {
    id: "young-scroller",
    topic: "meta",
    priority: 74,
    test: (c) => c.result.age <= 21 && c.social >= 3,
    line: () =>
      "You have not been alive very long, and a striking amount of it has been vertical video.",
  },
  {
    id: "older-scroller",
    topic: "meta",
    priority: 74,
    test: (c) => c.result.age >= 55 && c.social >= 3,
    line: () =>
      "You did not make it this far through history to spend this long on a feed.",
  },
  {
    id: "top-line",
    topic: "meta",
    priority: 30,
    test: (c) => c.result.biggest != null,
    line: (c) =>
      `${c.result.biggest!.label} is your largest single expense at ${formatDuration(
        c.result.biggest!.yearsSpent,
      )}, and it is only going up.`,
  },
];

/** Up to `limit` quips, at most one per topic, most cutting first. */
export function buildQuips(result: LifeResult, limit = 3): Quip[] {
  const ctx = context(result);
  const seen = new Set<string>();

  return RULES.filter((rule) => {
    try {
      return rule.test(ctx);
    } catch {
      return false;
    }
  })
    .sort((a, b) => b.priority - a.priority)
    .filter((rule) => {
      if (seen.has(rule.topic)) return false;
      seen.add(rule.topic);
      return true;
    })
    .slice(0, limit)
    .map((rule) => ({
      id: rule.id,
      text: rule.line(ctx),
      priority: rule.priority,
      topic: rule.topic,
    }));
}

/** The single line printed at the bottom of the receipt. */
export function receiptVerdict(result: LifeResult): string {
  const [top] = buildQuips(result, 1);
  return top?.text ?? "One life. Spent exactly as recorded above.";
}
