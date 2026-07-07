import Link from "next/link";
import type { VerseResult } from "@/lib/search";

function relevancePercent(distance: number) {
  const percentage = Math.round((1 - distance / 2) * 100);
  return Math.max(0, Math.min(100, percentage));
}

function relevanceColor(pct: number) {
  if (pct >= 90) return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300";
  if (pct >= 80) return "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300";
  return "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400";
}

function relevanceBarColor(pct: number) {
  if (pct >= 90) return "bg-emerald-400 dark:bg-emerald-500";
  if (pct >= 80) return "bg-sky-400 dark:bg-sky-500";
  return "bg-zinc-300 dark:bg-zinc-600";
}

export function ResultCard({ result, rank }: { result: VerseResult; rank: number }) {
  const pct = relevancePercent(result.distance);

  return (
    <Link
      href={`/verse/${result.id}`}
      className="group rounded-lg border border-zinc-200 p-5 outline-none transition-colors hover:border-zinc-400 hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:border-zinc-800 dark:hover:border-zinc-600 dark:hover:bg-zinc-900/50 dark:focus-visible:ring-zinc-500 dark:focus-visible:ring-offset-zinc-950"
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-6 shrink-0 text-right text-xs tabular-nums text-zinc-300 dark:text-zinc-600">
            {rank}
          </span>
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            {result.book} {result.chapter}:{result.verse}
          </span>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${relevanceColor(pct)}`}
        >
          {pct}% match
        </span>
      </div>
      <p
        className="line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400"
        title={result.text}
      >
        {result.text}
      </p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-xs text-zinc-400 dark:text-zinc-500">
          {result.testament === "OT" ? "Old Testament" : "New Testament"}
        </span>
      </div>
      <div className="mt-2 h-0.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
        <div
          className={`h-full rounded-full transition-all ${relevanceBarColor(pct)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </Link>
  );
}
