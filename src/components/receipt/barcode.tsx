import { cn } from "@/lib/utils";

/**
 * A decorative barcode derived from the answer seed, so the same answers
 * always print the same code and a screenshot looks like a real till slip.
 */
/** Deterministic bar widths from a seed. Pure, so a render never mutates it. */
function barWidths(seed: number, count: number): number[] {
  let state = (seed >>> 0) || 1;
  const widths: number[] = [];
  for (let index = 0; index < count; index++) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    widths.push(1 + Math.floor((state / 0x100000000) * 3));
  }
  return widths;
}

export function Barcode({
  seed,
  bars = 48,
  className,
}: {
  seed: number;
  bars?: number;
  className?: string;
}) {
  const widths = barWidths(seed, bars);

  return (
    <div
      aria-hidden="true"
      className={cn("flex h-9 items-stretch justify-center gap-[2px]", className)}
    >
      {widths.map((width, index) => (
        <span
          key={index}
          style={{ width: `${width}px` }}
          className={index % 2 === 0 ? "bg-ink" : "bg-transparent"}
        />
      ))}
    </div>
  );
}

/** "LR-4823-0028" — a plausible order number, stable for a given receipt. */
export function orderNumber(seed: number, age: number) {
  const block = ((seed % 9000) + 1000).toString();
  return `LR-${block}-${String(age).padStart(4, "0")}`;
}
