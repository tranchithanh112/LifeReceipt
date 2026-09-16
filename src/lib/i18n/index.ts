"use client";

/**
 * Locale selection, as an external store.
 *
 * Same shape as the answers store in `lib/state.tsx`: the server renders the
 * default locale, `useSyncExternalStore` swaps in the stored choice after
 * hydration, and nothing is chased in an effect.
 */

import { useSyncExternalStore } from "react";

import { DICTIONARIES } from "./dictionaries";
import { DEFAULT_LOCALE, type Dict, type Locale } from "./types";

export { DICTIONARIES, getDictionary } from "./dictionaries";
export { DEFAULT_LOCALE, LOCALES, LOCALE_LABEL } from "./types";
export type { Dict, Locale } from "./types";

const STORAGE_KEY = "lifereceipt:locale";

type Listener = () => void;
const listeners = new Set<Listener>();

let current: Locale | null = null;

function read(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "en" || stored === "vi" ? stored : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Locale {
  current ??= read();
  return current;
}

const getServerSnapshot = (): Locale => DEFAULT_LOCALE;

export function setLocale(next: Locale) {
  if (next === getSnapshot()) return;
  current = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Private mode or disabled storage — the choice just won't persist.
  }
  // Keep the document in sync for screen readers and for `lang`-aware CSS.
  if (typeof document !== "undefined") {
    document.documentElement.lang = DICTIONARIES[next].htmlLang;
  }
  for (const listener of listeners) listener();
}

export function useLocale(): Locale {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** The hook every component uses: `const t = useT()`. */
export function useT(): Dict {
  return DICTIONARIES[useLocale()];
}
