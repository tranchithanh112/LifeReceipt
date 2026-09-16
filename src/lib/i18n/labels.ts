/**
 * Resolves a line item's wording from a dictionary.
 *
 * Line items carry ids, not text, so these are the only place that knows how
 * to turn one into something a person reads. Deliberately free of "use client"
 * so the OG image route can call them too.
 */

import type { ActivityId } from "../activities";
import type { LineItem } from "../calc";

import type { Dict } from "./types";

/** Sentence-case name, e.g. "Social media" / "Mạng xã hội". */
export function itemLabel(item: Pick<LineItem, "id" | "customLabel">, t: Dict): string {
  if (item.customLabel) return item.customLabel;
  return t.activities[item.id as ActivityId]?.label ?? t.customFallbackLabel;
}

/** Short name printed on the receipt, e.g. "Scrolling" / "Lướt mạng". */
export function itemReceiptLabel(
  item: Pick<LineItem, "id" | "customLabel">,
  t: Dict,
): string {
  if (item.customLabel) return item.customLabel;
  return t.activities[item.id as ActivityId]?.receiptLabel ?? t.customFallbackLabel;
}

/** Verb phrase, e.g. "scrolling" / "lướt mạng" — reads after "more …". */
export function itemGerund(item: Pick<LineItem, "id" | "customLabel">, t: Dict): string {
  const known = t.gerund[item.id];
  if (known) return known;
  return t.gerundOther(itemLabel(item, t));
}
