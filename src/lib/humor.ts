/**
 * A small rules engine, deliberately not an LLM.
 *
 * Tone rules: dry, slightly savage, never insulting. Nothing here comments on
 * the user as a person — only on the numbers they typed. Lines are grouped by
 * `topic` so the receipt never lands two jokes about the same habit.
 */

import type { LifeResult } from "./calc";
import { itemLabel } from "./i18n/labels";
import type { Dict } from "./i18n/types";

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
  },
  {
    id: "scroll-vs-exercise",
    topic: "social",
    priority: 95,
    test: (c) => c.exercise > 0 && c.social >= c.exercise * 10,
  },
  {
    id: "scroll-vs-loved",
    topic: "social",
    priority: 97,
    test: (c) => c.loved > 0 && c.social >= c.loved * 1.5,
  },
  {
    id: "scroll-moderate",
    topic: "social",
    priority: 55,
    test: (c) => c.social >= 1.5 && c.social < 3,
  },
  {
    id: "scroll-none",
    topic: "social",
    priority: 50,
    test: (c) => c.answered("social") && c.social < 0.5,
  },

  // --- Sleep ---------------------------------------------------------------
  {
    id: "sleep-low",
    topic: "sleep",
    priority: 88,
    test: (c) => c.answered("sleep") && c.sleep < 6,
  },
  {
    id: "sleep-low-work-high",
    topic: "sleep",
    priority: 92,
    test: (c) => c.sleep > 0 && c.sleep < 6.5 && c.workPerWeekday >= 9,
  },
  {
    id: "sleep-high",
    topic: "sleep",
    priority: 60,
    test: (c) => c.sleep >= 9.5,
  },

  // --- Work ----------------------------------------------------------------
  {
    id: "work-heavy",
    topic: "work",
    priority: 87,
    test: (c) => c.workPerWeekday > 10,
  },
  {
    id: "work-none",
    topic: "work",
    priority: 45,
    test: (c) => c.answered("work") && c.workPerWeekday === 0,
  },

  // --- Commute -------------------------------------------------------------
  {
    id: "commute-heavy",
    topic: "commute",
    priority: 85,
    test: (c) => c.commutePerWeekday >= 2,
  },
  {
    id: "commute-zero",
    topic: "commute",
    priority: 40,
    test: (c) => c.answered("commute") && c.commutePerWeekday === 0,
  },

  // --- Gaming --------------------------------------------------------------
  {
    id: "gaming-heavy",
    topic: "gaming",
    priority: 86,
    test: (c) => c.gaming > 4,
  },
  {
    id: "gaming-moderate",
    topic: "gaming",
    priority: 48,
    test: (c) => c.gaming >= 1 && c.gaming <= 4,
  },

  // --- Streaming -----------------------------------------------------------
  {
    id: "streaming-heavy",
    topic: "streaming",
    priority: 80,
    test: (c) => c.streaming >= 4,
  },
  {
    id: "streaming-vs-scroll",
    topic: "streaming",
    priority: 58,
    test: (c) => c.social > 0 && c.streaming > 0 && c.social >= c.streaming * 2.5,
  },

  // --- Exercise ------------------------------------------------------------
  {
    id: "exercise-strong",
    topic: "exercise",
    priority: 82,
    test: (c) => c.exercise >= 1,
  },
  {
    id: "exercise-token",
    topic: "exercise",
    priority: 70,
    test: (c) => c.exercisePerWeek > 0 && c.exercisePerWeek < 1,
  },
  {
    id: "exercise-zero",
    topic: "exercise",
    priority: 66,
    test: (c) => c.answered("exercise") && c.exercisePerWeek === 0,
  },

  // --- Screens, combined ---------------------------------------------------
  {
    id: "screens-huge",
    topic: "screens",
    priority: 94,
    test: (c) => c.screens >= 8,
  },
  {
    id: "screens-vs-sleep",
    topic: "screens",
    priority: 84,
    test: (c) => c.sleep > 0 && c.screens > c.sleep,
  },

  // --- People --------------------------------------------------------------
  {
    id: "loved-strong",
    topic: "loved",
    priority: 76,
    test: (c) => c.loved >= 4,
  },
  {
    id: "loved-thin",
    topic: "loved",
    priority: 89,
    test: (c) => c.answered("loved") && c.loved < 0.5,
  },

  // --- Whole-receipt observations -----------------------------------------
  {
    id: "overflow",
    topic: "meta",
    priority: 72,
    test: (c) => c.result.overflows,
  },
  {
    id: "young-scroller",
    topic: "meta",
    priority: 74,
    test: (c) => c.result.age <= 21 && c.social >= 3,
  },
  {
    id: "older-scroller",
    topic: "meta",
    priority: 74,
    test: (c) => c.result.age >= 55 && c.social >= 3,
  },
  {
    id: "top-line",
    topic: "meta",
    priority: 30,
    test: (c) => c.result.biggest != null,
  },
];

/** Up to `limit` quips, at most one per topic, most cutting first. */
export function buildQuips(result: LifeResult, t: Dict, limit = 3): Quip[] {
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
      text: lineFor(rule.id, ctx, t),
      priority: rule.priority,
      topic: rule.topic,
    }));
}

/**
 * `top-line` is the one rule whose text needs the user's own numbers, so it
 * gets a builder while every other rule is a flat dictionary lookup.
 */
function lineFor(id: string, ctx: Context, t: Dict): string {
  if (id === "top-line" && ctx.result.biggest) {
    return t.humorTopLine(
      itemLabel(ctx.result.biggest, t),
      t.fmt.duration(ctx.result.biggest.yearsSpent),
    );
  }
  return t.humor[id] ?? t.humorFallback;
}

/** The single line printed at the bottom of the receipt. */
export function receiptVerdict(result: LifeResult, t: Dict): string {
  const [top] = buildQuips(result, t, 1);
  return top?.text ?? t.humorFallback;
}
