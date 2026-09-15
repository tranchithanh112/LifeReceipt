"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Pencil, RefreshCw } from "lucide-react";

import { Receipt } from "@/components/receipt/receipt";
import { FutureSelf } from "@/components/results/future-self";
import { Reveal } from "@/components/results/reveal";
import { Section } from "@/components/results/section";
import { ShareSection } from "@/components/results/share-section";
import { StatGrid } from "@/components/results/stat-grid";
import { ViralLoop } from "@/components/results/viral-loop";
import { WhatIf } from "@/components/results/what-if";
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

        {/* ------------------- The receipt ------------------- */}
        <section className="px-5 pt-8 pb-12 sm:px-8 sm:pt-12">
          <div className="mx-auto w-full max-w-3xl">
            <div className="flex flex-col items-center">
              <Receipt
                result={result}
                name={answers.name}
                onNameChange={setName}
                animate={!revealing}
                verdict={receiptVerdict(result)}
              />

              <p className="mt-5 max-w-[24rem] text-center text-[0.75rem] leading-relaxed text-ink-faint">
                Tap the customer line to put your name on it. Some activities overlap, so
                totals are estimates rather than a literal 24-hour accounting.
              </p>

              {empty ? (
                <Link
                  href="/calculate"
                  className={cn(buttonVariants({ variant: "primary", size: "md" }), "mt-6")}
                >
                  Add some activities
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              ) : null}
            </div>
          </div>
        </section>

        {/* ------------------- Shock stats ------------------- */}
        {stats.length > 0 ? (
          <Section
            eyebrow="If nothing changes"
            title="The part nobody tells you"
            lede="Generated from the numbers you just entered. No averages, no strangers — yours."
          >
            <StatGrid stats={stats} />
          </Section>
        ) : null}

        {/* ------------------- Humour ------------------- */}
        {quips.length > 0 ? (
          <Section eyebrow="Notes on your spending" bordered>
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

        {/* ------------------- Future self ------------------- */}
        {!empty ? (
          <Section
            eyebrow="Projection"
            title={`If you continue like this until ${result.lifeExpectancy}…`}
            lede="Same habits, same rates, no surprises. This is the straight-line forecast."
          >
            <FutureSelf result={result} onLifeExpectancyChange={setLifeExpectancy} />
          </Section>
        ) : null}

        {/* ------------------- What-if ------------------- */}
        {!empty && result.yearsRemaining > 0 ? (
          <Section
            eyebrow="The only refund available"
            title="What if you changed one thing?"
            lede="Your receipt says no refunds. This is the exception. Drag a habit down and watch the years come back."
          >
            <WhatIf result={result} />
          </Section>
        ) : null}

        {/* ------------------- Share ------------------- */}
        {!empty ? (
          <Section
            eyebrow="Make it everyone's problem"
            title="Share your LifeReceipt"
            lede="Two cards, both built for a story. Pick one, download it, ruin someone's afternoon."
          >
            <ShareSection result={result} name={answers.name} />
          </Section>
        ) : null}

        {/* ------------------- Viral loop ------------------- */}
        {!empty ? (
          <Section eyebrow="Think your numbers are bad?" title="Find out whose are worse.">
            <ViralLoop result={result} />
          </Section>
        ) : null}

        {/* ------------------- Method & privacy ------------------- */}
        <Section eyebrow="How this was calculated">
          <div className="space-y-4 text-[0.9375rem] leading-relaxed text-ink-muted">
            <p>
              Every answer is converted into an average number of hours per day, then
              multiplied across your life so far and forward to age{" "}
              {result.lifeExpectancy}. Weekday answers are spread over five days a week,
              weekly answers over seven.
            </p>
            <p>
              Activities are allowed to overlap — scrolling during a commute is counted on
              both lines, because it costs you both times. That means the itemised total
              can exceed your age. It is a receipt, not an audit.
            </p>
            <p>
              Everything runs in your browser. Your answers are saved to this device only,
              and clearing them below removes them for good.
            </p>
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
