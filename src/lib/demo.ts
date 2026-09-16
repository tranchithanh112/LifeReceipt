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

