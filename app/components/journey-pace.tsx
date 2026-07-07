import type { WeekPace } from "@/lib/journey-queries";

export function JourneyPace({ weeks }: { weeks: WeekPace[] }) {
  if (weeks.length === 0) return null;

  const max = Math.max(...weeks.map((w) => w.count), 1);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-medium tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
        Weekly Pace
      </h3>
      <div className="flex items-end gap-2" style={{ height: 120 }}>
        {weeks.map((w) => {
          const height = w.count > 0 ? Math.max((w.count / max) * 100, 4) : 0;
          return (
            <div key={w.weekLabel} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-[10px] tabular-nums text-zinc-400 dark:text-zinc-500">
                {w.count || ""}
              </span>
              <div className="flex w-full items-end" style={{ height: 80 }}>
                <div
                  className={`w-full rounded-t transition-all ${
                    w.count > 0
                      ? "bg-sky-400 dark:bg-sky-500"
                      : "bg-zinc-100 dark:bg-zinc-800/60"
                  }`}
                  style={{ height: `${w.count > 0 ? height : 4}%` }}
                />
              </div>
              <span className="text-[9px] text-zinc-400 dark:text-zinc-500">
                {w.weekLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
