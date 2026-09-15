import type { Stat } from "@/lib/stats";

export function StatGrid({ stats }: { stats: Stat[] }) {
  if (stats.length === 0) return null;

  return (
    <ul className="grid gap-px overflow-hidden rounded-2xl bg-rule/70 sm:grid-cols-2">
      {stats.map((stat, index) => (
        <li
          key={stat.id}
          className="animate-rise bg-paper p-5 sm:p-6"
          style={{ animationDelay: `${index * 0.06}s` }}
        >
          <p className="tnum font-display text-[clamp(2.25rem,9vw,3.25rem)] leading-[0.95] tracking-[-0.03em]">
            {stat.value}
          </p>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted text-pretty">
            {stat.text}
          </p>
        </li>
      ))}
    </ul>
  );
}
