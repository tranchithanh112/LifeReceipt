"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Pencil, RefreshCw } from "lucide-react";

import { CustomItems } from "@/components/custom-items";
import { Receipt } from "@/components/receipt/receipt";
import { Forecast } from "@/components/results/forecast";
import { Reveal } from "@/components/results/reveal";
import { Section } from "@/components/results/section";
import { ShareSection } from "@/components/results/share-section";
import { StatGrid } from "@/components/results/stat-grid";
import { SiteFooter } from "@/components/site/site-footer";
import { Wordmark } from "@/components/site/wordmark";
import { Button, buttonVariants } from "@/components/ui/button";
import { usePrefersReducedMotion } from "@/hooks/use-motion";
import { useRevealGate } from "@/hooks/use-reveal-gate";
import { buildQuips, receiptVerdict } from "@/lib/humor";
import { useLifeReceipt } from "@/lib/state";
import { buildStats } from "@/lib/stats";
import { cn } from "@/lib/utils";

export function ResultsView() {
  const { answers, result, hydrated, setName, setLifeExpectancy, reset } = useLifeReceipt();
  const { seen, markSeen } = useRevealGate();
  const reducedMotion = usePrefersReducedMotion();

  const revealing = hydrated && result != null && !seen && !reducedMotion;

  if (!hydrated) return <ResultsSkeleton />;
  if (!result) return <NoAnswers />;

  const stats = buildStats(result);
  const quips = buildQuips(result, 3);
  const empty = result.items.length === 0;

  return (
    <>
      {revealing ? <Reveal result={result} onDone={markSeen} /> : null}

      <header className="no-print px-5 pt-[calc(1.25rem+var(--safe-top))] sm:px-8">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4">
          <Wordmark />
          {/* Labels collapse to icons on narrow screens; the same two actions
              are spelled out in full at the bottom of the page. */}
          <div className="flex items-center gap-1">
            <Link
              href="/calculate"
              aria-label="Edit answers"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "px-2.5 sm:px-4")}
            >
              <Pencil className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">Edit answers</span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={reset}
              aria-label="Start over"
              className="px-2.5 sm:px-4"
            >
              <RefreshCw className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">Start over</span>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <h1 className="sr-only">
          Your LifeReceipt — where the years have gone, and where they are going
        </h1>

        {/* ------------------- The receipt -------------------
            Nothing but the artefact here. Instructions and caveats live
            further down; this is the screenshot moment. */}
        <section className="px-5 pt-8 pb-12 sm:px-8 sm:pt-12">
          <div className="mx-auto flex w-full max-w-3xl flex-col items-center">
            <Receipt
              result={result}
              name={answers.name}
              onNameChange={setName}
              animate={!revealing}
              verdict={receiptVerdict(result)}
            />

            {empty ? (
              <Link
                href="/calculate"
                className={cn(buttonVariants({ variant: "primary", size: "md" }), "mt-8")}
              >
                Add some activities
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            ) : null}
          </div>
        </section>

        {/* ------------------- Shock stats ------------------- */}
        {stats.length > 0 ? (
          <Section eyebrow="If nothing changes" title="The part nobody tells you">
            <StatGrid stats={stats} />
          </Section>
        ) : null}

        {/* ------------------- Humour ------------------- */}
        {quips.length > 0 ? (
          <Section eyebrow="Notes on your spending">
            <ul className="space-y-5">
              {quips.map((quip) => (
                <li
                  key={quip.id}
                  className="border-l-2 border-ink pl-5 font-display text-[clamp(1.35rem,5.5vw,1.9rem)] leading-[1.25] tracking-[-0.01em] text-balance"
                >
                  {quip.text}
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {/* ------------------- Forecast + refund ------------------- */}
        {!empty ? (
          <Section
            eyebrow="The only refund available"
            title={`If you carry on until ${result.lifeExpectancy}…`}
          >
            <Forecast result={result} onLifeExpectancyChange={setLifeExpectancy} />
          </Section>
        ) : null}

        {/* ------------------- Share + hand-off ------------------- */}
        {!empty ? (
          <Section eyebrow="Make it everyone's problem" title="Share your LifeReceipt">
            <ShareSection result={result} name={answers.name} />
          </Section>
        ) : null}

        {/* ------------------- Method, tweaks & privacy ------------------- */}
        <Section eyebrow="The small print">
          <div className="space-y-4 text-[0.9375rem] leading-relaxed text-ink-muted">
            <p>
              Every answer becomes an average number of hours per day, multiplied across
              your life so far and forward to age {result.lifeExpectancy}. Weekday answers
              spread over five days a week, weekly answers over seven.
            </p>
            <p>
              Activities are allowed to overlap — scrolling on a commute is counted on both
              lines, because it costs you both times. The itemised total can therefore
              exceed your age. It is a receipt, not an audit.
            </p>
            <p>
              Everything runs in your browser. Your answers are saved to this device only,
              and clearing them below removes them for good.
            </p>
          </div>

          <div className="mt-8 border-t border-ink/15 pt-6">
            <p className="eyebrow">Missed something?</p>
            <div className="mt-4">
              <CustomItems />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/calculate"
              className={cn(buttonVariants({ variant: "outline", size: "md" }))}
            >
              <Pencil className="h-4 w-4" aria-hidden />
              Change my answers
            </Link>
            <Button variant="ghost" size="md" onClick={reset}>
              <RefreshCw className="h-4 w-4" aria-hidden />
              Start over
            </Button>
          </div>
        </Section>
      </main>

      <SiteFooter />
    </>
  );
}

function ResultsSkeleton() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-5">
      <p className="eyebrow animate-pulse">Printing…</p>
    </div>
  );
}

function NoAnswers() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <div>
        <p className="eyebrow">Nothing to print</p>
        <h1 className="mt-4 font-display text-[clamp(2.25rem,9vw,3.5rem)] leading-[1.02] tracking-[-0.02em]">
          We haven&rsquo;t billed you yet.
        </h1>
        <p className="mt-4 max-w-[34ch] text-ink-muted">
          Answer a handful of questions and your receipt prints in about thirty seconds.
        </p>
      </div>

      <Link
        href="/calculate"
        className={cn(buttonVariants({ variant: "primary", size: "lg" }), "group")}
      >
        Calculate my life
        <ArrowRight
          className="h-[1.1em] w-[1.1em] transition-transform duration-200 group-hover:translate-x-1"
          aria-hidden
        />
      </Link>
    </div>
  );
}
