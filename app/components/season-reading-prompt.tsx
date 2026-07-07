"use client";

import { useState } from "react";
import Link from "next/link";
import type { GeneratedPrompt, SeasonReadingItem } from "@/lib/season-prompts";
import type { SavedPrompt } from "@/lib/user-profile";
import type { ReadingGoal } from "@/lib/user-profile";
import { readLink } from "@/lib/progress-queries";
import { ProgressBar } from "./progress-bar";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className ?? "h-4 w-4"}
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function BookmarkIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className ?? "h-4 w-4"}
    >
      <path
        fillRule="evenodd"
        d="M10 2c-1.716 0-3.408.106-5.07.31C3.806 2.45 3 3.414 3 4.517V17.25a.75.75 0 0 0 1.075.676L10 15.082l5.925 2.844A.75.75 0 0 0 17 17.25V4.517c0-1.103-.806-2.068-1.93-2.207A41.403 41.403 0 0 0 10 2Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ReadingCard({ reading }: { reading: SeasonReadingItem }) {
  const [expanded, setExpanded] = useState(false);
  const href = readLink(reading.usfm, reading.chapter);

  return (
    <div
      className={`rounded-lg border p-3.5 transition-all ${
        reading.completed
          ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800/50 dark:bg-emerald-950/20"
          : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
            reading.completed
              ? "bg-emerald-500 text-white dark:bg-emerald-600"
              : "border border-zinc-300 dark:border-zinc-600"
          }`}
        >
          {reading.completed && <CheckIcon className="h-3 w-3" />}
        </div>
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-baseline gap-2 text-left"
            >
              <span
                className={`text-sm font-medium ${
                  reading.completed
                    ? "text-emerald-700 dark:text-emerald-400"
                    : "text-zinc-800 dark:text-zinc-200"
                }`}
              >
                {reading.title}
              </span>
              <span className="text-[11px] tabular-nums text-zinc-400 dark:text-zinc-500">
                {reading.bookName} {reading.chapter}
              </span>
            </button>
            <Link
              href={href}
              className="shrink-0 rounded px-2 py-0.5 text-[11px] font-medium text-sky-600 transition-colors hover:bg-sky-50 hover:text-sky-700 dark:text-sky-400 dark:hover:bg-sky-900/30 dark:hover:text-sky-300"
            >
              Read &rarr;
            </Link>
          </div>
          {expanded && (
            <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400 italic">
              {reading.prompt}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function SavedPromptCard({ prompt }: { prompt: SavedPrompt }) {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(prompt.generatedAt);
  const formatted = date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between p-3 text-left"
      >
        <div className="flex items-center gap-2">
          <BookmarkIcon className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500" />
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
            Saved {formatted}
          </span>
        </div>
        <span className="text-[11px] tabular-nums text-zinc-400 dark:text-zinc-500">
          {prompt.readings.length} readings
        </span>
      </button>
      {expanded && (
        <div className="border-t border-zinc-100 px-3 pb-3 pt-2 dark:border-zinc-800">
          <div className="flex flex-col gap-1.5">
            {prompt.readings.map((r, i) => (
              <div key={`${r.usfm}-${r.chapter}-${i}`} className="flex flex-col gap-0.5">
                <span className="text-xs text-zinc-600 dark:text-zinc-300">
                  {r.usfm} {r.chapter}
                </span>
                <span className="text-[11px] leading-relaxed text-zinc-400 dark:text-zinc-500 italic">
                  {r.prompt}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function SeasonReadingPrompt({
  prompt,
  goal,
  savedPrompts,
  onSavePrompt,
}: {
  prompt: GeneratedPrompt;
  goal: ReadingGoal;
  savedPrompts: SavedPrompt[];
  onSavePrompt: () => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const pct =
    prompt.totalCount > 0
      ? Math.round((prompt.completedCount / prompt.totalCount) * 100)
      : 0;

  const upNext = prompt.readings.filter((r) => !r.completed);
  const focusList = upNext.slice(0, goal.chaptersPerWeek);
  const displayList = showAll ? prompt.readings : focusList;
  const hasMore = !showAll && upNext.length > focusList.length;

  return (
    <div className="flex flex-col gap-5">
      {/* Season header */}
      <div className="rounded-xl border border-zinc-200 bg-gradient-to-br from-amber-50/60 to-sky-50/60 p-5 dark:border-zinc-800 dark:from-amber-950/20 dark:to-sky-950/20">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold tracking-wider text-amber-600 uppercase dark:text-amber-400">
                Current Season
              </span>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {prompt.seasonName}
              </h3>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-lg font-bold tabular-nums text-zinc-800 dark:text-zinc-200">
                {prompt.completedCount}/{prompt.totalCount}
              </span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                readings done
              </span>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            {prompt.seasonDescription}
          </p>
          <ProgressBar
            percentage={pct}
            height="h-1.5"
            colorClass={
              pct === 100
                ? "bg-emerald-400 dark:bg-emerald-500"
                : "bg-amber-400 dark:bg-amber-500"
            }
          />
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
              Goal: {goal.chaptersPerWeek} chapters/week
            </span>
            <span className="text-[11px] italic text-zinc-400 dark:text-zinc-500">
              {goal.note}
            </span>
          </div>
        </div>
      </div>

      {/* Reading list */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-medium tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
            {showAll ? "All Season Readings" : "Up Next"}
          </h3>
          <div className="flex items-center gap-3">
            <button
              onClick={onSavePrompt}
              className="flex items-center gap-1 text-[11px] font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
            >
              <BookmarkIcon className="h-3 w-3" />
              Save Prompt
            </button>
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-[11px] font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
            >
              {showAll ? "Show focus list" : `View all ${prompt.totalCount}`}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {displayList.map((reading) => (
            <ReadingCard
              key={`${reading.usfm}-${reading.chapter}`}
              reading={reading}
            />
          ))}
        </div>

        {hasMore && (
          <p className="text-center text-[11px] text-zinc-400 dark:text-zinc-500">
            {upNext.length - focusList.length} more readings after these
          </p>
        )}

        {pct === 100 && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 px-4 py-3 text-center dark:border-emerald-800/50 dark:bg-emerald-950/20">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              Season complete! You've finished all readings.
            </p>
          </div>
        )}
      </div>

      {/* Saved prompts */}
      {savedPrompts.length > 0 && (
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setShowSaved(!showSaved)}
            className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
          >
            <BookmarkIcon className="h-3 w-3" />
            {showSaved ? "Hide" : "Show"} saved prompts ({savedPrompts.length})
          </button>
          {showSaved && (
            <div className="flex flex-col gap-2">
              {savedPrompts.map((sp) => (
                <SavedPromptCard key={sp.id} prompt={sp} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
