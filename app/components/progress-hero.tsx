import { BOOKS } from "@/lib/bible-books";
import type { Badge } from "@/lib/badges";
import { ProgressBar } from "./progress-bar";
import { BadgeShowcase } from "./badge-showcase";

interface TestamentStat {
  read: number;
  total: number;
  percentage: number;
}

function ProgressRing({
  percentage,
  size = 96,
  strokeWidth = 6,
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const complete = percentage === 100;

  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        className="stroke-zinc-100 dark:stroke-zinc-800"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className={`transition-all duration-500 ${
          complete
            ? "stroke-emerald-400 dark:stroke-emerald-500"
            : "stroke-sky-400 dark:stroke-sky-500"
        }`}
      />
    </svg>
  );
}

export function ProgressHero({
  overall,
  completedCount,
  ot,
  nt,
  badges,
}: {
  overall: { read: number; total: number };
  completedCount: number;
  ot: TestamentStat;
  nt: TestamentStat;
  badges: Badge[];
}) {
  const overallPct =
    overall.total > 0
      ? Math.round((overall.read / overall.total) * 100)
      : 0;
  const totalBooks = BOOKS.length;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-6">
        <div className="relative">
          <ProgressRing percentage={overallPct} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
              {overallPct}%
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Reading Progress
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {overall.read} of {overall.total.toLocaleString()} chapters
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-zinc-200 px-3 py-2.5 dark:border-zinc-800">
          <p className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
            Books
          </p>
          <p className="mt-0.5 text-sm font-semibold tabular-nums text-zinc-800 dark:text-zinc-200">
            {completedCount}{" "}
            <span className="font-normal text-zinc-400 dark:text-zinc-500">
              / {totalBooks}
            </span>
          </p>
        </div>

        <div className="rounded-lg border border-zinc-200 px-3 py-2.5 dark:border-zinc-800">
          <p className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
            Old Test.
          </p>
          <div className="mt-0.5 flex items-center gap-2">
            <span className="text-sm font-semibold tabular-nums text-zinc-800 dark:text-zinc-200">
              {ot.percentage}%
            </span>
            <ProgressBar
              percentage={ot.percentage}
              height="h-1"
              colorClass={
                ot.percentage === 100
                  ? "bg-emerald-400 dark:bg-emerald-500"
                  : "bg-sky-400 dark:bg-sky-500"
              }
            />
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 px-3 py-2.5 dark:border-zinc-800">
          <p className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
            New Test.
          </p>
          <div className="mt-0.5 flex items-center gap-2">
            <span className="text-sm font-semibold tabular-nums text-zinc-800 dark:text-zinc-200">
              {nt.percentage}%
            </span>
            <ProgressBar
              percentage={nt.percentage}
              height="h-1"
              colorClass={
                nt.percentage === 100
                  ? "bg-emerald-400 dark:bg-emerald-500"
                  : "bg-sky-400 dark:bg-sky-500"
              }
            />
          </div>
        </div>
      </div>

      <BadgeShowcase badges={badges} />
    </div>
  );
}
