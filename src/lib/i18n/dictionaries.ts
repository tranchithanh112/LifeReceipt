/**
 * The dictionary registry, deliberately free of "use client" so server
 * components — metadata, the OG image route — can read copy too.
 */

import { en } from "./en";
import { vi } from "./vi";
import { DEFAULT_LOCALE, type Dict, type Locale } from "./types";

export const DICTIONARIES: Record<Locale, Dict> = { vi, en };

export function getDictionary(locale: Locale = DEFAULT_LOCALE): Dict {
  return DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
}
