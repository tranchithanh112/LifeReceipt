import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Section({
  id,
  eyebrow,
  title,
  lede,
  children,
  className,
  bordered = true,
}: {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  lede?: ReactNode;
  children: ReactNode;
  className?: string;
  bordered?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "px-5 py-12 sm:px-8 sm:py-16",
        bordered && "border-t border-rule/70",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-3xl">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        {title ? (
          <h2 className="mt-4 font-display text-[clamp(2rem,7vw,3.25rem)] leading-[1.0] tracking-[-0.02em] text-balance">
            {title}
          </h2>
        ) : null}
        {lede ? (
          <p className="mt-4 max-w-[46ch] text-[0.9375rem] leading-relaxed text-ink-muted sm:text-base">
            {lede}
          </p>
        ) : null}
        <div className={eyebrow || title || lede ? "mt-8 sm:mt-10" : undefined}>
          {children}
        </div>
      </div>
    </section>
  );
}
