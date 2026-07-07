import type { Milestone } from "@/lib/journey-queries";

const ICONS: Record<string, string> = {
  "first-chapter": "📖",
  "first-book": "📚",
  "3-categories": "🧭",
  "50-chapters": "⭐",
  "100-chapters": "💯",
  "250-chapters": "🎓",
  "500-chapters": "🏅",
  "all-gospels": "✝️",
  "ot-complete": "📜",
  "nt-complete": "✨",
  "entire-bible": "👑",
};

export function JourneyMilestones({ milestones }: { milestones: Milestone[] }) {
  const earned = milestones.filter((m) => m.earned);
  const locked = milestones.filter((m) => !m.earned);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <h3 className="text-xs font-medium tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
          Milestones
        </h3>
        <p className="text-xs tabular-nums text-zinc-400 dark:text-zinc-500">
          {earned.length} / {milestones.length} earned
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {milestones.map((m) => (
          <div
            key={m.id}
            className={`rounded-lg border p-3 transition-colors ${
              m.earned
                ? "border-amber-200 bg-amber-50/50 dark:border-amber-800/50 dark:bg-amber-950/20"
                : "border-zinc-200 opacity-50 dark:border-zinc-800"
            }`}
          >
            <div className="mb-1.5 text-lg">{ICONS[m.id] ?? "🏷️"}</div>
            <p
              className={`text-xs font-semibold ${
                m.earned
                  ? "text-zinc-800 dark:text-zinc-200"
                  : "text-zinc-400 dark:text-zinc-500"
              }`}
            >
              {m.title}
            </p>
            <p className="mt-0.5 text-[10px] text-zinc-400 dark:text-zinc-500">
              {m.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
