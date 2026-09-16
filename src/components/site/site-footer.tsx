"use client";

import { Lock } from "lucide-react";

import { useT } from "@/lib/i18n";
import { SITE_DOMAIN } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteFooter({ className }: { className?: string }) {
  const t = useT();

  return (
    <footer className={cn("no-print mt-auto border-t border-rule/70", className)}>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-5 py-8 pb-[calc(2rem+var(--safe-bottom))] sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-[0.8125rem] text-ink-muted">
          <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {t.footer.privacy}
        </p>
        <p className="eyebrow">{SITE_DOMAIN}</p>
      </div>
    </footer>
  );
}
