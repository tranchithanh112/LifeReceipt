"use client";

import * as React from "react";

import { Slider } from "@/components/ui/slider";
import {
  LIFE_EXPECTANCY_MAX,
  LIFE_EXPECTANCY_MIN,
} from "@/lib/activities";
import type { LifeResult, LineItem } from "@/lib/calc";
import { formatDuration, formatDurationLong } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * "If you continue like this until 80…" — the moment the numbers stop being
 * trivia and start being a forecast.
 */
export function FutureSelf({
  result,
  onLifeExpectancyChange,
}: {
  result: LifeResult;
  onLifeExpectancyChange: (value: number) => void;
}) {
  const focusDefault = result.questionable ?? result.biggest;
  const [focusId, setFocusId] = React.useState(focusDefault?.id ?? "");
  const focus =
    result.items.find((item) => item.id === focusId) ?? focusDefault ?? null;

  if (!focus) return null;

  return (
    <div>
      <LifeExpectancyControl
        result={result}
        onChange={onLifeExpectancyChange}
        className="mb-8"
      />

      <nav aria-label="Choose an activity" className="mb-6 flex flex-wrap gap-2">
        {result.items.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={item.id === focus.id}
            onClick={() => setFocusId(item.id)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 font-mono text-[0.6875rem] tracking-[0.1em] uppercase transition-colors",
              item.id === focus.id
                ? "border-ink bg-ink text-paper"
                : "border-ink/20 text-ink-muted hover:border-ink/50 hover:text-ink",
            )}
          >
            {item.receiptLabel}
          </button>
        ))}
      </nav>

      <FocusPanel item={focus} result={result} />
    </div>
  );
}

function FocusPanel({ item, result }: { item: LineItem; result: LifeResult }) {
  const total = Math.max(item.yearsLifetime, 0.0001);
  const spentPct = Math.round((item.yearsSpent / total) * 100);

  return (
    <div className="grain rounded-2xl border border-ink/12 bg-receipt p-5 sm:p-7">
      <p className="font-mono text-[0.75rem] tracking-[0.22em] text-ink-faint uppercase">
        {item.emoji} {item.label}
      </p>

      <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5">
        <div>
          <dt className="eyebrow">Already spent</dt>
          <dd className="tnum mt-1.5 font-display text-[clamp(1.75rem,7vw,2.5rem)] leading-none">
            {formatDuration(item.yearsSpent)}
          </dd>
        </div>
        <div>
          <dt className="eyebrow">Still to spend</dt>
          <dd className="tnum mt-1.5 font-display text-[clamp(1.75rem,7vw,2.5rem)] leading-none text-stamp">
            {formatDuration(item.yearsRemaining)}
          </dd>
        </div>
      </dl>

      {/* Spent versus still-to-come, as one honest bar. */}
      <div
        className="mt-6 flex h-3 w-full overflow-hidden rounded-full bg-paper-sunk"
        role="img"
        aria-label={`${spentPct}% of your lifetime ${item.label.toLowerCase()} is already behind you`}
      >
        <div className="h-full bg-ink" style={{ width: `${spentPct}%` }} />
        <div
          className="h-full bg-stamp/45"
          style={{ width: `${Math.max(0, 100 - spentPct)}%` }}
        />
      </div>
      <p className="mt-2 flex justify-between font-mono text-[0.6875rem] text-ink-faint">
        <span>{spentPct}% behind you</span>
        <span>to age {result.lifeExpectancy}</span>
      </p>

      <div className="mt-7 border-t border-ink/15 pt-5">
        <p className="eyebrow">Lifetime total</p>
        <p className="mt-2 font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.95] tracking-[-0.03em] uppercase">
          {formatDurationLong(item.yearsLifetime)}
        </p>
      </div>
    </div>
  );
}

function LifeExpectancyControl({
  result,
  onChange,
  className,
}: {
  result: LifeResult;
  onChange: (value: number) => void;
  className?: string;
}) {
  const min = Math.max(LIFE_EXPECTANCY_MIN, result.age + 1);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-ink/12 bg-paper-deep/40 p-4 sm:flex-row sm:items-center sm:gap-6",
        className,
      )}
    >
      <p className="shrink-0 font-mono text-[0.75rem] tracking-[0.1em] text-ink-muted uppercase">
        Assuming you live to{" "}
        <span className="tnum text-base font-bold text-ink">{result.lifeExpectancy}</span>
      </p>
      <Slider
        className="flex-1"
        value={[result.lifeExpectancy]}
        min={min}
        max={LIFE_EXPECTANCY_MAX}
        step={1}
        onValueChange={([next]) => onChange(next)}
        aria-label="Life expectancy in years"
      />
    </div>
  );
}
