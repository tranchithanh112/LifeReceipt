"use client";

import * as React from "react";

import { CountUp } from "@/components/count-up";
import type { LifeResult } from "@/lib/calc";
import { formatDuration } from "@/lib/format";

const BEAT_MS = 1100;
const BEATS = 3;

/**
 * The build-up before the receipt prints.
 *
 * Each beat replaces the last rather than stacking, and the final beat is the
 * user's single worst number — the reveal exists to land that, not to recite
 * their age. Tapping anywhere skips; callers skip it entirely for anyone who
 * prefers reduced motion.
 */
export function Reveal({
  result,
  onDone,
}: {
  result: LifeResult;
  onDone: () => void;
}) {
  const [beat, setBeat] = React.useState(0);

  React.useEffect(() => {
    const timers = Array.from({ length: BEATS - 1 }, (_, i) =>
      setTimeout(() => setBeat(i + 1), BEAT_MS * (i + 1)),
    );
    timers.push(setTimeout(onDone, BEAT_MS * BEATS));
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  const worst = result.questionable ?? result.biggest;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-paper px-6 text-center">
      <div
        key={beat}
        className="pointer-events-none w-full max-w-[34rem] animate-fade-up"
        role="status"
        aria-live="polite"
      >
        {beat === 0 ? (
          <p className="font-display text-[clamp(3.25rem,16vw,6rem)] leading-[0.95] tracking-[-0.03em]">
            You&rsquo;re {result.age}.
          </p>
        ) : null}

        {beat === 1 ? (
          <>
            <p className="text-[1.0625rem] text-ink-muted">
              That is about
            </p>
            <p className="tnum mt-2 font-display text-[clamp(3rem,14vw,5.5rem)] leading-none tracking-[-0.03em]">
              <CountUp value={result.daysLived} duration={900} /> days.
            </p>
          </>
        ) : null}

        {beat === 2 ? (
          worst ? (
            <>
              <p className="eyebrow">You have already spent</p>
              <p className="tnum mt-3 font-display text-[clamp(4.25rem,23vw,8.5rem)] leading-[0.88] tracking-[-0.04em] text-stamp">
                {formatDuration(worst.yearsSpent)}
              </p>
              <p className="mt-3 font-display text-[clamp(1.5rem,7vw,2.5rem)] leading-tight">
                of them {gerund(worst.id, worst.label)}.
              </p>
            </>
          ) : (
            <p className="font-display text-[clamp(1.75rem,8vw,2.75rem)] leading-tight italic">
              And this is where it went.
            </p>
          )
        ) : null}
      </div>

      {/* Full-bleed skip target: tap anywhere, or focus the visible label. */}
      <button
        type="button"
        onClick={onDone}
        className="absolute inset-0 flex items-end justify-end p-5 pb-[calc(1.5rem+var(--safe-bottom))] focus-visible:outline-offset-[-4px] sm:p-8"
      >
        <span className="font-mono text-[0.75rem] tracking-[0.14em] text-ink-faint uppercase underline decoration-ink/25 underline-offset-4">
          Skip →
        </span>
      </button>
    </div>
  );
}

function gerund(id: string, label: string) {
  switch (id) {
    case "social":
      return "scrolling";
    case "streaming":
      return "streaming";
    case "gaming":
      return "gaming";
    case "commute":
      return "commuting";
    case "work":
      return "working";
    case "sleep":
      return "asleep";
    default:
      return `on ${label.toLowerCase()}`;
  }
}
