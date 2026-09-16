"use client";

import * as React from "react";

import type { LifeResult, LineItem } from "@/lib/calc";
import { useT } from "@/lib/i18n";
import { round } from "@/lib/i18n/format";
import { itemReceiptLabel } from "@/lib/i18n/labels";
import type { Dict } from "@/lib/i18n/types";
import { SITE_DOMAIN } from "@/lib/site";
import { cn } from "@/lib/utils";

import { Barcode, orderNumber } from "./barcode";
import { SerratedEdge } from "./serrated-edge";

export interface ReceiptProps {
  result: LifeResult;
  name?: string;
  /** When provided the customer line becomes an editable field. */
  onNameChange?: (name: string) => void;
  /** Plays the printing animation on mount. */
  animate?: boolean;
  /** Extra closing line under the totals. */
  verdict?: string;
  issuedAt?: Date;
  /**
   * "full" is the real thing. "preview" is the shortened slip used in the
   * hero — same component and same maths, trimmed to the totals so the
   * landing page's call to action stays above the fold.
   */
  variant?: "full" | "preview";
  className?: string;
}

/** How many line items a preview slip shows before it stops. */
const PREVIEW_ITEMS = 6;

export function Receipt({
  result,
  name,
  onNameChange,
  animate = false,
  verdict,
  issuedAt,
  variant = "full",
  className,
}: ReceiptProps) {
  const t = useT();
  // Locked on first render so a re-render never changes the printed date.
  const [issued] = React.useState(() => issuedAt ?? new Date());
  const trimmedName = (name ?? "").trim();
  const preview = variant === "preview";
  const items = preview ? result.items.slice(0, PREVIEW_ITEMS) : result.items;
  const hidden = result.items.length - items.length;

  return (
    <div
      className={cn(
        "relative w-full max-w-[24rem]",
        // drop-shadow (not box-shadow) so the shadow follows the torn edges.
        "[filter:drop-shadow(0_14px_28px_rgba(22,19,15,0.13))_drop-shadow(0_2px_4px_rgba(22,19,15,0.08))]",
        animate && "animate-print",
        className,
      )}
      data-testid={preview ? "receipt-preview" : "receipt"}
    >
      <SerratedEdge side="top" />

      <div className="grain bg-receipt px-5 pt-5 pb-6 font-mono text-[0.8125rem] leading-[1.7] text-ink sm:px-7">
        <Header
          result={result}
          issued={issued}
          name={trimmedName}
          onNameChange={onNameChange}
          preview={preview}
          t={t}
        />

        <ColumnHeadings t={t} />

        <ItemRows items={items} animate={animate} hidden={hidden} t={t} />

        <Totals result={result} t={t} />

        {preview ? null : <Highlights result={result} t={t} />}

        {!preview && verdict ? (
          <>
            <Rule />
            <p className="text-[0.75rem] leading-relaxed text-ink-muted">{verdict}</p>
          </>
        ) : null}

        <Rule />

        {preview ? (
          <p className="text-center text-[0.8125rem] font-bold tracking-[0.3em] uppercase">
            {t.receipt.noRefunds}
          </p>
        ) : (
          <Footer result={result} t={t} />
        )}
      </div>

      <SerratedEdge side="bottom" />
    </div>
  );
}

/* ------------------------------------------------------------------ */

// Drawn rather than typed: a literal row of dots would set `white-space:
// nowrap` and force the whole receipt's min-content width past the viewport.
function Rule({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("my-3 border-t border-dashed border-ink/30", className)}
    />
  );
}

function DoubleRule() {
  return (
    <div
      aria-hidden
      className="my-2.5 h-[3px] border-y border-ink/45 select-none"
    />
  );
}

