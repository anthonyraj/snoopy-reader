import type { CategoryStat } from "@/lib/progress-queries";
import { ProgressBar } from "./progress-bar";
import { CheckIcon } from "./check-icon";

export function CategoryProgress({ categories }: { categories: CategoryStat[] }) {
  const sorted = [...categories].sort((a, b) =>
    b.percentage - a.percentage || b.read - a.read,
  );

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-medium tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
        By Category
      </h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((cat) => {
          const complete = cat.read === cat.total && cat.total > 0;
          return (
            <div
              key={cat.category}
              className={`rounded-lg border p-4 transition-colors ${
                complete
                  ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800/50 dark:bg-emerald-950/20"
                  : "border-zinc-200 dark:border-zinc-800"
              }`}
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  {cat.category}
                </span>
                {complete && <CheckIcon className="h-3.5 w-3.5 text-emerald-500" />}
              </div>
              <ProgressBar
                percentage={cat.percentage}
                colorClass={
                  complete
                    ? "bg-emerald-400 dark:bg-emerald-500"
                    : cat.percentage > 0
                      ? "bg-sky-400 dark:bg-sky-500"
                      : "bg-transparent"
                }
              />
              <div className="mt-2 flex items-center justify-between text-[11px] tabular-nums text-zinc-400 dark:text-zinc-500">
                <span>{cat.read} / {cat.total} chapters</span>
                <span>{cat.booksComplete} / {cat.booksTotal} books</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
