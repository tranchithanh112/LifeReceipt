"use client";

import * as React from "react";

import { CountUp } from "@/components/count-up";
import type { LifeResult } from "@/lib/calc";

const BEAT_MS = 1300;

/**
 * The three-beat build-up before the receipt prints. Tapping anywhere skips
 * it; callers skip it entirely when the user prefers reduced motion.
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
    const timers = [
      setTimeout(() => setBeat(1), BEAT_MS),
      setTimeout(() => setBeat(2), BEAT_MS * 2),
      setTimeout(onDone, BEAT_MS * 3),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-paper px-6 text-center">
      <div
        className="pointer-events-none w-full max-w-[34rem]"
        role="status"
        aria-live="polite"
      >
        <p className="animate-fade-up font-display text-[clamp(3rem,14vw,5.5rem)] leading-[0.95] tracking-[-0.03em]">
          You&rsquo;re {result.age}.
        </p>

        {beat >= 1 ? (
          <div className="mt-8 animate-fade-up">
            <p className="text-[1.0625rem] text-ink-muted">
              So far, you&rsquo;ve lived about
            </p>
            <p className="tnum mt-2 font-display text-[clamp(2.75rem,12vw,4.5rem)] leading-none tracking-[-0.03em]">
              <CountUp value={result.daysLived} duration={1100} /> days.
            </p>
          </div>
        ) : null}

        {beat >= 2 ? (
          <p className="mt-10 animate-fade-up font-display text-[clamp(1.5rem,6vw,2.25rem)] leading-tight text-ink-muted italic">
            And this is where it went.
          </p>
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
