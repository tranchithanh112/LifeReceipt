"use client";

import * as React from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToMotionPreference(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const motionSnapshot = () => window.matchMedia(REDUCED_MOTION_QUERY).matches;
const motionServerSnapshot = () => false;

/** Tracks the user's motion preference, including live changes. */
export function usePrefersReducedMotion(): boolean {
  return React.useSyncExternalStore(
    subscribeToMotionPreference,
    motionSnapshot,
    motionServerSnapshot,
  );
}

/**
 * Linear 0→1 progress over `duration`, driven entirely from rAF.
 *
 * Progress resets by remounting the component that uses it — that is the
 * intended way to replay the animation, and it keeps every state update
 * inside an animation frame rather than inside an effect body.
 */
export function useAnimationProgress(duration: number, enabled = true): number {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (!enabled || duration <= 0) return;

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setProgress(t);
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, enabled]);

  return enabled ? progress : 1;
}

export function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

/**
 * Scale factor that fits a fixed-size design into its measured container.
 * Sizing comes only from the ResizeObserver, which fires once on observe.
 */
export function useFitScale(
  ref: React.RefObject<HTMLElement | null>,
  naturalWidth: number,
): number {
  const [scale, setScale] = React.useState(0);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(() => {
      setScale(element.clientWidth / naturalWidth);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [naturalWidth, ref]);

  return scale;
}
