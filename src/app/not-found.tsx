import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-7 px-6 text-center">
      <div>
        <p className="eyebrow">Void · no such transaction</p>
        <h1 className="mt-4 font-display text-[clamp(2.5rem,10vw,4rem)] leading-[0.98] tracking-[-0.025em]">
          This page was never printed.
        </h1>
        <p className="mt-4 max-w-[36ch] text-ink-muted">
          The page you asked for doesn&rsquo;t exist. Your life, unfortunately, is still
          being spent somewhere.
        </p>
      </div>

      <Link
        href="/"
        className={cn(buttonVariants({ variant: "primary", size: "lg" }), "group")}
      >
        Back to LifeReceipt
        <ArrowRight
          className="h-[1.1em] w-[1.1em] transition-transform duration-200 group-hover:translate-x-1"
          aria-hidden
        />
      </Link>
    </div>
  );
}
