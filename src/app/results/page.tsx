import type { Metadata } from "next";

import { getDictionary } from "@/lib/i18n/dictionaries";

import { ResultsView } from "@/components/results/results-view";

const t = getDictionary();

export const metadata: Metadata = {
  title: t.meta.resultsTitle,
  description: t.meta.resultsDescription,
  robots: { index: false, follow: true },
};

export default function ResultsPage() {
  return <ResultsView />;
}
