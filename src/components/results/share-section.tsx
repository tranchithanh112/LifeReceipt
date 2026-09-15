"use client";

import * as React from "react";
import { Download, Loader2, Share2 } from "lucide-react";

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
import { downloadBlob, nodeToPngBlob, sharePng, type ShareOutcome } from "@/lib/share";
import { SITE_NAME } from "@/lib/site";
import { buildPunchline } from "@/lib/stats";
import { cn } from "@/lib/utils";

type Busy = "share" | "download" | null;

export function ShareSection({
  result,
  name,
}: {
  result: LifeResult;
  name: string;
}) {
  const [variant, setVariant] = React.useState<ShareCardId>("receipt");
  const [busy, setBusy] = React.useState<Busy>(null);
  const [status, setStatus] = React.useState<string | null>(null);

  const previewBox = React.useRef<HTMLDivElement>(null);
  const scale = useFitScale(previewBox, CARD_WIDTH);

  // Off-screen, unscaled copies are what actually get rasterised.
  const stageRefs = React.useRef<Record<ShareCardId, HTMLDivElement | null>>({
    receipt: null,
    statement: null,
  });

  const render = React.useCallback(async () => {
    const node = stageRefs.current[variant];
    if (!node) return null;
    // Without this the first export can land before webfonts are ready.
    if (typeof document !== "undefined" && "fonts" in document) {
      try {
        await document.fonts.ready;
      } catch {
        // Font loading API is advisory here.
      }
    }
    return nodeToPngBlob(node, { width: CARD_WIDTH, height: CARD_HEIGHT });
  }, [variant]);

  const filename = `lifereceipt-${variant}-age-${result.age}.png`;

  const report = (outcome: ShareOutcome) => {
    setStatus(
      outcome === "shared"
        ? "Shared."
        : outcome === "downloaded"
          ? "Saved to your downloads."
          : outcome === "copied"
            ? "Copied."
            : "Couldn't render the card — a screenshot works just as well.",
    );
  };

  const onShare = async () => {
    setBusy("share");
    setStatus(null);
    const blob = await render();
    if (!blob) {
      setBusy(null);
      report("failed");
      return;
    }
    report(
      await sharePng(blob, {
        filename,
        text: buildPunchline(result),
        title: `My ${SITE_NAME}`,
      }),
    );
    setBusy(null);
  };

  const onDownload = async () => {
    setBusy("download");
    setStatus(null);
    const blob = await render();
    if (!blob) {
      setBusy(null);
      report("failed");
      return;
    }
    report(downloadBlob(blob, filename));
    setBusy(null);
  };

  return (
    <div>
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

      <p className="mt-3 text-[0.8125rem] text-ink-muted">
        {SHARE_CARDS.find((card) => card.id === variant)?.caption}
      </p>

      {/* Preview: the same component, scaled to fit. */}
      <div className="mt-6 flex justify-center">
        <div
          ref={previewBox}
          className="relative w-full max-w-[19rem] overflow-hidden rounded-[10px] shadow-[0_18px_40px_rgba(22,19,15,0.18)]"
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

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Button
          variant="primary"
          size="lg"
          onClick={onShare}
          disabled={busy !== null}
          className="flex-1"
        >
          {busy === "share" ? (
            <Loader2 className="h-[1.1em] w-[1.1em] animate-spin" aria-hidden />
          ) : (
            <Share2 className="h-[1.1em] w-[1.1em]" aria-hidden />
          )}
          Share my LifeReceipt
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={onDownload}
          disabled={busy !== null}
          className="flex-1"
        >
          {busy === "download" ? (
            <Loader2 className="h-[1.1em] w-[1.1em] animate-spin" aria-hidden />
          ) : (
            <Download className="h-[1.1em] w-[1.1em]" aria-hidden />
          )}
          Download
        </Button>
      </div>

      <p className="mt-3 min-h-[1.25rem] text-[0.8125rem] text-ink-muted" aria-live="polite">
        {status}
      </p>

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
