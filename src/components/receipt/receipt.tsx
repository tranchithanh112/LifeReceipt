"use client";

import * as React from "react";

import { CADENCE_UNIT_SHORT } from "@/lib/activities";
import type { LifeResult, LineItem } from "@/lib/calc";
import { formatDuration, formatNumber, formatReceiptDate, round } from "@/lib/format";
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
        />

        <ColumnHeadings />

        <ul className="mt-1.5 space-y-[3px]">
          {items.map((item, index) => (
            <li
              key={item.id}
              className={animate ? "animate-rise" : undefined}
              style={
                animate
                  ? { animationDelay: `${0.5 + index * 0.075}s` }
                  : undefined
              }
            >
              <ItemRow item={item} />
            </li>
          ))}
          {items.length === 0 ? (
            <li className="py-3 text-center text-ink-faint">
              No line items. Suspiciously empty life.
            </li>
          ) : null}
          {hidden > 0 ? (
            <li className="pt-1 text-[0.6875rem] text-ink-faint">
              + {hidden} more {hidden === 1 ? "item" : "items"}
            </li>
          ) : null}
        </ul>

        <Totals result={result} />

        {preview ? null : <Highlights result={result} />}

        {!preview && verdict ? (
          <>
            <Rule />
            <p className="text-[0.75rem] leading-relaxed text-ink-muted">{verdict}</p>
          </>
        ) : null}

        <Rule />

        {preview ? (
          <p className="text-center text-[0.8125rem] font-bold tracking-[0.3em] uppercase">
            ** No refunds **
          </p>
        ) : (
          <Footer result={result} />
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
}: {
  result: LifeResult;
  issued: Date;
  name: string;
  onNameChange?: (name: string) => void;
  preview: boolean;
}) {
  return (
    <header>
      <p className="text-center text-[0.9375rem] font-bold tracking-[0.34em] uppercase">
        Life Receipt
      </p>
      <p className="mt-1 text-center text-[0.625rem] tracking-[0.2em] text-ink-faint uppercase">
        {SITE_DOMAIN}
      </p>

      <Rule />

      <dl className="space-y-[2px] text-[0.75rem]">
        <Field label="Customer" fill={onNameChange != null}>
          {onNameChange ? (
            <input
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              placeholder="ADD YOUR NAME"
              maxLength={24}
              aria-label="Your name on the receipt"
              spellCheck={false}
              // size={1} kills the input's ~20ch intrinsic width so it can
              // shrink inside the receipt on a 320px screen.
              size={1}
              // A tight 1px ring keeps the field legibly focusable without a
              // heavy box sitting on top of the printed paper.
              className="w-full min-w-0 bg-transparent text-right font-mono text-[0.75rem] tracking-wide text-ink uppercase outline-none placeholder:text-ink-faint/70 focus-visible:rounded-[1px] focus-visible:outline-1 focus-visible:outline-offset-[3px] focus-visible:outline-ink/60"
            />
          ) : (
            <span className="uppercase">{name || "Anonymous"}</span>
          )}
        </Field>
        <Field label="Age">
          <span className="tnum">{result.age}</span>
        </Field>
        {preview ? null : (
          <Field label="Days lived">
            <span className="tnum">{formatNumber(result.daysLived)}</span>
          </Field>
        )}
        <Field label="Issued">{formatReceiptDate(issued)}</Field>
        {preview ? null : (
          <Field label="Order">{orderNumber(result.seed, result.age)}</Field>
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

function ColumnHeadings() {
  return (
    <div className="flex items-baseline justify-between text-[0.625rem] tracking-[0.18em] text-ink-faint uppercase">
      <span>Item / rate</span>
      <span>Life spent</span>
    </div>
  );
}

function rateLabel(item: LineItem) {
  const value = round(item.input, 2);
  return `${value}h${CADENCE_UNIT_SHORT[item.cadence]}`;
}

function ItemRow({ item }: { item: LineItem }) {
  return (
    <div className="flex items-baseline gap-2">
      {/* truncate (not shrink-0) so a long custom label cannot push the
          amount off the paper on a narrow screen. */}
      <span className="min-w-0 truncate tracking-[0.06em] uppercase">
        {item.receiptLabel}
      </span>
      <span className="shrink-0 text-[0.6875rem] text-ink-faint">{rateLabel(item)}</span>
      <span aria-hidden className="leader" />
      <span className="tnum shrink-0 font-medium">{formatDuration(item.yearsSpent)}</span>
    </div>
  );
}

function Totals({ result }: { result: LifeResult }) {
  const leftover = result.unaccountedYears;

  return (
    <>
      <Rule />

      <dl className="space-y-[2px] text-[0.75rem]">
        <Field label="Subtotal">
          <span className="tnum">{formatDuration(result.totalYearsSpent)}</span>
        </Field>
        {leftover >= 0 ? (
          <Field label="Everything else">
            <span className="tnum">{formatDuration(leftover)}</span>
          </Field>
        ) : (
          <Field label="Overlap credit">
            <span className="tnum">-{formatDuration(Math.abs(leftover))}</span>
          </Field>
        )}
      </dl>

      <DoubleRule />

      <div className="flex items-baseline gap-2 text-[0.9375rem] font-bold">
        <span className="shrink-0 tracking-[0.1em] uppercase">Total life used</span>
        <span aria-hidden className="leader" />
        <span className="tnum shrink-0">{result.age} yrs</span>
      </div>
    </>
  );
}

function Highlights({ result }: { result: LifeResult }) {
  const { biggest, questionable } = result;
  if (!biggest) return null;

  return (
    <>
      <Rule />
      <dl className="space-y-2.5 text-[0.75rem]">
        <div>
          <dt className="text-[0.625rem] tracking-[0.18em] text-ink-faint uppercase">
            Most expensive item
          </dt>
          <dd className="mt-0.5 flex items-baseline gap-2 font-bold">
            <span className="uppercase">{biggest.receiptLabel}</span>
            <span aria-hidden className="leader" />
            <span className="tnum">{formatDuration(biggest.yearsSpent)}</span>
          </dd>
        </div>

        {questionable && questionable.id !== biggest.id ? (
          <div>
            <dt className="text-[0.625rem] tracking-[0.18em] text-ink-faint uppercase">
              Most questionable purchase
            </dt>
            <dd className="mt-0.5 flex items-baseline gap-2 font-bold text-stamp">
              <span className="uppercase">{questionable.receiptLabel}</span>
              <span aria-hidden className="leader" />
              <span className="tnum">{formatDuration(questionable.yearsSpent)}</span>
            </dd>
          </div>
        ) : null}

        <div>
          <dt className="text-[0.625rem] tracking-[0.18em] text-ink-faint uppercase">
            Total
          </dt>
          <dd className="mt-0.5 font-bold">One life.</dd>
        </div>
      </dl>
    </>
  );
}

function Footer({ result }: { result: LifeResult }) {
  return (
    <footer className="relative">
      <p className="text-center text-[0.8125rem] font-bold tracking-[0.3em] uppercase">
        ** No refunds **
      </p>

      <NoRefundsStamp />

      <Barcode seed={result.seed} className="mt-4" />
      <p className="tnum mt-1.5 text-center text-[0.625rem] tracking-[0.3em] text-ink-muted">
        {orderNumber(result.seed, result.age)}
      </p>
      <p className="mt-3 text-center text-[0.625rem] tracking-[0.16em] text-ink-faint uppercase">
        Thank you for your time
      </p>
    </footer>
  );
}

function NoRefundsStamp() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -top-1 right-0 -rotate-[9deg] select-none"
    >
      <span className="block rounded-[3px] border-[2.5px] border-stamp/55 px-2 py-[3px] text-[0.5625rem] font-bold tracking-[0.18em] text-stamp/70 uppercase">
        Final
      </span>
    </div>
  );
}
