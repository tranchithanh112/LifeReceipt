"use client";

import * as React from "react";

import { DICTIONARIES, LOCALES, setLocale, useLocale, useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Two-letter toggle. Small enough to sit in every page header without
 * competing with the wordmark, explicit enough to find without a menu.
 */
export function LocaleSwitch({ className }: { className?: string }) {
  const locale = useLocale();
  const t = useT();

  return (
    <div
      role="group"
      aria-label={t.localeSwitch.label}
      className={cn(
        "inline-flex overflow-hidden rounded-full border border-ink/15",
        className,
      )}
    >
      {LOCALES.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            lang={DICTIONARIES[code].htmlLang}
            aria-pressed={active}
            onClick={() => setLocale(code)}
            className={cn(
              "px-2.5 py-1 font-mono text-[0.6875rem] tracking-[0.1em] uppercase transition-colors",
              active ? "bg-ink text-paper" : "text-ink-faint hover:bg-ink/[0.06] hover:text-ink",
            )}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Keeps `<html lang>` truthful after hydration, for screen readers and for
 * the browser's own language heuristics. No state — just a DOM sync.
 */
export function LocaleHtmlLang() {
  const t = useT();

  React.useEffect(() => {
    document.documentElement.lang = t.htmlLang;
  }, [t.htmlLang]);

  return null;
}
