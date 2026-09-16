"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { useLifeReceipt } from "@/lib/state";
import { cn } from "@/lib/utils";

/**
 * The hero call to action. Offers a shortcut back to an existing receipt once
 * one is in local storage, so returning visitors never redo the questions.
 */
export function PrimaryCta({ className, id }: { className?: string; id?: string }) {
  const { result, hydrated } = useLifeReceipt();
  const hasReceipt = hydrated && result != null && result.items.length > 0;

  return (
    <div className={cn("flex flex-col items-start gap-3", className)}>
      <Link
        id={id}
        href="/calculate"
        className={cn(buttonVariants({ variant: "primary", size: "lg" }), "group w-full sm:w-auto")}
      >
        Calculate my life
        <ArrowRight
          className="h-[1.1em] w-[1.1em] transition-transform duration-200 group-hover:translate-x-1"
          aria-hidden
        />
      </Link>

      <p className="text-[0.8125rem] text-ink-muted">
        30 seconds. No signup. Nothing leaves your phone.
      </p>

      {hasReceipt ? (
        <Link
          href="/results"
          className="text-[0.8125rem] font-medium text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink"
        >
          Or reopen your last receipt →
        </Link>
      ) : null}
    </div>
  );
}
