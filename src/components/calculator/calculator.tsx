"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Plus, Trash2 } from "lucide-react";

import { ProgressRail } from "@/components/calculator/progress-rail";
import { Button } from "@/components/ui/button";
import { NumberField } from "@/components/ui/number-field";
import { Slider } from "@/components/ui/slider";
import { Wordmark } from "@/components/site/wordmark";
import {
  ACTIVITIES,
  AGE_MAX,
  AGE_MIN,
  CADENCE_UNIT,
  type ActivityDef,
} from "@/lib/activities";
import { toHoursPerDay, yearsOf } from "@/lib/calc";
import { formatDuration, formatNumber, round } from "@/lib/format";
import { useLifeReceipt } from "@/lib/state";
import { DAYS_IN_YEAR } from "@/lib/format";
import { cn } from "@/lib/utils";

type Step = { kind: "age" } | { kind: "activity"; def: ActivityDef } | { kind: "custom" };

const STEPS: Step[] = [
  { kind: "age" },
  ...ACTIVITIES.map((def) => ({ kind: "activity" as const, def })),
  { kind: "custom" },
];

export function Calculator() {
  const router = useRouter();
  const { answers, hydrated, setAge, setValue, addCustom, updateCustom, removeCustom, reset } =
    useLifeReceipt();
  const [index, setIndex] = React.useState(0);

  const step = STEPS[index];
  const isLast = index === STEPS.length - 1;

  const goNext = React.useCallback(() => {
    if (isLast) {
      router.push("/results");
      return;
    }
    setIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }, [isLast, router]);

  const goBack = React.useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  /** Commits the visible value (or the sensible default) and advances. */
  const confirmAndNext = React.useCallback(() => {
    if (step.kind === "age" && answers.age == null) {
      setAge(DEFAULT_AGE);
    }
    if (step.kind === "activity") {
      const current = answers.values[step.def.id];
      if (current === undefined) setValue(step.def.id, step.def.fallback);
    }
    goNext();
  }, [answers.age, answers.values, goNext, setAge, setValue, step]);

  const skip = React.useCallback(() => {
    if (step.kind === "activity") setValue(step.def.id, null);
    goNext();
  }, [goNext, setValue, step]);

  // Enter advances, but never while the user is mid-word in a text field.
  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" || event.shiftKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.tagName === "INPUT" && target.getAttribute("type") === "text") return;
      confirmAndNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [confirmAndNext]);

  const startOver = () => {
    reset();
    setIndex(0);
  };

  if (!hydrated) return <CalculatorSkeleton />;

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="no-print px-5 pt-[calc(1.25rem+var(--safe-top))] sm:px-8">
        <div className="mx-auto w-full max-w-2xl">
          <div className="flex items-center justify-between gap-4">
            <Wordmark />
            <button
              type="button"
              onClick={startOver}
              className="text-[0.75rem] text-ink-faint underline decoration-ink/25 underline-offset-4 transition-colors hover:text-ink"
            >
              Start over
            </button>
          </div>
          <ProgressRail current={index} total={STEPS.length} className="mt-5" />
        </div>
      </header>

      {/* `safe center` keeps a tall step (the custom-activity list) reachable
          instead of clipping its top the way plain centring would. */}
      <main className="flex flex-1 items-center-safe px-5 py-8 sm:px-8 sm:py-10">
        <div className="mx-auto w-full max-w-2xl">
          {/* key forces the enter animation to replay on every step */}
          <div key={index} className="animate-fade-up">
            {step.kind === "age" ? (
              <AgeStep value={answers.age} onChange={setAge} />
            ) : null}

            {step.kind === "activity" ? (
              <ActivityStep
                def={step.def}
                age={answers.age}
                value={answers.values[step.def.id]}
                onChange={(next) => setValue(step.def.id, next)}
              />
            ) : null}

            {step.kind === "custom" ? (
              <CustomStep
                items={answers.custom}
                onAdd={addCustom}
                onUpdate={updateCustom}
                onRemove={removeCustom}
              />
            ) : null}
          </div>
        </div>
      </main>

      <footer className="no-print sticky bottom-0 border-t border-rule/70 bg-paper/85 px-5 py-4 pb-[calc(1rem+var(--safe-bottom))] backdrop-blur-sm sm:px-8">
        <div className="mx-auto flex w-full max-w-2xl items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={goBack}
            disabled={index === 0}
            aria-label="Previous question"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden />
          </Button>

          {step.kind === "activity" && !step.def.required ? (
            <Button variant="ghost" size="md" onClick={skip}>
              Skip
            </Button>
          ) : null}

          <Button
            variant="primary"
            size="lg"
            onClick={confirmAndNext}
            className="group ml-auto min-w-[9.5rem] flex-1 sm:flex-none"
          >
            {isLast ? "Print my receipt" : "Continue"}
            <ArrowRight
              className="h-[1.1em] w-[1.1em] transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden
            />
          </Button>
        </div>
      </footer>
    </div>
  );
}

