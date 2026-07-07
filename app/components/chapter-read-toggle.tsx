"use client";

import { useEffect, useState } from "react";
import { isChapterReadByName, setChapterReadByName } from "@/lib/progress";
import { CheckIcon } from "./check-icon";

export function ChapterReadToggle({
  bookName,
  chapter,
}: {
  bookName: string;
  chapter: number;
}) {
  const [read, setRead] = useState(false);

  useEffect(() => {
    setRead(isChapterReadByName(bookName, chapter));
  }, [bookName, chapter]);

  function toggle() {
    const next = !read;
    setChapterReadByName(bookName, chapter, next);
    setRead(next);
  }

  return (
    <button
      onClick={toggle}
      className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        read
          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:hover:bg-emerald-900/60"
          : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
      }`}
    >
      {read ? (
        <>
          <CheckIcon />
          Chapter read
        </>
      ) : (
        "Mark chapter as read"
      )}
    </button>
  );
}
