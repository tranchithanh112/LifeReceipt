"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";

import { cn, clamp, snap } from "@/lib/utils";

/**
 * A number input with stepper buttons, used beside every slider so people can
 * be exact when they want to. Keeps its own draft string while focused so
 * typing "1" on the way to "12" doesn't get clamped out from under the caret.
 */
export function NumberField({
  value,
  onChange,
  min,
  max,
  step,
  suffix,
  label,
  controlName,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  /** Accessible name for the input itself. Must differ from the slider's. */
  label: string;
  /** Short noun used in the stepper button labels. Defaults to `label`. */
  controlName?: string;
  className?: string;
}) {
  const name = controlName ?? label;
  const [draft, setDraft] = React.useState<string | null>(null);

  const commit = (raw: string) => {
    const parsed = Number.parseFloat(raw.replace(",", "."));
    setDraft(null);
    if (!Number.isFinite(parsed)) return;
    onChange(clamp(snap(parsed, step), min, max));
  };

  const nudge = (direction: 1 | -1) => {
    onChange(clamp(snap(value + direction * step, step), min, max));
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-ink/15 bg-receipt/70 p-1",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => nudge(-1)}
        disabled={value <= min}
        aria-label={`Decrease ${name}`}
        className="grid h-8 w-8 place-items-center rounded-full text-ink transition-colors hover:bg-ink/[0.07] disabled:opacity-30"
      >
        <Minus className="h-4 w-4" aria-hidden />
      </button>

      <div className="flex items-baseline">
        <input
          type="text"
          inputMode="decimal"
          aria-label={label}
          value={draft ?? String(value)}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={(event) => commit(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.currentTarget.blur();
            }
          }}
          className="tnum w-[3.25rem] bg-transparent text-center font-mono text-[0.9375rem] font-medium text-ink outline-none"
        />
        {suffix ? (
          <span className="-ml-1 pr-1 font-mono text-[0.75rem] text-ink-faint">{suffix}</span>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => nudge(1)}
        disabled={value >= max}
        aria-label={`Increase ${name}`}
        className="grid h-8 w-8 place-items-center rounded-full text-ink transition-colors hover:bg-ink/[0.07] disabled:opacity-30"
      >
        <Plus className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
