"use client";

import * as React from "react";

import { SerratedEdge } from "@/components/receipt/serrated-edge";
import type { LifeResult, LineItem } from "@/lib/calc";
import { useT } from "@/lib/i18n";
import { itemReceiptLabel } from "@/lib/i18n/labels";
import type { Dict } from "@/lib/i18n/types";
import { SITE_DOMAIN } from "@/lib/site";
import { buildPunchline, headlineActivity } from "@/lib/stats";

/** 9:16, the shape every story surface wants. Exported at 2x. */
export const CARD_WIDTH = 540;
export const CARD_HEIGHT = 960;

export type ShareCardId = "receipt" | "statement";

export function shareCards(t: Dict): { id: ShareCardId; label: string }[] {
  return [
    { id: "receipt", label: t.share.tabReceipt },
    { id: "statement", label: t.share.tabStatement },
  ];
}

export const SHARE_CARD_IDS: ShareCardId[] = ["receipt", "statement"];

/** Line items chosen for a card: the three that hurt the most. */
function topThree(result: LifeResult): LineItem[] {
  const seen = new Set<string>();
  const picks: LineItem[] = [];
  const consider = (item: LineItem | null | undefined) => {
    if (!item || seen.has(item.id) || picks.length >= 3) return;
    seen.add(item.id);
    picks.push(item);
  };

  consider(result.questionable);
  consider(result.biggest);
  for (const item of result.items) consider(item);
  return picks.sort((a, b) => b.yearsLifetime - a.yearsLifetime);
}

/**
 * A Vercel-style domain is far longer than "lifereceipt.app", and the footer
 * has to share its line with the stamp. Step the type down so it never
 * collides on a card that gets baked into an image.
 */
const domainClass =
  SITE_DOMAIN.length > 24
    ? "text-[13px] tracking-[0.08em]"
    : SITE_DOMAIN.length > 18
      ? "text-[15px] tracking-[0.1em]"
      : "text-[17px] tracking-[0.14em]";

const frame: React.CSSProperties = {
  width: CARD_WIDTH,
  height: CARD_HEIGHT,
  flex: `0 0 ${CARD_HEIGHT}px`,
};

/* ------------------------------------------------------------------ *
 * Card 1 — the receipt
 * ------------------------------------------------------------------ */

export function ReceiptShareCard({
  result,
  name,
}: {
  result: LifeResult;
  name?: string;
}) {
  const t = useT();
  const items = topThree(result);
  const punchline = buildPunchline(result, t);
  const who = (name ?? "").trim();

  return (
    <div
      style={frame}
      className="grain relative flex flex-col overflow-hidden bg-paper px-[44px] pt-[52px] pb-[44px] text-ink"
    >
      <div className="relative z-2 flex items-center justify-between border-b-2 border-ink pb-[14px] font-mono text-[15px] font-bold tracking-[0.22em] uppercase">
        <span>LifeReceipt</span>
        <span>{who ? `${who} · ${result.age}` : t.share.ageLabel(result.age)}</span>
      </div>

      <h2 className="relative z-2 mt-[38px] font-display text-[76px] leading-[0.88] tracking-[-0.02em]">
        {t.share.cardHeadlineLead.split("\n").map((line, i) => (
          <React.Fragment key={line}>
            {i > 0 ? <br /> : null}
            {line}
          </React.Fragment>
        ))}{" "}
        <em className="wonk">{t.share.cardHeadlineEm}</em>
      </h2>

      {/* A real slip of receipt paper, torn top and bottom. */}
      <div className="relative z-2 mt-[38px] [filter:drop-shadow(0_10px_20px_rgba(22,19,15,0.14))]">
        <SerratedEdge side="top" teeth={20} height={7} />
        <div className="bg-receipt px-[26px] py-[22px] font-mono">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="flex items-baseline gap-3 py-[9px]"
              style={
                index > 0
                  ? { borderTop: "1px dotted rgba(22,19,15,0.22)" }
                  : undefined
              }
            >
              <span className="text-[22px] leading-none">{item.emoji}</span>
              <span className="text-[19px] tracking-[0.02em]">
                {itemReceiptLabel(item, t)}
              </span>
              <span aria-hidden className="leader" />
              <span className="tnum text-[21px] font-bold">
                {t.fmt.yearsDecimal(item.yearsLifetime)}
              </span>
            </div>
          ))}
          <p className="mt-[14px] border-t-2 border-ink pt-[10px] text-center text-[12px] tracking-[0.26em] uppercase">
            {t.receipt.projectedAcrossOneLife}
          </p>
        </div>
        <SerratedEdge side="bottom" teeth={20} height={7} />
      </div>

      {/* my-auto splits the leftover height above and below the quote so the
          card never ends up bottom-heavy for people with fewer line items. */}
      <p className="relative z-2 my-auto py-[30px] font-display text-[40px] leading-[1.1] tracking-[-0.015em] text-balance">
        &ldquo;{punchline}&rdquo;
      </p>

      {/* The two numbers that frame everything else on the card. */}
      <dl className="relative z-2 flex gap-[48px] border-t-2 border-ink pt-[18px]">
        <div>
          <dt className="font-mono text-[12px] tracking-[0.2em] text-ink-faint uppercase">
            {t.share.daysLived}
          </dt>
          <dd className="tnum mt-[2px] font-display text-[38px] leading-none">
            {t.fmt.number(result.daysLived)}
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[12px] tracking-[0.2em] text-ink-faint uppercase">
            {t.share.daysLeft}
          </dt>
          <dd className="tnum mt-[2px] font-display text-[38px] leading-none">
            {t.fmt.number(result.daysRemaining)}
          </dd>
        </div>
      </dl>

      <div className="relative z-2 mt-[26px] flex items-end justify-between">
        <span className={`font-mono leading-tight font-bold ${domainClass}`}>{SITE_DOMAIN}</span>
        <span className="shrink-0 rounded-[4px] border-[3px] border-stamp px-[10px] py-[4px] font-mono text-[12px] font-bold tracking-[0.2em] whitespace-nowrap text-stamp uppercase [transform:rotate(-7deg)]">
          {t.share.noRefunds}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Card 2 — the excuse
 * ------------------------------------------------------------------ */

