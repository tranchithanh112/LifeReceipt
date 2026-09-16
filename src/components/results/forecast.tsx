"use client";

import * as React from "react";
import { RotateCcw } from "lucide-react";

import { SerratedEdge } from "@/components/receipt/serrated-edge";
import { Slider } from "@/components/ui/slider";
import {
  ACTIVITY_BY_ID,
  LIFE_EXPECTANCY_MAX,
  LIFE_EXPECTANCY_MIN,
  type ActivityId,
} from "@/lib/activities";
import { timeReclaimed, type LifeResult, type LineItem } from "@/lib/calc";
import { useT } from "@/lib/i18n";
import { round } from "@/lib/i18n/format";
import { itemLabel, itemReceiptLabel } from "@/lib/i18n/labels";
import type { Dict } from "@/lib/i18n/types";
import { cn, clamp, snap } from "@/lib/utils";

type Overrides = Record<string, number>;

/**
 * The forecast and the refund, in one panel.
 *
 * These used to be two sections that each asked you to pick an activity and
 * each rendered its own slider wall. One picker, one activity, one slider: the
 * projection and the "what if I changed it" answer sit beside each other,
 * which is where the argument actually lands.
 *
 * Overrides never touch the stored answers — the receipt above stays the
 * receipt you were handed.
 */
export function Forecast({
  result,
  onLifeExpectancyChange,
}: {
  result: LifeResult;
  onLifeExpectancyChange: (value: number) => void;
}) {
  const t = useT();
  const fallback = result.questionable ?? result.biggest;
  const [focusId, setFocusId] = React.useState(fallback?.id ?? "");
  const [overrides, setOverrides] = React.useState<Overrides>({});

  const focus = result.items.find((item) => item.id === focusId) ?? fallback ?? null;
  if (!focus) return null;

  const reclaimedTotal = result.items.reduce((total, item) => {
    const next = overrides[item.id];
    return next === undefined
      ? total
      : total + timeReclaimed(item, next, result.yearsRemaining);
  }, 0);

  const changedCount = Object.keys(overrides).length;

  return (
    <div>
      <ActivityPicker
        items={result.items}
        focusId={focus.id}
        overrides={overrides}
        onSelect={setFocusId}
        t={t}
      />

      {/* A second slip of paper, not a rounded card. */}
      <div className="mt-6 [filter:drop-shadow(0_12px_24px_rgba(22,19,15,0.10))]">
        <SerratedEdge side="top" />
        <div className="grain bg-receipt px-5 py-6 sm:px-7 sm:py-7">
          <Projection item={focus} lifeExpectancy={result.lifeExpectancy} t={t} />

          <DashedRule />

          <WhatIf
            item={focus}
            value={overrides[focus.id] ?? focus.input}
            changed={overrides[focus.id] !== undefined}
            yearsRemaining={result.yearsRemaining}
            onChange={(value) =>
              setOverrides((prev) => ({ ...prev, [focus.id]: value }))
            }
            onReset={() =>
              setOverrides((prev) => {
                const next = { ...prev };
                delete next[focus.id];
                return next;
              })
            }
            t={t}
          />

          <DashedRule />

          <RefundReadout
            reclaimed={reclaimedTotal}
            lifeExpectancy={result.lifeExpectancy}
            changedCount={changedCount}
            onResetAll={() => setOverrides({})}
            t={t}
          />
        </div>
        <SerratedEdge side="bottom" />
      </div>

      <LifeExpectancyControl result={result} onChange={onLifeExpectancyChange} t={t} />
    </div>
  );
}

/* ------------------------------------------------------------------ */

function DashedRule() {
  return <div aria-hidden className="my-6 border-t border-dashed border-ink/30" />;
}

