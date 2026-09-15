"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

/**
 * A deliberately chunky slider. The track is a printed rule, the thumb is a
 * solid ink disc, and every step tick is drawn so dragging feels notched
 * rather than continuous.
 */
export function Slider({
  className,
  ticks = 0,
  haptic = true,
  onValueChange,
  // The thumb — not the root — is the element with role="slider", so the
  // accessible name has to travel down to it.
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & {
  /** Number of evenly spaced marks drawn behind the track. 0 disables them. */
  ticks?: number;
  haptic?: boolean;
}) {
  const handleChange = React.useCallback(
    (value: number[]) => {
      if (haptic && typeof navigator !== "undefined" && "vibrate" in navigator) {
        try {
          navigator.vibrate(3);
        } catch {
          // Vibration is a nicety; never let it break the interaction.
        }
      }
      onValueChange?.(value);
    },
    [haptic, onValueChange],
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn(
        "relative flex h-11 w-full touch-none items-center select-none data-[disabled]:opacity-50",
        className,
      )}
      onValueChange={handleChange}
      {...props}
    >
      {ticks > 0 ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-[2px]"
        >
          {Array.from({ length: ticks + 1 }, (_, i) => (
            <span key={i} className="h-3 w-px bg-ink/15" />
          ))}
        </div>
      ) : null}

      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative h-[6px] w-full grow overflow-hidden rounded-full bg-paper-sunk"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute h-full rounded-full bg-ink"
        />
      </SliderPrimitive.Track>

      <SliderPrimitive.Thumb
        data-slot="slider-thumb"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className="block h-6 w-6 rounded-full border-[3px] border-paper bg-ink shadow-[0_2px_8px_rgba(22,19,15,0.35)] transition-transform duration-100 hover:scale-110 focus-visible:scale-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink active:scale-105"
      />
    </SliderPrimitive.Root>
  );
}