/**
 * Splits a duration into the parts the big numeral needs. Values under a year
 * switch to months so the headline never reads "0.4 years".
 */
function heroFigure(years: number, t: Dict) {
  if (years < 1) {
    const months = Math.max(1, Math.round(years * 12));
    return {
      whole: String(months),
      fraction: null,
      unit: months === 1 ? t.share.monthUnit : t.share.monthsUnit,
    };
  }
  const rounded = Math.round(years * 10) / 10;
  const whole = Math.floor(rounded);
  const tenth = Math.round((rounded - whole) * 10);
  return {
    whole: String(whole),
    fraction: tenth > 0 ? String(tenth) : null,
    unit: rounded === 1 ? t.share.yearUnit : t.share.yearsUnit,
  };
}

export function StatementShareCard({ result }: { result: LifeResult }) {
  const t = useT();
  const hero = headlineActivity(result);
  const years = hero ? hero.yearsLifetime : 0;
  const label = hero ? itemReceiptLabel(hero, t) : t.share.beingBusy;
  const { whole, fraction, unit } = heroFigure(years, t);

  return (
    <div
      style={frame}
      className="relative flex flex-col overflow-hidden bg-ink px-[44px] pt-[52px] pb-[44px] text-paper"
    >
      <p className="font-mono text-[15px] font-bold tracking-[0.22em] uppercase opacity-70">
        LifeReceipt
      </p>

      <h2 className="mt-[40px] font-display text-[86px] leading-[0.86] tracking-[-0.025em]">
        {t.share.excuseQuote.split("\n").map((line, i) => (
          <React.Fragment key={line}>
            {i > 0 ? <br /> : null}
            {line}
          </React.Fragment>
        ))}
      </h2>

      <p className="mt-[32px] font-mono text-[15px] tracking-[0.24em] uppercase opacity-60">
        {t.share.meanwhile}
      </p>

      <div className="mt-[14px] border-t-2 border-b-2 border-paper/35 py-[24px]">
        <p className="font-mono text-[26px] font-bold tracking-[0.12em] uppercase">
          {label}
        </p>
        <p className="tnum mt-[4px] flex items-baseline font-display leading-[0.8]">
          <span className="text-[180px] tracking-[-0.045em]">{whole}</span>
          {fraction ? (
            <span className="text-[90px]">
              {t.locale === "vi" ? "," : "."}
              {fraction}
            </span>
          ) : null}
          <span className="ml-[26px] text-[46px] tracking-[-0.02em]">{unit}</span>
        </p>
        <p className="mt-[8px] font-mono text-[17px] tracking-[0.1em] uppercase opacity-70">
          {t.share.ofOneSingleLife}
        </p>
      </div>

      {hero ? (
        <dl className="mt-[26px] flex gap-[44px] font-mono">
          <div>
            <dt className="text-[13px] tracking-[0.2em] uppercase opacity-55">
              {t.share.alreadyGone}
            </dt>
            <dd className="tnum mt-[4px] text-[30px] font-bold">
              {t.fmt.yearsDecimal(hero.yearsSpent)}
            </dd>
          </div>
          <div>
            <dt className="text-[13px] tracking-[0.2em] uppercase opacity-55">
              {t.share.stillToCome}
            </dt>
            <dd className="tnum mt-[4px] text-[30px] font-bold">
              {t.fmt.yearsDecimal(hero.yearsRemaining)}
            </dd>
          </div>
        </dl>
      ) : null}

      <p className="mt-auto max-w-[22ch] pt-[28px] text-[24px] leading-[1.35] text-paper/75">
        {t.share.findOutRest}
      </p>

      <div className="mt-[26px] flex items-end justify-between">
        <span className={`font-mono leading-tight font-bold ${domainClass}`}>{SITE_DOMAIN}</span>
        <span className="font-mono text-[13px] tracking-[0.2em] uppercase opacity-55">
          {t.share.ageLabel(result.age)}
        </span>
      </div>
    </div>
  );
}


export function ShareCard({
  variant,
  result,
  name,
}: {
  variant: ShareCardId;
  result: LifeResult;
  name?: string;
}) {
  return variant === "receipt" ? (
    <ReceiptShareCard result={result} name={name} />
  ) : (
    <StatementShareCard result={result} />
  );
}
