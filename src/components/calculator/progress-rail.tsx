import { cn } from "@/lib/utils";

export function ProgressRail({
  current,
  total,
  className,
}: {
  /** 0-based index of the active step. */
  current: number;
  total: number;
  className?: string;
}) {
  const pct = Math.round(((current + 1) / total) * 100);

  return (
    <div
      className={cn("flex items-center gap-3", className)}
      role="progressbar"
      aria-label="Question progress"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current + 1}
      aria-valuetext={`Question ${current + 1} of ${total}`}
    >
      <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-paper-sunk">
        <div
          className="h-full rounded-full bg-ink transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="tnum shrink-0 font-mono text-[0.6875rem] tracking-[0.12em] text-ink-faint">
        {String(current + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
      </span>
    </div>
  );
}
