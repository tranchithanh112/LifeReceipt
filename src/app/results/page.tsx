import type { Metadata } from "next";

import { ResultsView } from "@/components/results/results-view";

export const metadata: Metadata = {
  title: "My LifeReceipt",
  description:
    "An itemised receipt for one human life: what you have already spent on sleep, work, scrolling and the rest, and what it will cost by 80.",
  robots: { index: false, follow: true },
};

export default function ResultsPage() {
  return <ResultsView />;
}
