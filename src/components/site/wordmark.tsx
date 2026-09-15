import Link from "next/link";

import { cn } from "@/lib/utils";

export function Wordmark({
  className,
  asLink = true,
}: {
  className?: string;
  asLink?: boolean;
}) {
  const content = (
    <span
      className={cn(
        "inline-flex items-baseline gap-[0.3em] font-mono text-[0.8125rem] font-bold tracking-[0.22em] uppercase",
        className,
      )}
    >
      <ReceiptGlyph />
      Life<span className="-ml-[0.3em] font-normal">Receipt</span>
    </span>
  );

  if (!asLink) return content;

  return (
    <Link href="/" className="transition-opacity hover:opacity-65">
      {content}
    </Link>
  );
}

function ReceiptGlyph() {
  return (
    <svg
      aria-hidden="true"
      width="13"
      height="16"
      viewBox="0 0 13 16"
      fill="none"
      className="translate-y-[1px]"
    >
      <path
        d="M1 1h11v13.2l-1.83-1.1-1.84 1.1-1.83-1.1-1.84 1.1L2.83 13.1 1 14.2V1Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M3.6 4.8h5.8M3.6 7.6h5.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
