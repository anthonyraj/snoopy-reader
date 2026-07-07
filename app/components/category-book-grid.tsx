import { useState } from "react";
import { BOOKS, CATEGORIES, type BookCategory } from "@/lib/bible-books";
import { BookCard } from "./book-card";

export function CategoryBookGrid({
  stats,
}: {
  stats: Record<string, { read: number; total: number }>;
}) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  function toggle(category: BookCategory) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {CATEGORIES.map((category) => {
        const books = BOOKS.filter((b) => b.category === category);
        const totalChapters = books.reduce((s, b) => s + b.chapters, 0);
        const readChapters = books.reduce(
          (s, b) => s + (stats[b.usfm]?.read ?? 0),
          0,
        );
        const isCollapsed = collapsed.has(category);

        return (
          <div key={category}>
            <button
              onClick={() => toggle(category)}
              className="flex w-full items-center justify-between py-2"
            >
              <div className="flex items-center gap-2">
                <svg
                  className={`h-3.5 w-3.5 text-zinc-400 transition-transform dark:text-zinc-500 ${
                    isCollapsed ? "-rotate-90" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
                <span className="text-xs font-medium tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
                  {category}
                </span>
              </div>
              <span className="text-[11px] tabular-nums text-zinc-400 dark:text-zinc-500">
                {readChapters} / {totalChapters}
              </span>
            </button>

            {!isCollapsed && (
              <div className="grid grid-cols-2 gap-1.5 pt-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {books.map((book) => (
                  <BookCard
                    key={book.usfm}
                    book={book}
                    stats={
                      stats[book.usfm] ?? { read: 0, total: book.chapters }
                    }
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
