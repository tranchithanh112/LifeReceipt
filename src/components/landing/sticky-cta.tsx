"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Phone-only bottom bar, so the one action on the page is never more than a
 * thumb-reach away. It stands down whenever a real call to action is already
 * on screen — two identical black buttons stacked is worse than none.
 *
 * `watch` is a comma-separated list of element ids, kept as a string so the
 * effect dependency stays stable across renders.
 */
export function StickyCta({ watch }: { watch: string }) {
  const t = useT();
  const [anchorsOnScreen, setAnchorsOnScreen] = React.useState(0);

  React.useEffect(() => {
    const targets = watch
      .split(",")
      .map((id) => document.getElementById(id.trim()))
      .filter((node): node is HTMLElement => node != null);
    if (targets.length === 0) return;

    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      setAnchorsOnScreen(visible.size);
    });

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [watch]);

  const visible = anchorsOnScreen === 0;

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-paper/90 px-4 pt-3 pb-[calc(0.75rem+var(--safe-bottom))] backdrop-blur-sm transition-transform duration-300 sm:hidden",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <Link
        href="/calculate"
        tabIndex={visible ? undefined : -1}
        className={cn(buttonVariants({ variant: "primary", size: "lg" }), "w-full")}
      >
        {t.landing.cta}
        <ArrowRight className="h-[1.1em] w-[1.1em]" aria-hidden />
      </Link>
    </div>
  );
}
