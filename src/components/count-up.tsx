"use client";

import { easeOutCubic, useAnimationProgress } from "@/hooks/use-motion";
import { formatNumber } from "@/lib/format";

/**
 * Counts from zero to `value` on mount. Mounting is the reset: render it only
 * at the moment the number should start climbing.
 */
export function CountUp({
  value,
  duration = 1200,
  animate = true,
  format = formatNumber,
}: {
  value: number;
  duration?: number;
  animate?: boolean;
  format?: (value: number) => string;
}) {
  const progress = useAnimationProgress(duration, animate);
  return <>{format(value * easeOutCubic(progress))}</>;
}
