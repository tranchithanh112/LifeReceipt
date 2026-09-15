import Link from "next/link";
import { ArrowRight, Clock3, Receipt as ReceiptIcon, Undo2 } from "lucide-react";

import { PrimaryCta } from "@/components/landing/primary-cta";
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
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
          <Wordmark asLink={false} />
          <p className="hidden text-[0.75rem] text-ink-faint sm:block">
            Client-side only. Nothing leaves your phone.
          </p>
        </div>
      </header>

      <main id="main">
        {/* ---------------- Hero ---------------- */}
        {/* overflow-x-clip: the decorative rotations below must not create a
            horizontal scrollbar on narrow screens. */}
        <section className="overflow-x-clip px-5 pt-10 pb-16 sm:px-8 sm:pt-16 lg:pt-20">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
            <div className="animate-fade-up">
              <p className="eyebrow">An itemised bill for your one life</p>

              <h1 className="mt-5 font-display text-[clamp(3.25rem,13.5vw,7rem)] leading-[0.87] tracking-[-0.02em] text-balance">
                Where did your life <em className="italic">go?</em>
              </h1>

              <p className="mt-6 max-w-[34rem] text-[1.0625rem] leading-relaxed text-ink-muted sm:text-lg">
                See how many years of your life you&rsquo;ve spent sleeping, working,
                scrolling, commuting and everything in between.
              </p>

              <PrimaryCta className="mt-8" />
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
          <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
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
            <p className="mt-6 max-w-[42rem] text-[0.8125rem] leading-relaxed text-ink-faint">
              Those are averages. Yours are almost certainly worse in one specific,
              extremely personal way. That is the part worth finding out.
            </p>
          </div>
        </section>

        {/* ---------------- What it prints ---------------- */}
        <section className="px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto w-full max-w-6xl">
            <h2 className="max-w-[24rem] font-display text-[clamp(2rem,6vw,3rem)] leading-[1.02] tracking-[-0.015em]">
              Nine questions. One uncomfortable receipt.
            </h2>

            <ul className="mt-10 grid gap-10 sm:grid-cols-3 sm:gap-8">
              <Feature
                icon={<ReceiptIcon className="h-5 w-5" aria-hidden />}
                step="01"
                title="Your life, itemised"
                body="Every habit printed as a line item, in years and months, on a receipt you can screenshot."
              />
              <Feature
                icon={<Clock3 className="h-5 w-5" aria-hidden />}
                step="02"
                title="The projection"
                body="What each habit has already cost you, and what it will cost by the time you're 80 if nothing changes."
              />
              <Feature
                icon={<Undo2 className="h-5 w-5" aria-hidden />}
                step="03"
                title="The only refund"
                body="Drag one habit down by an hour a day and watch exactly how many years come back."
              />
            </ul>
          </div>
        </section>

        {/* ---------------- Final CTA ---------------- */}
        <section className="px-5 pb-20 sm:px-8">
          <div className="mx-auto w-full max-w-6xl border-t border-rule/70 pt-14">
            <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="max-w-[18ch] font-display text-[clamp(2.25rem,8vw,4rem)] leading-[0.95] tracking-[-0.02em]">
                  You only get one. Where is it going?
                </h2>
                <p className="mt-4 max-w-[36rem] text-ink-muted">
                  No account, no email, no cookie banner. The maths runs in your browser
                  and stays there.
                </p>
              </div>

              <Link
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
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

function Feature({
  icon,
  step,
  title,
  body,
}: {
  icon: React.ReactNode;
  step: string;
  title: string;
  body: string;
}) {
  return (
    <li className="border-t border-ink/15 pt-5">
      <div className="flex items-center justify-between text-ink">
        {icon}
        <span className="eyebrow">{step}</span>
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-[-0.01em]">{title}</h3>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">{body}</p>
    </li>
  );
}
