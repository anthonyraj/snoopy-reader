import Link from "next/link";
import type { BookProgress } from "@/lib/progress-queries";
import { readLink } from "@/lib/progress-queries";
import { ProgressBar } from "./progress-bar";
import { CheckIcon } from "./check-icon";

export function TopBooks({ books }: { books: BookProgress[] }) {
  if (books.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-medium tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
        Top Books
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {books.map((b) => {
          const complete = b.read === b.total;
          return (
            <Link
              key={b.usfm}
              href={readLink(b.usfm)}
              className={`flex w-36 shrink-0 flex-col rounded-lg border p-3 transition-colors ${
                complete
                  ? "border-emerald-200 bg-emerald-50/50 hover:border-emerald-300 dark:border-emerald-800/50 dark:bg-emerald-950/20 dark:hover:border-emerald-700"
                  : "border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-600 dark:hover:bg-zinc-900/50"
              }`}
            >
              <div className="mb-1.5 flex items-center justify-between gap-1">
                <span className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
                  {b.usfm}
                </span>
                {complete && <CheckIcon className="h-3 w-3 text-emerald-500" />}
              </div>
              <p className="mb-1 truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {b.name}
              </p>
              <ProgressBar
                percentage={b.percentage}
                colorClass={
                  complete
                    ? "bg-emerald-400 dark:bg-emerald-500"
                    : "bg-sky-400 dark:bg-sky-500"
                }
              />
              <p className="mt-1.5 text-[11px] tabular-nums text-zinc-400 dark:text-zinc-500">
                {b.read} / {b.total} chapters
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
