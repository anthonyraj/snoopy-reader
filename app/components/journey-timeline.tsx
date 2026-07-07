import type { RecentEvent } from "@/lib/journey-queries";

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export function JourneyTimeline({ events }: { events: RecentEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-medium tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
          Recent Activity
        </h3>
        <p className="py-6 text-center text-sm text-zinc-400 dark:text-zinc-500">
          Mark chapters as read to start tracking your journey
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-medium tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
        Recent Activity
      </h3>
      <div className="flex flex-col">
        {events.map((e, i) => (
          <div key={`${e.usfm}-${e.chapter}-${e.ts}`} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="h-2 w-2 shrink-0 rounded-full bg-sky-400 dark:bg-sky-500 mt-1.5" />
              {i < events.length - 1 && (
                <div className="w-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
              )}
            </div>
            <div className="flex flex-1 items-baseline justify-between pb-4">
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                Read{" "}
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {e.bookName} {e.chapter}
                </span>
              </p>
              <span className="shrink-0 text-[10px] tabular-nums text-zinc-400 dark:text-zinc-500">
                {relativeTime(e.ts)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
