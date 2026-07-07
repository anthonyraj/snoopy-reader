import { BOOKS } from "@/lib/bible-books";
import type { BookProgress } from "@/lib/progress-queries";
import { ProgressBar } from "./progress-bar";
import { CheckIcon } from "./check-icon";

export function BooksCompleted({ books }: { books: BookProgress[] }) {
  if (books.length === 0) return null;

  const total = BOOKS.length;
  const pct = Math.round((books.length / total) * 100);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-medium tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
        Books Completed
      </h3>
      <div className="rounded-lg border border-zinc-200 p-5 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
            {books.length}
          </span>
          <span className="text-sm text-zinc-400 dark:text-zinc-500">
            / {total} books
          </span>
          {books.length === total && (
            <CheckIcon className="ml-auto h-5 w-5 text-emerald-500" />
          )}
        </div>
        <div className="mt-3">
          <ProgressBar
            percentage={pct}
            height="h-1.5"
            colorClass={
              books.length === total
                ? "bg-emerald-400 dark:bg-emerald-500"
                : "bg-sky-400 dark:bg-sky-500"
            }
          />
        </div>
        {books.length > 0 && books.length < total && (
          <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
            {total - books.length} more to go
          </p>
        )}
      </div>
    </div>
  );
}
