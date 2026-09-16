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
import { LocaleSwitch } from "@/components/site/locale-switch";
import { Wordmark } from "@/components/site/wordmark";
import { Button, buttonVariants } from "@/components/ui/button";
import { usePrefersReducedMotion } from "@/hooks/use-motion";
import { useRevealGate } from "@/hooks/use-reveal-gate";
import { buildQuips, receiptVerdict } from "@/lib/humor";
import { useT } from "@/lib/i18n";
import { useLifeReceipt } from "@/lib/state";
import { buildStats } from "@/lib/stats";
import { cn } from "@/lib/utils";

export function ResultsView() {
  const t = useT();
  const { answers, result, hydrated, setName, setLifeExpectancy, reset } = useLifeReceipt();
  const { seen, markSeen } = useRevealGate();
  const reducedMotion = usePrefersReducedMotion();

  const revealing = hydrated && result != null && !seen && !reducedMotion;

  if (!hydrated) return <ResultsSkeleton label={t.results.printing} />;
  if (!result) return <NoAnswers t={t} />;

  const stats = buildStats(result, t);
  const quips = buildQuips(result, t, 3);
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
            <LocaleSwitch className="mr-1" />
            <Link
              href="/calculate"
              aria-label={t.results.editAnswers}
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "px-2.5 sm:px-4")}
            >
              <Pencil className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">{t.results.editAnswers}</span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={reset}
              aria-label={t.results.startOver}
              className="px-2.5 sm:px-4"
            >
              <RefreshCw className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">{t.results.startOver}</span>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <h1 className="sr-only">{t.results.srHeading}</h1>

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
              verdict={receiptVerdict(result, t)}
            />

            {empty ? (
              <Link
                href="/calculate"
                className={cn(buttonVariants({ variant: "primary", size: "md" }), "mt-8")}
              >
                {t.results.addActivities}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            ) : null}
          </div>
        </section>

        {/* ------------------- Shock stats ------------------- */}
        {stats.length > 0 ? (
          <Section eyebrow={t.results.statsEyebrow} title={t.results.statsTitle}>
            <StatGrid stats={stats} />
          </Section>
        ) : null}

        {/* ------------------- Humour ------------------- */}
        {quips.length > 0 ? (
          <Section eyebrow={t.results.quipsEyebrow}>
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
            eyebrow={t.results.forecastEyebrow}
            title={t.results.forecastTitle(result.lifeExpectancy)}
          >
            <Forecast result={result} onLifeExpectancyChange={setLifeExpectancy} />
          </Section>
        ) : null}

        {/* ------------------- Share + hand-off ------------------- */}
        {!empty ? (
          <Section eyebrow={t.results.shareEyebrow} title={t.results.shareTitle}>
            <ShareSection result={result} name={answers.name} />
          </Section>
        ) : null}

        {/* ------------------- Method, tweaks & privacy ------------------- */}
        <Section eyebrow={t.results.smallPrint}>
          <div className="space-y-4 text-[0.9375rem] leading-relaxed text-ink-muted">
            <p>{t.results.method1(result.lifeExpectancy)}</p>
            <p>{t.results.method2}</p>
            <p>{t.results.method3}</p>
          </div>

          <div className="mt-8 border-t border-ink/15 pt-6">
            <p className="eyebrow">{t.results.missedSomething}</p>
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
              {t.results.changeAnswers}
            </Link>
            <Button variant="ghost" size="md" onClick={reset}>
              <RefreshCw className="h-4 w-4" aria-hidden />
              {t.results.startOver}
            </Button>
          </div>
        </Section>
      </main>

      <SiteFooter />
    </>
  );
}

function ResultsSkeleton({ label }: { label: string }) {
  return (
    <div className="flex min-h-dvh items-center justify-center px-5">
      <p className="eyebrow animate-pulse">{label}</p>
    </div>
  );
}

function NoAnswers({ t }: { t: ReturnType<typeof useT> }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <div>
        <p className="eyebrow">{t.results.nothingToPrint}</p>
        <h1 className="mt-4 font-display text-[clamp(2.25rem,9vw,3.5rem)] leading-[1.02] tracking-[-0.02em]">
          {t.results.notBilledYet}
        </h1>
        <p className="mt-4 max-w-[34ch] text-ink-muted">
          {t.results.notBilledBody}
        </p>
      </div>

      <Link
        href="/calculate"
        className={cn(buttonVariants({ variant: "primary", size: "lg" }), "group")}
      >
        {t.meta.calculateTitle}
        <ArrowRight
          className="h-[1.1em] w-[1.1em] transition-transform duration-200 group-hover:translate-x-1"
          aria-hidden
        />
      </Link>
    </div>
  );
}