const DEFAULT_AGE = 28;

/* ------------------------------------------------------------------ */

function StepHeading({
  eyebrow,
  question,
  hint,
}: {
  eyebrow: string;
  question: string;
  hint?: string;
}) {
  return (
    <div>
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-4 font-display text-[clamp(2rem,7.5vw,3.25rem)] leading-[1.02] tracking-[-0.015em] text-balance">
        {question}
      </h1>
      {hint ? <p className="mt-3 text-[0.9375rem] text-ink-muted">{hint}</p> : null}
    </div>
  );
}

function BigValue({ value, unit }: { value: string; unit: string }) {
  return (
    <p className="flex items-baseline gap-3">
      <span className="tnum font-display text-[clamp(3.5rem,16vw,5.5rem)] leading-none tracking-[-0.03em]">
        {value}
      </span>
      <span className="text-[0.9375rem] text-ink-muted">{unit}</span>
    </p>
  );
}

function Consequence({ children }: { children: React.ReactNode }) {
  return (
    <p
      aria-live="polite"
      className="mt-6 min-h-[1.5rem] font-mono text-[0.8125rem] leading-relaxed text-ink-muted"
    >
      {children}
    </p>
  );
}

/* ---------------------------- Age ---------------------------- */

function AgeStep({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (age: number) => void;
}) {
  const age = value ?? DEFAULT_AGE;
  const days = Math.round(age * DAYS_IN_YEAR);

  return (
    <div>
      <StepHeading eyebrow="First things first" question="How old are you?" />

      <div className="mt-10">
        <BigValue value={String(age)} unit="years old" />

        <Slider
          className="mt-8"
          value={[age]}
          min={AGE_MIN}
          max={AGE_MAX}
          step={1}
          onValueChange={([next]) => onChange(next)}
          aria-label="Your age"
        />

        <div className="mt-4 flex items-center justify-between gap-4">
          <span className="font-mono text-[0.6875rem] text-ink-faint">{AGE_MIN}</span>
          <NumberField
            label="Your age, exact value"
            controlName="age"
            value={age}
            onChange={onChange}
            min={AGE_MIN}
            max={AGE_MAX}
            step={1}
            suffix="yrs"
          />
          <span className="font-mono text-[0.6875rem] text-ink-faint">{AGE_MAX}</span>
        </div>

        <Consequence>
          You have been alive for roughly{" "}
          <strong className="font-semibold text-ink">{formatNumber(days)} days</strong>.
        </Consequence>
      </div>
    </div>
  );
}

/* -------------------------- Activity -------------------------- */

function ActivityStep({
  def,
  age,
  value,
  onChange,
}: {
  def: ActivityDef;
  age: number | null;
  value: number | null | undefined;
  onChange: (value: number) => void;
}) {
  const skipped = value === null;
  const current = value ?? def.fallback;
  const hoursPerDay = toHoursPerDay(current, def.cadence);
  const spent = age != null ? yearsOf(hoursPerDay, age) : null;

  return (
    <div>
      <StepHeading
        eyebrow={`${def.emoji}  ${def.label}`}
        question={def.question}
        hint={def.hint}
      />

      <div className={cn("mt-10 transition-opacity", skipped && "opacity-45")}>
        <BigValue value={formatValue(current)} unit={CADENCE_UNIT[def.cadence]} />

        <Slider
          className="mt-8"
          value={[current]}
          min={def.min}
          max={def.max}
          step={def.step}
          ticks={ticksFor(def)}
          onValueChange={([next]) => onChange(next)}
          aria-label={def.question}
        />

        <div className="mt-4 flex items-center justify-between gap-4">
          <span className="font-mono text-[0.6875rem] text-ink-faint">{def.min}h</span>
          <NumberField
            label={`${def.label}, exact value`}
            controlName={def.label.toLowerCase()}
            value={current}
            onChange={onChange}
            min={def.min}
            max={def.max}
            step={def.step}
            suffix="h"
          />
          <span className="font-mono text-[0.6875rem] text-ink-faint">{def.max}h</span>
        </div>

        <Consequence>
          {skipped ? (
            "Skipped — move the slider to put it back on the receipt."
          ) : spent != null && spent > 0 ? (
            <>
              That is{" "}
              <strong className="font-semibold text-ink">{formatDuration(spent)}</strong> of
              your life so far, and{" "}
              <strong className="font-semibold text-ink">
                {formatNumber(hoursPerDay * DAYS_IN_YEAR)} hours
              </strong>{" "}
              every year.
            </>
          ) : (
            "Zero. Nothing to bill you for."
          )}
        </Consequence>
      </div>
    </div>
  );
}

