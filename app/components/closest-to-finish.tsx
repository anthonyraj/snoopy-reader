import type { AlmostDone } from "@/lib/progress-queries";
import { ProgressBar } from "./progress-bar";

export function ClosestToFinish({ books }: { books: AlmostDone[] }) {
  if (books.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-medium tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
        Almost There
      </h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((b) => (
          <div
            key={b.usfm}
            className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
          >
            <p className="mb-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
              {b.name}
            </p>
            <p className="mb-2 text-xs text-zinc-400 dark:text-zinc-500">
              {b.remaining === 1 ? "1 chapter to go!" : `${b.remaining} chapters to go!`}
            </p>
            <ProgressBar
              percentage={b.percentage}
              colorClass="bg-amber-400 dark:bg-amber-500"
            />
            <p className="mt-1.5 text-[11px] tabular-nums text-zinc-400 dark:text-zinc-500">
              {b.read} / {b.total}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
