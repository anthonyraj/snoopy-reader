"use client";

import { useState } from "react";
import type { Badge } from "@/lib/badges";
import { BadgeIconSvg } from "./badge-icon";

const COLOR_MAP: Record<string, { bg: string; ring: string }> = {
  sky: {
    bg: "bg-sky-500 dark:bg-sky-600",
    ring: "ring-sky-200 dark:ring-sky-800",
  },
  emerald: {
    bg: "bg-emerald-500 dark:bg-emerald-600",
    ring: "ring-emerald-200 dark:ring-emerald-800",
  },
  violet: {
    bg: "bg-violet-500 dark:bg-violet-600",
    ring: "ring-violet-200 dark:ring-violet-800",
  },
  amber: {
    bg: "bg-amber-500 dark:bg-amber-600",
    ring: "ring-amber-200 dark:ring-amber-800",
  },
  orange: {
    bg: "bg-orange-500 dark:bg-orange-600",
    ring: "ring-orange-200 dark:ring-orange-800",
  },
  rose: {
    bg: "bg-rose-500 dark:bg-rose-600",
    ring: "ring-rose-200 dark:ring-rose-800",
  },
  teal: {
    bg: "bg-teal-500 dark:bg-teal-600",
    ring: "ring-teal-200 dark:ring-teal-800",
  },
  indigo: {
    bg: "bg-indigo-500 dark:bg-indigo-600",
    ring: "ring-indigo-200 dark:ring-indigo-800",
  },
  fuchsia: {
    bg: "bg-fuchsia-500 dark:bg-fuchsia-600",
    ring: "ring-fuchsia-200 dark:ring-fuchsia-800",
  },
};

export function BadgeShowcase({ badges }: { badges: Badge[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const earned = badges.filter((b) => b.earned);
  const sorted = [...earned, ...badges.filter((b) => !b.earned)];
  const selected = selectedId ? badges.find((b) => b.id === selectedId) : null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
          Badges
        </h3>
        <span className="text-[11px] tabular-nums text-zinc-400 dark:text-zinc-500">
          {earned.length} / {badges.length}
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {sorted.map((badge) => {
          const colors = COLOR_MAP[badge.color] ?? COLOR_MAP.sky;
          const isSelected = selectedId === badge.id;

          return (
            <button
              key={badge.id}
              onClick={() =>
                setSelectedId(isSelected ? null : badge.id)
              }
              className={`group relative flex shrink-0 items-center justify-center rounded-full transition-all ${
                badge.earned
                  ? `h-10 w-10 ${colors.bg} text-white ring-2 ${colors.ring} hover:scale-110`
                  : "h-10 w-10 bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
              } ${isSelected ? "scale-110" : ""}`}
              title={badge.name}
            >
              <BadgeIconSvg icon={badge.icon} className="h-5 w-5" />
            </button>
          );
        })}
      </div>

      {selected && (
        <div
          className={`rounded-lg border px-4 py-3 transition-all ${
            selected.earned
              ? "border-zinc-200 bg-zinc-50/50 dark:border-zinc-700 dark:bg-zinc-800/50"
              : "border-dashed border-zinc-200 dark:border-zinc-700"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              {selected.name}
            </span>
            {selected.earned && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                Earned
              </span>
            )}
            {!selected.earned && (
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                Locked
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            {selected.description}
          </p>
        </div>
      )}
    </div>
  );
}
