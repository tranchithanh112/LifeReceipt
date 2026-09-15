"use client";

import * as React from "react";
import { RotateCcw } from "lucide-react";

import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ACTIVITY_BY_ID, CADENCE_UNIT_SHORT, type ActivityId } from "@/lib/activities";
import { timeReclaimed, type LifeResult, type LineItem } from "@/lib/calc";
import { formatDuration, formatDurationLong, round } from "@/lib/format";
import { cn, clamp, snap } from "@/lib/utils";

type Overrides = Record<string, number>;

/**
 * The counterweight to "NO REFUNDS": drag a habit down and watch the years
 * come back. Purely local state — it never rewrites the user's real answers,
 * so the receipt above stays the receipt they were given.
 */
export function WhatIf({ result }: { result: LifeResult }) {
  const [overrides, setOverrides] = React.useState<Overrides>({});

  const rows = result.items;
  const dirty = Object.keys(overrides).length > 0;

  const reclaimed = rows.reduce((total, item) => {
    const next = overrides[item.id];
    if (next === undefined) return total;
    return total + timeReclaimed(item, next, result.yearsRemaining);
  }, 0);

  const sleepCut =
    result.byId.sleep != null &&
    overrides.sleep !== undefined &&
    overrides.sleep < Math.min(6, result.byId.sleep.input);

  const setOverride = (id: string, value: number) =>
    setOverrides((prev) => ({ ...prev, [id]: value }));

  return (
    <div>
      <RefundPanel
        reclaimed={reclaimed}
        lifeExpectancy={result.lifeExpectancy}
        dirty={dirty}
      />

      {sleepCut ? (
        <p className="mt-3 font-mono text-[0.75rem] leading-relaxed text-stamp">
          Time taken out of sleep is a loan, not a refund. The interest is brutal.
        </p>
      ) : null}

      <ul className="mt-8 space-y-7">
        {rows.map((item) => (
          <WhatIfRow
            key={item.id}
            item={item}
            value={overrides[item.id] ?? item.input}
            changed={overrides[item.id] !== undefined}
            yearsRemaining={result.yearsRemaining}
            onChange={(value) => setOverride(item.id, value)}
            onReset={() =>
              setOverrides((prev) => {
                const next = { ...prev };
                delete next[item.id];
                return next;
              })
            }
          />
        ))}
      </ul>

      {dirty ? (
        <Button variant="outline" size="md" className="mt-8" onClick={() => setOverrides({})}>
          <RotateCcw className="h-4 w-4" aria-hidden />
          Reset every slider
        </Button>
      ) : null}
    </div>
  );
}

function RefundPanel({
  reclaimed,
  lifeExpectancy,
  dirty,
}: {
  reclaimed: number;
  lifeExpectancy: number;
  dirty: boolean;
}) {
  const surrendered = reclaimed < -0.001;
  const magnitude = Math.abs(reclaimed);

  return (
    <div
      className="grain rounded-2xl border-2 border-ink bg-receipt px-5 py-7 text-center sm:px-8"
      aria-live="polite"
    >
      <p className="eyebrow">
        {surrendered ? "Additional charge" : "Time refunded"}
      </p>

      <p
        className={cn(
          "mt-3 font-display text-[clamp(2.5rem,12vw,4.5rem)] leading-[0.92] tracking-[-0.03em] uppercase",
          surrendered && "text-stamp",
        )}
      >
        {!dirty || magnitude < 0.004
          ? "Nothing yet"
          : formatDurationLong(magnitude)}
      </p>

      <p className="mt-3 text-[0.9375rem] text-ink-muted">
        {!dirty
          ? "Drag any slider below to see what you would get back."
          : surrendered
            ? `you would hand over before you turn ${lifeExpectancy}.`
            : `back, before you turn ${lifeExpectancy}.`}
      </p>
    </div>
  );
}

function WhatIfRow({
  item,
  value,
  changed,
  yearsRemaining,
  onChange,
  onReset,
}: {
  item: LineItem;
  value: number;
  changed: boolean;
  yearsRemaining: number;
  onChange: (value: number) => void;
  onReset: () => void;
}) {
  const def = ACTIVITY_BY_ID[item.id as ActivityId];
  const min = def?.min ?? 0;
  const max = def?.max ?? Math.max(12, Math.ceil(item.input * 2));
  const step = def?.step ?? 0.25;
  const unit = CADENCE_UNIT_SHORT[item.cadence];

  const delta = timeReclaimed(item, value, yearsRemaining);
  const gained = delta > 0.004;
  const lost = delta < -0.004;

  const quick = (amount: number) =>
    onChange(clamp(snap(item.input - amount, step), min, max));

  return (
    <li>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="font-mono text-[0.8125rem] tracking-[0.1em] uppercase">
          {item.receiptLabel}
        </p>
        <p className="tnum font-mono text-[0.8125rem] text-ink-muted">
          {round(item.input, 2)}
          {changed ? (
            <>
              <span className="mx-1.5 text-ink-faint">→</span>
              <span className="font-bold text-ink">{round(value, 2)}</span>
            </>
          ) : null}
          <span className="ml-0.5 text-ink-faint">h{unit}</span>
        </p>
      </div>

      <Slider
        className="mt-1"
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([next]) => onChange(next)}
        aria-label={`Adjust ${item.label}`}
      />

      <div className="mt-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        {/* Below an hour, halving rounds away to nothing on a 0.25 step, so
            those rows get a "Zero it" shortcut instead. */}
        <div className="flex items-center gap-1.5">
          {item.input >= 1 ? (
            <>
              <QuickChip onClick={() => quick(1)}>−1h</QuickChip>
              <QuickChip onClick={() => quick(item.input / 2)}>Halve it</QuickChip>
            </>
          ) : item.input > 0 ? (
            <QuickChip onClick={() => onChange(min)}>Zero it</QuickChip>
          ) : null}
          {changed ? <QuickChip onClick={onReset}>Reset</QuickChip> : null}
        </div>

        <p
          className={cn(
            "tnum font-mono text-[0.8125rem] font-medium",
            gained && "text-ink",
            lost && "text-stamp",
            !gained && !lost && "text-ink-faint",
          )}
        >
          {gained ? `+${formatDuration(delta)} back` : null}
          {lost ? `−${formatDuration(-delta)} more` : null}
          {!gained && !lost ? "no change" : null}
        </p>
      </div>
    </li>
  );
}

function QuickChip({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-ink/20 px-2.5 py-1 font-mono text-[0.6875rem] text-ink-muted transition-colors hover:border-ink/50 hover:text-ink"
    >
      {children}
    </button>
  );
}
