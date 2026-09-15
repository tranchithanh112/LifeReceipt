/**
 * Answers live in localStorage and nowhere else — no network, no cookies, no
 * account. The version suffix lets the shape change later without resurrecting
 * a stale payload from someone's browser.
 */

import { ACTIVITY_BY_ID, AGE_MAX, AGE_MIN, type ActivityId } from "./activities";
import { createDefaultAnswers, type Answers } from "./calc";
import { clamp } from "./utils";

const STORAGE_KEY = "lifereceipt:answers:v1";
/** Set once the intro animation has played, so a refresh doesn't replay it. */
const REVEAL_KEY = "lifereceipt:revealed";

export function loadAnswers(): Answers | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return sanitise(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveAnswers(answers: Answers): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  } catch {
    // Private mode, quota, disabled storage — the app works without it.
  }
}

export function clearAnswers(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.sessionStorage.removeItem(REVEAL_KEY);
  } catch {
    // Ignore.
  }
}

export function hasSeenReveal(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(REVEAL_KEY) === "1";
  } catch {
    return false;
  }
}

export function markRevealSeen(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(REVEAL_KEY, "1");
  } catch {
    // Ignore.
  }
}

/** Never trust what comes back out of storage — it is user-editable. */
function sanitise(input: unknown): Answers {
  const base = createDefaultAnswers();
  if (typeof input !== "object" || input === null) return base;
  const raw = input as Record<string, unknown>;

  if (typeof raw.age === "number" && Number.isFinite(raw.age)) {
    base.age = clamp(Math.round(raw.age), AGE_MIN, AGE_MAX);
  }

  if (typeof raw.lifeExpectancy === "number" && Number.isFinite(raw.lifeExpectancy)) {
    base.lifeExpectancy = clamp(Math.round(raw.lifeExpectancy), 60, 120);
  }

  if (typeof raw.name === "string") {
    base.name = raw.name.slice(0, 24);
  }

  if (typeof raw.values === "object" && raw.values !== null) {
    for (const [key, value] of Object.entries(raw.values as Record<string, unknown>)) {
      const def = ACTIVITY_BY_ID[key as ActivityId];
      if (!def) continue;
      if (value === null) {
        base.values[def.id] = null;
      } else if (typeof value === "number" && Number.isFinite(value)) {
        base.values[def.id] = clamp(value, def.min, def.max);
      }
    }
  }

  if (Array.isArray(raw.custom)) {
    base.custom = raw.custom
      .filter((entry): entry is Record<string, unknown> => typeof entry === "object" && entry !== null)
      .slice(0, 6)
      .map((entry, index) => ({
        id: typeof entry.id === "string" ? entry.id : `custom-${index}`,
        label: typeof entry.label === "string" ? entry.label.slice(0, 24) : "Other",
        value:
          typeof entry.value === "number" && Number.isFinite(entry.value)
            ? clamp(entry.value, 0, 24)
            : 0,
        cadence: entry.cadence === "weekly" ? "weekly" : "daily",
      }));
  }

  return base;
}
