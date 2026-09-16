"use client";

import { easeOutCubic, useAnimationProgress } from "@/hooks/use-motion";

/**
 * Counts from zero to `value` on mount. Mounting is the reset: render it only
 * at the moment the number should start climbing. `format` is required because
 * number formatting is locale-dependent.
 */
export function CountUp({
  value,
  duration = 1200,
  animate = true,
  format,
}: {
  value: number;
  duration?: number;
  animate?: boolean;
  format: (value: number) => string;
}) {
  const progress = useAnimationProgress(duration, animate);
  return <>{format(value * easeOutCubic(progress))}</>;
}
