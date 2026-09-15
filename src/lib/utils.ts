import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** Rounds to `step`, then trims float noise (0.30000000000000004 -> 0.3). */
export function snap(value: number, step: number) {
  const snapped = Math.round(value / step) * step;
  return Number(snapped.toFixed(4));
}