function Header({
  result,
  issued,
  name,
  onNameChange,
  preview,
  t,
}: {
  result: LifeResult;
  issued: Date;
  name: string;
  onNameChange?: (name: string) => void;
  preview: boolean;
  t: Dict;
}) {
  return (
    <header>
      <p className="text-center text-[0.9375rem] font-bold tracking-[0.34em] uppercase">
        {t.receipt.title}
      </p>
      <p className="mt-1 text-center text-[0.625rem] tracking-[0.2em] text-ink-faint uppercase">
        {SITE_DOMAIN}
      </p>

      <Rule />

      <dl className="space-y-[2px] text-[0.75rem]">
        <Field label={t.receipt.customer} fill={onNameChange != null}>
          {onNameChange ? (
            <input
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              placeholder={t.receipt.namePlaceholder}
              maxLength={24}
              aria-label={t.receipt.nameField}
              spellCheck={false}
              // size={1} kills the input's ~20ch intrinsic width so it can
              // shrink inside the receipt on a 320px screen.
              size={1}
              // A tight 1px ring keeps the field legibly focusable without a
              // heavy box sitting on top of the printed paper.
              className="w-full min-w-0 bg-transparent text-right font-mono text-[0.75rem] tracking-wide text-ink uppercase outline-none placeholder:text-ink-faint/70 focus-visible:rounded-[1px] focus-visible:outline-1 focus-visible:outline-offset-[3px] focus-visible:outline-ink/60"
            />
          ) : (
            <span className="uppercase">{name || t.receipt.anonymous}</span>
          )}
        </Field>
        <Field label={t.receipt.age}>
          <span className="tnum">{result.age}</span>
        </Field>
        {preview ? null : (
          <Field label={t.receipt.daysLived}>
            <span className="tnum">{t.fmt.number(result.daysLived)}</span>
          </Field>
        )}
        <Field label={t.receipt.issued}>{t.fmt.receiptDate(issued)}</Field>
        {preview ? null : (
          <Field label={t.receipt.order}>{orderNumber(result.seed, result.age)}</Field>
        )}
      </dl>

      <DoubleRule />
    </header>
  );
}

/**
 * A label/value row with a dotted leader between them. `fill` hands the row's
 * spare width to the value instead of the leader, for the editable name field.
 */
function Field({
  label,
  children,
  fill = false,
}: {
  label: string;
  children: React.ReactNode;
  fill?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-2">
      <dt className="shrink-0 tracking-[0.1em] text-ink-faint uppercase">{label}</dt>
      {fill ? null : <span aria-hidden className="leader" />}
      <dd className={cn("min-w-0 text-right", fill ? "flex-1" : "shrink-0")}>
        {children}
      </dd>
    </div>
  );
}

function ColumnHeadings({ t }: { t: Dict }) {
  return (
    <div className="flex items-baseline justify-between text-[0.625rem] tracking-[0.18em] text-ink-faint uppercase">
      <span>{t.receipt.itemRate}</span>
      <span>{t.receipt.lifeSpent}</span>
    </div>
  );
}

function rateLabel(item: LineItem, t: Dict) {
  return `${t.fmt.decimal(round(item.input, 2))}${t.hourShort}${t.cadenceShort[item.cadence]}`;
}

/**
 * The itemised rows, staggered in as the receipt prints.
 *
 * The stagger is a one-shot. Re-ordering the list moves the existing <li>
 * nodes, and a moved DOM node restarts its CSS animation — so leaving
 * `animate-rise` on would blank out every row that shifted whenever someone
 * added a custom line item. Once the print has played we take the class off
 * and the rows simply stay put.
 */
const PRINT_MS = 1600;

function ItemRows({
  items,
  animate,
  hidden,
  t,
}: {
  items: LineItem[];
  animate: boolean;
  hidden: number;
  t: Dict;
}) {
  const [printed, setPrinted] = React.useState(false);

  React.useEffect(() => {
    if (!animate || printed) return;
    const timer = setTimeout(() => setPrinted(true), PRINT_MS);
    return () => clearTimeout(timer);
  }, [animate, printed]);

  const rise = animate && !printed;

  return (
    <ul className="mt-1.5 space-y-[3px]">
      {items.map((item, index) => (
        <li
          key={item.id}
          className={rise ? "animate-rise" : undefined}
          style={rise ? { animationDelay: `${0.5 + index * 0.075}s` } : undefined}
        >
          <ItemRow item={item} t={t} />
        </li>
      ))}
      {items.length === 0 ? (
        <li className="py-3 text-center text-ink-faint">{t.receipt.emptyItems}</li>
      ) : null}
      {hidden > 0 ? (
        <li className="pt-1 text-[0.6875rem] text-ink-faint">
          {t.receipt.moreItems(hidden)}
        </li>
      ) : null}
    </ul>
  );
}

