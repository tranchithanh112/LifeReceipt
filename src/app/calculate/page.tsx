import type { Metadata } from "next";

import { getDictionary } from "@/lib/i18n/dictionaries";

import { Calculator } from "@/components/calculator/calculator";

const t = getDictionary();

export const metadata: Metadata = {
  title: t.meta.calculateTitle,
  description: t.meta.calculateDescription,
  robots: { index: false, follow: true },
};

export default function CalculatePage() {
  return <Calculator />;
}