function ActivityPicker({
  items,
  focusId,
  overrides,
  onSelect,
  t,
}: {
  items: LineItem[];
  focusId: string;
  overrides: Overrides;
  onSelect: (id: string) => void;
  t: Dict;
}) {
  return (
    <div role="tablist" aria-label={t.forecast.chooseActivity} className="flex flex-wrap gap-2">
      {items.map((item) => {
        const active = item.id === focusId;
        return (
          <button
            key={item.id}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onSelect(item.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-mono text-[0.6875rem] tracking-[0.1em] uppercase transition-colors",
              active
                ? "border-ink bg-ink text-paper"
                : "border-ink/20 text-ink-muted hover:border-ink/50 hover:text-ink",
            )}
          >
            {itemReceiptLabel(item, t)}
            {overrides[item.id] !== undefined ? (
              <span
                aria-label={t.forecast.changedMarker}
                className={cn("h-1.5 w-1.5 rounded-full", active ? "bg-paper" : "bg-stamp")}
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function Projection({
  item,
  lifeExpectancy,
  t,
}: {
  item: LineItem;
  lifeExpectancy: number;
  t: Dict;
}) {
  const total = Math.max(item.yearsLifetime, 0.0001);
  const spentPct = Math.round((item.yearsSpent / total) * 100);

  return (
    <div>
      <p className="font-mono text-[0.75rem] tracking-[0.2em] text-ink-faint uppercase">
        {item.emoji} {itemLabel(item, t)}
      </p>

      <dl className="mt-4 grid grid-cols-2 gap-x-6">
        <div>
          <dt className="eyebrow">{t.forecast.alreadySpent}</dt>
          <dd className="tnum mt-1.5 font-display text-[clamp(1.75rem,7vw,2.5rem)] leading-none">
            {t.fmt.duration(item.yearsSpent)}
          </dd>
        </div>
        <div>
          <dt className="eyebrow">{t.forecast.stillToSpend}</dt>
          <dd className="tnum mt-1.5 font-display text-[clamp(1.75rem,7vw,2.5rem)] leading-none text-stamp">
            {t.fmt.duration(item.yearsRemaining)}
          </dd>
        </div>
      </dl>

      <div
        className="mt-5 flex h-3 w-full overflow-hidden rounded-full bg-paper-sunk"
        role="img"
        aria-label={t.forecast.barLabel(spentPct, itemLabel(item, t))}
      >
        <div className="h-full bg-ink" style={{ width: `${spentPct}%` }} />
        <div
          className="h-full bg-stamp/45"
          style={{ width: `${Math.max(0, 100 - spentPct)}%` }}
        />
      </div>
      <p className="mt-2 flex justify-between font-mono text-[0.6875rem] text-ink-faint">
        <span>{t.forecast.behindYou(spentPct)}</span>
        <span>{t.forecast.toAge(lifeExpectancy)}</span>
      </p>

      <p className="eyebrow mt-6">{t.forecast.lifetimeTotal}</p>
      <p className="font-display text-[clamp(2.25rem,10vw,3.5rem)] leading-[0.95] tracking-[-0.03em] uppercase">
        {t.fmt.durationLong(item.yearsLifetime)}
      </p>
    </div>
  );
}

function WhatIf({
  item,
  value,
  changed,
  yearsRemaining,
  onChange,
  onReset,
  t,
}: {
  item: LineItem;
  value: number;
  changed: boolean;
  yearsRemaining: number;
  onChange: (value: number) => void;
  onReset: () => void;
  t: Dict;
}) {
  const def = ACTIVITY_BY_ID[item.id as ActivityId];
  const min = def?.min ?? 0;
  const max = def?.max ?? Math.max(12, Math.ceil(item.input * 2));
  const step = def?.step ?? 0.25;
  const unit = t.cadenceShort[item.cadence];

  const target = (amount: number) => clamp(snap(item.input - amount, step), min, max);
  /** Payoff printed on the shortcut itself, so the number lands without a drag. */
  const payoff = (amount: number) =>
    t.fmt.duration(timeReclaimed(item, target(amount), yearsRemaining));

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <p className="eyebrow">{t.forecast.whatIfCut}</p>
        <p className="tnum font-mono text-[0.8125rem] text-ink-muted">
          {t.fmt.decimal(round(item.input, 2))}
          {changed ? (
            <>
              <span className="mx-1.5 text-ink-faint">→</span>
              <span className="font-bold text-ink">{t.fmt.decimal(round(value, 2))}</span>
            </>
          ) : null}
          <span className="ml-0.5 text-ink-faint">
            {t.hourShort}
            {unit}
          </span>
        </p>
      </div>

      <Slider
        className="mt-2"
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([next]) => onChange(next)}
        aria-label={t.forecast.adjust(itemLabel(item, t))}
      />

      <div className="mt-2 flex flex-wrap items-center gap-2">
        {item.input >= 1 ? (
          <>
            <Shortcut onClick={() => onChange(target(1))}>
              {t.forecast.minusOneHour} <Gain>+{payoff(1)}</Gain>
            </Shortcut>
            <Shortcut onClick={() => onChange(target(item.input / 2))}>
              {t.forecast.halveIt} <Gain>+{payoff(item.input / 2)}</Gain>
            </Shortcut>
          </>
        ) : item.input > 0 ? (
          <Shortcut onClick={() => onChange(min)}>
            {t.forecast.zeroIt} <Gain>+{payoff(item.input)}</Gain>
          </Shortcut>
        ) : null}
        {changed ? <Shortcut onClick={onReset}>{t.forecast.reset}</Shortcut> : null}
      </div>
    </div>
  );
}

function Shortcut({
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
      className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 px-3 py-1.5 font-mono text-[0.75rem] text-ink-muted transition-colors hover:border-ink/60 hover:text-ink"
    >
      {children}
    </button>
  );
}

function Gain({ children }: { children: React.ReactNode }) {
  return <span className="tnum font-bold text-stamp">{children}</span>;
}

function RefundReadout({
  reclaimed,
  lifeExpectancy,
  changedCount,
  onResetAll,
  t,
}: {
  reclaimed: number;
  lifeExpectancy: number;
  changedCount: number;
  onResetAll: () => void;
  t: Dict;
}) {
  const surrendered = reclaimed < -0.004;
  const magnitude = Math.abs(reclaimed);
  const idle = changedCount === 0 || magnitude < 0.004;

  return (
    <div className="text-center" aria-live="polite">
      <p className="eyebrow">
        {surrendered ? t.forecast.additionalCharge : t.forecast.timeRefunded}
      </p>

      <p
        className={cn(
          "mt-2 font-display text-[clamp(2.25rem,11vw,3.75rem)] leading-[0.92] tracking-[-0.03em] uppercase",
          surrendered ? "text-stamp" : idle ? "text-ink-faint" : "text-stamp",
        )}
      >
        {idle ? t.forecast.nothingYet : t.fmt.durationLong(magnitude)}
      </p>

      <p className="mt-2 text-[0.875rem] text-ink-muted">
        {idle
          ? t.forecast.dragPrompt
          : surrendered
            ? t.forecast.surrenderBefore(lifeExpectancy)
            : t.forecast.backBefore(lifeExpectancy)}
      </p>

      {changedCount > 1 ? (
        <p className="mt-1 font-mono text-[0.6875rem] text-ink-faint">
          {t.forecast.acrossNHabits(changedCount)}
        </p>
      ) : null}

      {changedCount > 1 ? (
        <button
          type="button"
          onClick={onResetAll}
          className="mt-4 inline-flex items-center gap-1.5 font-mono text-[0.6875rem] tracking-[0.1em] text-ink-faint uppercase underline decoration-ink/25 underline-offset-4 transition-colors hover:text-ink"
        >
          <RotateCcw className="h-3 w-3" aria-hidden />
          {t.forecast.resetEverything}
        </button>
      ) : null}
    </div>
  );
}

function LifeExpectancyControl({
  result,
  onChange,
  t,
}: {
  result: LifeResult;
  onChange: (value: number) => void;
  t: Dict;
}) {
  const min = Math.max(LIFE_EXPECTANCY_MIN, result.age + 1);

  return (
    <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
      <p className="shrink-0 font-mono text-[0.6875rem] tracking-[0.1em] text-ink-faint uppercase">
        {t.forecast.assumingYouLiveTo}{" "}
        <span className="tnum text-[0.875rem] font-bold text-ink">
          {result.lifeExpectancy}
        </span>
      </p>
      <Slider
        className="flex-1"
        value={[result.lifeExpectancy]}
        min={min}
        max={LIFE_EXPECTANCY_MAX}
        step={1}
        onValueChange={([next]) => onChange(next)}
        aria-label={t.forecast.lifeExpectancyLabel}
      />
    </div>
  );
}
