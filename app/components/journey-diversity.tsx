import type { DiversityStat } from "@/lib/journey-queries";

const CATEGORY_COLORS: Record<string, string> = {
  Law: "bg-amber-400 dark:bg-amber-500",
  History: "bg-emerald-400 dark:bg-emerald-500",
  Wisdom: "bg-violet-400 dark:bg-violet-500",
  Poetry: "bg-pink-400 dark:bg-pink-500",
  Prophets: "bg-orange-400 dark:bg-orange-500",
  "Gospels & Acts": "bg-sky-400 dark:bg-sky-500",
  Letters: "bg-indigo-400 dark:bg-indigo-500",
  Revelation: "bg-rose-400 dark:bg-rose-500",
};

export function JourneyDiversity({ stats }: { stats: DiversityStat[] }) {
  const totalRead = stats.reduce((s, c) => s + c.read, 0);
  if (totalRead === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-medium tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
        Reading Diversity
      </h3>

      <div className="flex h-3 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800/60">
        {stats
          .filter((s) => s.read > 0)
          .map((s) => (
            <div
              key={s.category}
              className={`${CATEGORY_COLORS[s.category] ?? "bg-zinc-400"} transition-all`}
              style={{ width: `${(s.read / totalRead) * 100}%` }}
              title={`${s.category}: ${s.read} chapters`}
            />
          ))}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.category} className="flex items-center gap-2">
            <div
              className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                CATEGORY_COLORS[s.category] ?? "bg-zinc-400"
              }`}
            />
            <div className="min-w-0">
              <p className="truncate text-xs text-zinc-600 dark:text-zinc-300">
                {s.category}
              </p>
              <p className="text-[10px] tabular-nums text-zinc-400 dark:text-zinc-500">
                {s.read} / {s.total} ({s.percentage}%)
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
