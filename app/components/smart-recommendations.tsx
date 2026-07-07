"use client";

import Link from "next/link";
import type { Recommendation, RecommendationType } from "@/lib/recommendations";
import { readLink } from "@/lib/progress-queries";

const TYPE_CONFIG: Record<
  RecommendationType,
  { label: string; tagBg: string; tagText: string }
> = {
  momentum: {
    label: "Keep Going",
    tagBg: "bg-sky-50 dark:bg-sky-900/30",
    tagText: "text-sky-700 dark:text-sky-300",
  },
  affinity: {
    label: "Try This",
    tagBg: "bg-violet-50 dark:bg-violet-900/30",
    tagText: "text-violet-700 dark:text-violet-300",
  },
  discovery: {
    label: "Explore",
    tagBg: "bg-teal-50 dark:bg-teal-900/30",
    tagText: "text-teal-700 dark:text-teal-300",
  },
  completion: {
    label: "Complete",
    tagBg: "bg-amber-50 dark:bg-amber-900/30",
    tagText: "text-amber-700 dark:text-amber-300",
  },
  "start-here": {
    label: "Start Here",
    tagBg: "bg-emerald-50 dark:bg-emerald-900/30",
    tagText: "text-emerald-700 dark:text-emerald-300",
  },
};

function RecommendationCard({ rec }: { rec: Recommendation }) {
  const config = TYPE_CONFIG[rec.type];

  return (
    <Link
      href={readLink(rec.book.usfm, rec.chapter)}
      className="flex flex-col gap-2.5 rounded-lg border border-zinc-200 p-4 transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-600 dark:hover:bg-zinc-900/50"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
            {rec.book.name}
          </span>
          <span className="text-xs tabular-nums text-zinc-400 dark:text-zinc-500">
            Chapter {rec.chapter} · {rec.book.chapters} total
          </span>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${config.tagBg} ${config.tagText}`}
        >
          {config.label}
        </span>
      </div>
      <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
        {rec.reason}
      </p>
    </Link>
  );
}

function StartHereSection({ recs }: { recs: Recommendation[] }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
          Where to start
        </h3>
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          Great first reads for your journey
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {recs.map((rec) => (
          <Link
            key={rec.book.usfm}
            href={readLink(rec.book.usfm, rec.chapter)}
            className="flex items-start gap-3 rounded-lg border border-zinc-200 p-4 transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-600 dark:hover:bg-zinc-900/50"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              {rec.book.name.charAt(0)}
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {rec.book.name}
              </span>
              <span className="text-[11px] tabular-nums text-zinc-400 dark:text-zinc-500">
                {rec.book.chapters} chapters · {rec.book.testament === "OT" ? "Old" : "New"}{" "}
                Testament
              </span>
              <p className="mt-0.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                {rec.reason}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function SmartRecommendations({ items }: { items: Recommendation[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-200 px-6 py-12 text-center dark:border-zinc-800">
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          Start reading to track your progress
        </p>
      </div>
    );
  }

  const isNewUser = items.every((r) => r.type === "start-here");

  if (isNewUser) {
    return <StartHereSection recs={items} />;
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-medium tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
        Recommended for You
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((rec) => (
          <RecommendationCard key={`${rec.type}-${rec.book.usfm}`} rec={rec} />
        ))}
      </div>
    </div>
  );
}
