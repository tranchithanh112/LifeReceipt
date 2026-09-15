"use client";

import * as React from "react";
import { Check, Link2, Send, Swords } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { LifeResult } from "@/lib/calc";
import { formatYearsDecimal } from "@/lib/format";
import { copyToClipboard, shareText, type ShareOutcome } from "@/lib/share";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { headlineActivity } from "@/lib/stats";

/**
 * The hand-off. Everything here is plain text plus the site URL for now;
 * when result URLs exist, only `link` below has to learn about them.
 */
export function ViralLoop({ result }: { result: LifeResult }) {
  const [copied, setCopied] = React.useState<string | null>(null);

  const hero = headlineActivity(result);
  const link = SITE_URL;

  const dareText = hero
    ? `I just found out I'm going to spend ${formatYearsDecimal(
        hero.yearsLifetime,
      )} of my life ${verb(hero.id)} 💀\nYour turn.`
    : `I just found out where my entire life is going 💀\nYour turn.`;

  const challengeText = hero
    ? `${formatYearsDecimal(hero.yearsLifetime)} ${verb(
        hero.id,
      )}. That's my number.\nBet yours is worse. Prove it.`
    : `Print your LifeReceipt and tell me it's better than mine.`;

  const flash = (key: string, outcome: ShareOutcome) => {
    if (outcome === "failed") return;
    setCopied(key);
    setTimeout(() => setCopied((current) => (current === key ? null : current)), 2200);
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card
        icon={<Send className="h-4 w-4" aria-hidden />}
        title="Send this to a friend"
        preview={dareText}
        action={
          <Button
            variant="primary"
            size="md"
            className="w-full"
            onClick={async () =>
              flash("dare", await shareText({ text: dareText, title: SITE_NAME, url: link }))
            }
          >
            {copied === "dare" ? (
              <Check className="h-4 w-4" aria-hidden />
            ) : (
              <Send className="h-4 w-4" aria-hidden />
            )}
            {copied === "dare" ? "Ready to paste" : "Send it"}
          </Button>
        }
      />

      <Card
        icon={<Swords className="h-4 w-4" aria-hidden />}
        title="Challenge a friend"
        preview={challengeText}
        action={
          <Button
            variant="outline"
            size="md"
            className="w-full"
            onClick={async () =>
              flash(
                "challenge",
                await shareText({ text: challengeText, title: SITE_NAME, url: link }),
              )
            }
          >
            {copied === "challenge" ? (
              <Check className="h-4 w-4" aria-hidden />
            ) : (
              <Swords className="h-4 w-4" aria-hidden />
            )}
            {copied === "challenge" ? "Ready to paste" : "Start the fight"}
          </Button>
        }
      />

      <div className="sm:col-span-2">
        <button
          type="button"
          onClick={async () => flash("link", await copyToClipboard(link))}
          className="inline-flex items-center gap-2 font-mono text-[0.75rem] tracking-[0.1em] text-ink-muted uppercase underline decoration-ink/25 underline-offset-4 transition-colors hover:text-ink"
        >
          {copied === "link" ? (
            <Check className="h-3.5 w-3.5" aria-hidden />
          ) : (
            <Link2 className="h-3.5 w-3.5" aria-hidden />
          )}
          {copied === "link" ? "Link copied" : "Copy the link instead"}
        </button>
      </div>
    </div>
  );
}

function Card({
  icon,
  title,
  preview,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  preview: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-ink/12 bg-receipt/70 p-5">
      <p className="flex items-center gap-2 font-mono text-[0.75rem] tracking-[0.12em] uppercase">
        {icon}
        {title}
      </p>
      <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed whitespace-pre-line text-ink-muted">
        {preview}
      </p>
      <div className="mt-5">{action}</div>
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