function ItemRow({ item, t }: { item: LineItem; t: Dict }) {
  return (
    <div className="flex items-baseline gap-2">
      {/* truncate (not shrink-0) so a long custom label cannot push the
          amount off the paper on a narrow screen. */}
      <span className="min-w-0 truncate tracking-[0.06em] uppercase">
        {itemReceiptLabel(item, t)}
      </span>
      <span className="shrink-0 text-[0.6875rem] text-ink-faint">{rateLabel(item, t)}</span>
      <span aria-hidden className="leader" />
      <span className="tnum shrink-0 font-medium">{t.fmt.duration(item.yearsSpent)}</span>
    </div>
  );
}

function Totals({ result, t }: { result: LifeResult; t: Dict }) {
  const leftover = result.unaccountedYears;

  return (
    <>
      <Rule />

      <dl className="space-y-[2px] text-[0.75rem]">
        <Field label={t.receipt.subtotal}>
          <span className="tnum">{t.fmt.duration(result.totalYearsSpent)}</span>
        </Field>
        {leftover >= 0 ? (
          <Field label={t.receipt.everythingElse}>
            <span className="tnum">{t.fmt.duration(leftover)}</span>
          </Field>
        ) : (
          <Field label={t.receipt.overlapCredit}>
            <span className="tnum">-{t.fmt.duration(Math.abs(leftover))}</span>
          </Field>
        )}
      </dl>

      <DoubleRule />

      <div className="flex items-baseline gap-2 text-[0.9375rem] font-bold">
        <span className="shrink-0 tracking-[0.1em] uppercase">{t.receipt.totalLifeUsed}</span>
        <span aria-hidden className="leader" />
        <span className="tnum shrink-0">
          {result.age} {t.receipt.years}
        </span>
      </div>
    </>
  );
}

function Highlights({ result, t }: { result: LifeResult; t: Dict }) {
  const { biggest, questionable } = result;
  if (!biggest) return null;

  return (
    <>
      <Rule />
      <dl className="space-y-2.5 text-[0.75rem]">
        <div>
          <dt className="text-[0.625rem] tracking-[0.18em] text-ink-faint uppercase">
            {t.receipt.mostExpensive}
          </dt>
          <dd className="mt-0.5 flex items-baseline gap-2 font-bold">
            <span className="uppercase">{itemReceiptLabel(biggest, t)}</span>
            <span aria-hidden className="leader" />
            <span className="tnum">{t.fmt.duration(biggest.yearsSpent)}</span>
          </dd>
        </div>

        {questionable && questionable.id !== biggest.id ? (
          <div>
            <dt className="text-[0.625rem] tracking-[0.18em] text-ink-faint uppercase">
              {t.receipt.mostQuestionable}
            </dt>
            <dd className="mt-0.5 flex items-baseline gap-2 font-bold text-stamp">
              <span className="uppercase">{itemReceiptLabel(questionable, t)}</span>
              <span aria-hidden className="leader" />
              <span className="tnum">{t.fmt.duration(questionable.yearsSpent)}</span>
            </dd>
          </div>
        ) : null}

        <div>
          <dt className="text-[0.625rem] tracking-[0.18em] text-ink-faint uppercase">
            {t.receipt.total}
          </dt>
          <dd className="mt-0.5 font-bold">{t.receipt.oneLife}</dd>
        </div>
      </dl>
    </>
  );
}

function Footer({ result, t }: { result: LifeResult; t: Dict }) {
  return (
    <footer className="relative">
      <p className="text-center text-[0.8125rem] font-bold tracking-[0.3em] uppercase">
        {t.receipt.noRefunds}
      </p>

      <NoRefundsStamp t={t} />

      <Barcode seed={result.seed} className="mt-4" />
      <p className="tnum mt-1.5 text-center text-[0.625rem] tracking-[0.3em] text-ink-muted">
        {orderNumber(result.seed, result.age)}
      </p>
      <p className="mt-3 text-center text-[0.625rem] tracking-[0.16em] text-ink-faint uppercase">
        {t.receipt.thanks}
      </p>
    </footer>
  );
}

function NoRefundsStamp({ t }: { t: Dict }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -top-1 right-0 -rotate-[9deg] select-none"
    >
      <span className="block rounded-[3px] border-[2.5px] border-stamp/55 px-2 py-[3px] text-[0.5625rem] font-bold tracking-[0.18em] text-stamp/70 uppercase">
        {t.receipt.finalStamp}
      </span>
    </div>
  );
}
