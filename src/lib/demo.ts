/**
 * The sample answers behind the receipt in the hero. Rendered through the real
 * <Receipt /> with the real maths, so the marketing preview can never drift
 * away from the product.
 */

import { calculate, type Answers } from "./calc";

export const DEMO_ANSWERS: Answers = {
  age: 28,
  lifeExpectancy: 80,
  name: "",
  custom: [],
  values: {
    sleep: 8,
    work: 8,
    social: 2.5,
    streaming: 1.5,
    gaming: 0.5,
    commute: 1,
    exercise: 3,
    loved: 2,
  },
};

export function demoResult() {
  // Non-null: DEMO_ANSWERS always has an age.
  return calculate(DEMO_ANSWERS)!;
}

/** Headline figures for an average life, used in the landing page ticker. */
export const AVERAGE_LIFE = [
  { value: "26 years", label: "asleep" },
  { value: "13 years", label: "at work" },
  { value: "9 years", label: "on a screen" },
  { value: "4 years", label: "eating" },
  { value: "1 year", label: "commuting" },
] as const;
