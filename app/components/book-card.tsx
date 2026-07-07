import Link from "next/link";
import type { BibleBook } from "@/lib/bible-books";
import { readLink } from "@/lib/progress-queries";
import { ProgressBar } from "./progress-bar";
import { CheckIcon } from "./check-icon";

export function BookCard({
  book,
  stats,
}: {
  book: BibleBook;
  stats: { read: number; total: number };
}) {
  const pct = stats.total > 0 ? Math.round((stats.read / stats.total) * 100) : 0;
  const complete = stats.read === stats.total;

  return (
    <Link
      href={readLink(book.usfm)}
      className={`rounded-md border px-2.5 py-1.5 transition-colors ${
        complete
          ? "border-emerald-200 bg-emerald-50/50 hover:border-emerald-300 dark:border-emerald-800/50 dark:bg-emerald-950/20 dark:hover:border-emerald-700"
          : "border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-600 dark:hover:bg-zinc-900/50"
      }`}
    >
      <div className="flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          {complete && <CheckIcon className="h-3 w-3 shrink-0 text-emerald-500" />}
          <span className="truncate text-xs font-medium text-zinc-800 dark:text-zinc-200">
            {book.name}
          </span>
        </div>
        <span className="shrink-0 text-[10px] tabular-nums text-zinc-400 dark:text-zinc-500">
          {stats.read}/{stats.total}
        </span>
      </div>
      <ProgressBar
        percentage={pct}
        height="mt-1.5 h-1"
        colorClass={
          complete
            ? "bg-emerald-400 dark:bg-emerald-500"
            : pct > 0
              ? "bg-sky-400 dark:bg-sky-500"
              : "bg-transparent"
        }
      />
    </Link>
  );
}
