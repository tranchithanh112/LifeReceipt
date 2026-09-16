import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PrimaryCta } from "@/components/landing/primary-cta";
import { StickyCta } from "@/components/landing/sticky-cta";
import { Receipt } from "@/components/receipt/receipt";
import { SiteFooter } from "@/components/site/site-footer";
import { Wordmark } from "@/components/site/wordmark";
import { buttonVariants } from "@/components/ui/button";
import { AVERAGE_LIFE, demoResult } from "@/lib/demo";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const sample = demoResult();
  // Resolved once at render and passed down, so hydration sees the same date.
  const issuedAt = new Date();

  return (
    <>
      <header className="no-print px-5 pt-[calc(1.25rem+var(--safe-top))] sm:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <Wordmark asLink={false} />
        </div>
      </header>

      <main id="main">
        {/* ---------------- Hero ----------------
            The artefact does the explaining, so the copy above it stays short
            enough that the receipt itself is on screen within a phone's first
            viewport. overflow-x-clip contains the decorative rotations. */}
        <section className="overflow-x-clip px-5 pt-8 pb-12 sm:px-8 sm:pt-14 sm:pb-16 lg:pt-20">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-9 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
            <div className="animate-fade-up">
              <h1 className="font-display text-[clamp(2.875rem,12.5vw,7rem)] leading-[0.88] tracking-[-0.02em] text-balance">
                Where did your life <em className="italic">go?</em>
              </h1>

              <p className="mt-5 max-w-[26ch] text-[1.0625rem] text-ink-muted text-balance sm:text-lg">
                Nine questions. One very uncomfortable receipt.
              </p>

              <PrimaryCta className="mt-7" id="hero-cta" />
            </div>

            {/* The sample receipt: the real component, real maths, fake person. */}
            <div className="relative flex justify-center lg:justify-end">
              <div
                aria-hidden
                className="pointer-events-none absolute top-6 -z-10 h-[86%] w-[78%] rounded-[3px] bg-paper-deep/70 [transform:rotate(4.5deg)]"
              />
              <div className="w-full max-w-[24rem] sm:[transform:rotate(-2.2deg)]">
                <Receipt
                  result={sample}
                  name="Sample"
                  issuedAt={issuedAt}
                  variant="preview"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- Average-life ticker ---------------- */}
        <section
          aria-label="What an average 80-year life costs"
          className="border-y border-rule/70 bg-paper-deep/40"
        >
          <div className="mx-auto w-full max-w-6xl px-5 py-9 sm:px-8 sm:py-11">
            <p className="eyebrow">In an average 80-year life you will spend</p>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
              {AVERAGE_LIFE.map((entry) => (
                <li key={entry.label}>
                  <p className="tnum font-display text-[clamp(1.75rem,6vw,2.5rem)] leading-none">
                    {entry.value}
                  </p>
                  <p className="mt-1.5 text-[0.8125rem] text-ink-muted">{entry.label}</p>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[0.9375rem] text-ink-muted">
              Yours are worse somewhere very specific. That&rsquo;s the part worth
              finding out.
            </p>
          </div>
        </section>

        {/* ---------------- Close ---------------- */}
        <section className="px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-8 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="max-w-[16ch] font-display text-[clamp(2.25rem,8.5vw,4rem)] leading-[0.95] tracking-[-0.02em]">
              You only get one. Where is it going?
            </h2>

            <Link
              id="final-cta"
              href="/calculate"
              className={cn(
                buttonVariants({ variant: "primary", size: "lg" }),
                "group w-full shrink-0 sm:w-auto",
              )}
            >
              Print my LifeReceipt
              <ArrowRight
                className="h-[1.1em] w-[1.1em] transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden
              />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter className="mb-[4.5rem] sm:mb-0" />
      <StickyCta watch="hero-cta,final-cta" />
    </>
  );
}
