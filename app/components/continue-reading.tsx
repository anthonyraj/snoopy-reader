import type { ContinueItem } from "@/lib/progress-queries";

export function ContinueReading({ items }: { items: ContinueItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-medium tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
        Continue Reading
      </h3>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div
            key={item.usfm}
            className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3 dark:border-zinc-800"
          >
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
                {item.usfm}
              </span>
              <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {item.name}
              </span>
            </div>
            <span className="shrink-0 rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
              Chapter {item.nextChapter}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
