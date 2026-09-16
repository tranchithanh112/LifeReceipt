"use client";

import * as React from "react";
import { Check, Download, Loader2, Send, Share2 } from "lucide-react";

import {
  CARD_HEIGHT,
  CARD_WIDTH,
  SHARE_CARDS,
  ShareCard,
  type ShareCardId,
} from "@/components/share/share-cards";
import { Button } from "@/components/ui/button";
import { useFitScale } from "@/hooks/use-motion";
import type { LifeResult } from "@/lib/calc";
import { formatYearsDecimal } from "@/lib/format";
import {
  copyToClipboard,
  downloadBlob,
  nodeToPngBlob,
  sharePng,
  shareText,
  type ShareOutcome,
} from "@/lib/share";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { buildPunchline, headlineActivity } from "@/lib/stats";
import { cn } from "@/lib/utils";

type Busy = "share" | "download" | null;

/**
 * Share and hand-off in one section.
 *
 * The card is rasterised ahead of time as soon as this scrolls into view, so
 * the share sheet opens on tap instead of after a spinner — that half second
 * is exactly where sharing intent evaporates.
 */
export function ShareSection({ result, name }: { result: LifeResult; name: string }) {
  const [variant, setVariant] = React.useState<ShareCardId>("receipt");
  const [busy, setBusy] = React.useState<Busy>(null);
  const [status, setStatus] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  const sectionRef = React.useRef<HTMLDivElement>(null);
  const previewBox = React.useRef<HTMLDivElement>(null);
  const scale = useFitScale(previewBox, CARD_WIDTH);

  // Off-screen, unscaled copies are what actually get rasterised.
  const stageRefs = React.useRef<Record<ShareCardId, HTMLDivElement | null>>({
    receipt: null,
    statement: null,
  });
  const cache = React.useRef<Partial<Record<ShareCardId, Blob>>>({});

  const render = React.useCallback(async (which: ShareCardId) => {
    const cached = cache.current[which];
    if (cached) return cached;

    const node = stageRefs.current[which];
    if (!node) return null;

    // Without this the first export can land before webfonts are ready.
    if (typeof document !== "undefined" && "fonts" in document) {
      try {
        await document.fonts.ready;
      } catch {
        // Font loading API is advisory here.
      }
    }

    const blob = await nodeToPngBlob(node, { width: CARD_WIDTH, height: CARD_HEIGHT });
    if (blob) cache.current[which] = blob;
    return blob;
  }, []);

  // Any change to the underlying numbers invalidates the cached images.
  React.useEffect(() => {
    cache.current = {};
  }, [result.seed, result.lifeExpectancy, name]);

  // Warm the visible card once the section is close to the viewport.
  React.useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        void render(variant);
      },
      { rootMargin: "400px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [render, variant]);

  const filename = `lifereceipt-${variant}-age-${result.age}.png`;

  const report = (outcome: ShareOutcome) =>
    setStatus(
      outcome === "shared"
        ? "Shared."
        : outcome === "downloaded"
          ? "Saved to your downloads."
          : outcome === "copied"
            ? "Copied."
            : "Couldn't render the card — a screenshot works just as well.",
    );

  const run = async (mode: Exclude<Busy, null>) => {
    setBusy(mode);
    setStatus(null);
    const blob = await render(variant);
    if (!blob) {
      setBusy(null);
      report("failed");
      return;
    }
    report(
      mode === "share"
        ? await sharePng(blob, {
            filename,
            text: buildPunchline(result),
            title: `My ${SITE_NAME}`,
          })
        : downloadBlob(blob, filename),
    );
    setBusy(null);
  };

  const hero = headlineActivity(result);
  const dare = hero
    ? `I just found out I'm going to spend ${formatYearsDecimal(
        hero.yearsLifetime,
      )} of my life ${verb(hero.id)} 💀\nYour turn.`
    : `I just found out where my entire life is going 💀\nYour turn.`;

  const sendDare = async () => {
    const outcome = await shareText({ text: dare, title: SITE_NAME, url: SITE_URL });
    if (outcome === "failed") return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <div ref={sectionRef}>
      <div role="tablist" aria-label="Share card style" className="flex gap-2">
        {SHARE_CARDS.map((card) => (
          <button
            key={card.id}
            role="tab"
            type="button"
            aria-selected={variant === card.id}
            onClick={() => {
              setVariant(card.id);
              setStatus(null);
              void render(card.id);
            }}
            className={cn(
              "rounded-full border px-4 py-2 font-mono text-[0.6875rem] tracking-[0.12em] uppercase transition-colors",
              variant === card.id
                ? "border-ink bg-ink text-paper"
                : "border-ink/20 text-ink-muted hover:border-ink/50 hover:text-ink",
            )}
          >
            {card.label}
          </button>
        ))}
      </div>

      {/* Preview: the same component, scaled to fit. */}
      <div className="mt-6 flex justify-center">
        <div
          ref={previewBox}
          className="relative w-full max-w-[22rem] overflow-hidden rounded-[10px] shadow-[0_18px_40px_rgba(22,19,15,0.18)]"
          style={{ aspectRatio: `${CARD_WIDTH} / ${CARD_HEIGHT}` }}
        >
          {scale > 0 ? (
            <div
              className="absolute top-0 left-0 origin-top-left"
              style={{ transform: `scale(${scale})` }}
              aria-hidden
            >
              <ShareCard variant={variant} result={result} name={name} />
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-7">
        <Button
          variant="primary"
          size="lg"
          onClick={() => run("share")}
          disabled={busy !== null}
          className="w-full"
        >
          {busy === "share" ? (
            <Loader2 className="h-[1.1em] w-[1.1em] animate-spin" aria-hidden />
          ) : (
            <Share2 className="h-[1.1em] w-[1.1em]" aria-hidden />
          )}
          Share my LifeReceipt
        </Button>

        <div className="mt-3 flex items-center justify-center gap-5">
          <button
            type="button"
            onClick={() => run("download")}
            disabled={busy !== null}
            className="inline-flex items-center gap-1.5 text-[0.8125rem] text-ink-muted underline decoration-ink/25 underline-offset-4 transition-colors hover:text-ink disabled:opacity-50"
          >
            {busy === "download" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            ) : (
              <Download className="h-3.5 w-3.5" aria-hidden />
            )}
            Download
          </button>

          <button
            type="button"
            onClick={async () => {
              const outcome = await copyToClipboard(SITE_URL);
              if (outcome !== "failed") setStatus("Link copied.");
            }}
            className="text-[0.8125rem] text-ink-muted underline decoration-ink/25 underline-offset-4 transition-colors hover:text-ink"
          >
            Copy link
          </button>
        </div>

        <p className="mt-3 min-h-[1.25rem] text-center text-[0.8125rem] text-ink-muted" aria-live="polite">
          {status}
        </p>
      </div>

      {/* The hand-off. One action, not a menu of them. */}
      <div className="mt-8 border-t border-ink/15 pt-7">
        <p className="eyebrow">Think your numbers are bad?</p>
        <p className="mt-3 font-display text-[clamp(1.5rem,6vw,2rem)] leading-tight">
          Find out whose are worse.
        </p>
        <p className="mt-4 border-l-2 border-ink/20 pl-4 font-mono text-[0.8125rem] leading-relaxed whitespace-pre-line text-ink-muted">
          {dare}
        </p>
        <Button variant="outline" size="md" className="mt-5 w-full sm:w-auto" onClick={sendDare}>
          {copied ? (
            <Check className="h-4 w-4" aria-hidden />
          ) : (
            <Send className="h-4 w-4" aria-hidden />
          )}
          {copied ? "Ready to paste" : "Send this to a friend"}
        </Button>
      </div>

      {/* Export stage. Laid out (so it can be measured) but never on screen. */}
      <div className="offscreen-stage" aria-hidden>
        {SHARE_CARDS.map((card) => (
          <div
            key={card.id}
            ref={(node) => {
              stageRefs.current[card.id] = node;
            }}
          >
            <ShareCard variant={card.id} result={result} name={name} />
          </div>
        ))}
      </div>
    </div>
  );
}

function verb(id: string) {
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
      return "on one habit";
  }
}
