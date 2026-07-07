import Link from "next/link";
import type { BookProgress } from "@/lib/progress-queries";
import { readLink } from "@/lib/progress-queries";
import { ProgressBar } from "./progress-bar";

export function ReadingHighlights({
  mostRead,
}: {
  mostRead: BookProgress | null;
}) {
  if (!mostRead) return null;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-medium tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
        Most Read
      </h3>
      <Link
        href={readLink(mostRead.usfm)}
        className="rounded-lg border border-zinc-200 p-4 transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-600 dark:hover:bg-zinc-900/50"
      >
        <p className="mb-1 text-[10px] font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
          Most Read Book
        </p>
        <p className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
          {mostRead.name}
        </p>
        <p className="mb-2 text-xs tabular-nums text-zinc-400 dark:text-zinc-500">
          {mostRead.read} / {mostRead.total} chapters ({mostRead.percentage}%)
        </p>
        <ProgressBar
          percentage={mostRead.percentage}
          colorClass={
            mostRead.percentage === 100
              ? "bg-emerald-400 dark:bg-emerald-500"
              : "bg-sky-400 dark:bg-sky-500"
          }
        />
      </Link>
    </div>
  );
}
