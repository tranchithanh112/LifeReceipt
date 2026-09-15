import type { Metadata } from "next";

import { Calculator } from "@/components/calculator/calculator";

export const metadata: Metadata = {
  title: "Calculate my life",
  description:
    "Nine quick questions about how you spend an average day. Takes 30 seconds, no signup, nothing leaves your device.",
  robots: { index: false, follow: true },
};

export default function CalculatePage() {
  return <Calculator />;
}
