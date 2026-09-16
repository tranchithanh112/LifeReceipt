import type { Stat } from "@/lib/stats";

/**
 * The lead statistic gets display size to itself; the rest are hairline-ruled
 * rows. No cards, no borders, no boxes — hierarchy does the work, so the page
 * reads like a broadsheet rather than a dashboard.
 */
export function StatGrid({ stats }: { stats: Stat[] }) {
  if (stats.length === 0) return null;

  const [lead, ...rest] = stats;

  return (
    <div>
      <div className="animate-rise">
        <p className="tnum font-display text-[clamp(3.25rem,17vw,6rem)] leading-[0.88] tracking-[-0.035em]">
          {lead.value}
        </p>
        <p className="mt-3 max-w-[28ch] text-[1.125rem] leading-snug text-ink text-pretty sm:text-xl">
          {lead.text}
        </p>
      </div>

      {rest.length > 0 ? (
        <ul className="mt-10">
          {rest.map((stat, index) => (
            <li
              key={stat.id}
              className="animate-rise border-t border-ink/15 py-5 sm:flex sm:items-baseline sm:gap-7"
              style={{ animationDelay: `${(index + 1) * 0.07}s` }}
            >
              <p className="tnum shrink-0 font-display text-[clamp(2rem,8vw,2.75rem)] leading-none tracking-[-0.02em] sm:w-[7.5rem]">
                {stat.value}
              </p>
              <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-muted text-pretty sm:mt-0 sm:text-base">
                {stat.text}
              </p>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
