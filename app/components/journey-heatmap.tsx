import type { DayActivity } from "@/lib/journey-queries";

function intensityClass(count: number): string {
  if (count === 0) return "bg-zinc-100 dark:bg-zinc-800/60";
  if (count === 1) return "bg-sky-200 dark:bg-sky-900";
  if (count <= 3) return "bg-sky-400 dark:bg-sky-700";
  return "bg-sky-600 dark:bg-sky-500";
}

export function JourneyHeatmap({ days }: { days: DayActivity[] }) {
  if (days.length === 0) return null;

  const totalRead = days.reduce((s, d) => s + d.count, 0);
  const activeDays = days.filter((d) => d.count > 0).length;

  const weeks: DayActivity[][] = [];
  const firstDate = new Date(days[0].date + "T00:00:00");
  const startPad = firstDate.getDay();

  const padded: (DayActivity | null)[] = [
    ...Array.from<null>({ length: startPad }).fill(null),
    ...days,
  ];

  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(
      padded.slice(i, i + 7).map(
        (d) => d ?? { date: "", count: 0 },
      ),
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <h3 className="text-xs font-medium tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
          Activity
        </h3>
        <p className="text-xs tabular-nums text-zinc-400 dark:text-zinc-500">
          {totalRead} chapters in {activeDays} active {activeDays === 1 ? "day" : "days"}
        </p>
      </div>
      <div className="overflow-x-auto">
        <div className="flex gap-[3px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => (
                <div
                  key={`${wi}-${di}`}
                  title={day.date ? `${day.date}: ${day.count} chapter${day.count !== 1 ? "s" : ""}` : ""}
                  className={`h-[13px] w-[13px] rounded-[2px] ${
                    day.date ? intensityClass(day.count) : "bg-transparent"
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-end gap-1.5 text-[10px] text-zinc-400 dark:text-zinc-500">
        <span>Less</span>
        <div className="h-[10px] w-[10px] rounded-[2px] bg-zinc-100 dark:bg-zinc-800/60" />
        <div className="h-[10px] w-[10px] rounded-[2px] bg-sky-200 dark:bg-sky-900" />
        <div className="h-[10px] w-[10px] rounded-[2px] bg-sky-400 dark:bg-sky-700" />
        <div className="h-[10px] w-[10px] rounded-[2px] bg-sky-600 dark:bg-sky-500" />
        <span>More</span>
      </div>
    </div>
  );
}
