import type { StreakInfo } from "@/lib/journey-queries";

export function JourneyStreaks({ streak }: { streak: StreakInfo }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-medium tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
        Reading Streaks
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-lg">🔥</span>
            <span className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
              Current Streak
            </span>
          </div>
          <p className="text-2xl font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
            {streak.current}
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            {streak.current === 1 ? "day" : "days"}
          </p>
        </div>

        <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-lg">🏆</span>
            <span className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
              Longest Streak
            </span>
          </div>
          <p className="text-2xl font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
            {streak.longest}
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            {streak.longest === 1 ? "day" : "days"}
          </p>
        </div>
      </div>
    </div>
  );
}