function formatValue(value: number) {
  return Number.isInteger(value) ? String(value) : String(round(value, 2));
}

/** Draw notches only when there are few enough to stay legible. */
function ticksFor(def: ActivityDef) {
  const count = Math.round((def.max - def.min) / def.step);
  return count <= 32 ? count : Math.round(def.max - def.min);
}

/* --------------------------- Custom --------------------------- */

function CustomStep({
  items,
  onAdd,
  onUpdate,
  onRemove,
}: {
  items: ReturnType<typeof useLifeReceipt>["answers"]["custom"];
  onAdd: ReturnType<typeof useLifeReceipt>["addCustom"];
  onUpdate: ReturnType<typeof useLifeReceipt>["updateCustom"];
  onRemove: ReturnType<typeof useLifeReceipt>["removeCustom"];
}) {
  return (
    <div>
      <StepHeading
        eyebrow="✳️  Optional"
        question="Anything else eating your life?"
        hint="Cooking, doomscrolling the news, group chats, an unusually demanding hobby. Or skip — the receipt prints either way."
      />

      <ul className="mt-8 space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex flex-wrap items-center gap-3 rounded-2xl border border-ink/12 bg-receipt/60 p-3"
          >
            <input
              value={item.label}
              onChange={(event) => onUpdate(item.id, { label: event.target.value })}
              placeholder="Activity"
              maxLength={24}
              aria-label="Activity name"
              className="min-w-[8rem] flex-1 bg-transparent px-1 text-[0.9375rem] font-medium text-ink outline-none placeholder:text-ink-faint"
            />

            <NumberField
              label={`Hours for ${item.label || "this activity"}`}
              controlName="hours"
              value={item.value}
              onChange={(value) => onUpdate(item.id, { value })}
              min={0}
              max={item.cadence === "daily" ? 14 : 60}
              step={0.25}
              suffix="h"
            />

            <div
              role="group"
              aria-label="How often"
              className="inline-flex overflow-hidden rounded-full border border-ink/15"
            >
              {(["daily", "weekly"] as const).map((cadence) => (
                <button
                  key={cadence}
                  type="button"
                  aria-pressed={item.cadence === cadence}
                  onClick={() => onUpdate(item.id, { cadence })}
                  className={cn(
                    "px-3 py-1.5 font-mono text-[0.6875rem] tracking-wide uppercase transition-colors",
                    item.cadence === cadence
                      ? "bg-ink text-paper"
                      : "text-ink-muted hover:bg-ink/[0.06]",
                  )}
                >
                  {cadence === "daily" ? "/day" : "/week"}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onRemove(item.id)}
              aria-label={`Remove ${item.label || "activity"}`}
              className="grid h-9 w-9 place-items-center rounded-full text-ink-faint transition-colors hover:bg-ink/[0.06] hover:text-stamp"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
            </button>
          </li>
        ))}
      </ul>

      {items.length < 6 ? (
        <Button
          variant="outline"
          size="md"
          className="mt-4"
          onClick={() => onAdd({ label: "", value: 1, cadence: "daily" })}
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add an activity
        </Button>
      ) : (
        <p className="mt-4 text-[0.8125rem] text-ink-faint">
          Six custom activities is plenty. The receipt has to fit on a phone.
        </p>
      )}
    </div>
  );
}

/* --------------------------- Skeleton --------------------------- */

function CalculatorSkeleton() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-5">
      <p className="eyebrow animate-pulse">Loading your answers…</p>
    </div>
  );
}
