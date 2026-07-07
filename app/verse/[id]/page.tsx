import Link from "next/link";
import { notFound } from "next/navigation";
import { getVerseById, getChapterVerses } from "@/lib/search";
import { ChapterReadToggle } from "@/app/components/chapter-read-toggle";
import { BackLink } from "@/app/components/back-link";

export default async function VersePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const verse = getVerseById(Number(id));

  if (!verse) {
    notFound();
  }

  const chapterVerses = getChapterVerses(verse.book, verse.chapter);

  return (
    <div className="flex flex-col gap-8">
      <BackLink />

      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          {verse.book} {verse.chapter}:{verse.verse}
        </h2>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">
          {verse.testament === "OT" ? "Old Testament" : "New Testament"}
        </span>
      </div>

      <blockquote className="border-l-4 border-zinc-300 py-1 pl-5 text-lg leading-relaxed text-zinc-800 dark:border-zinc-600 dark:text-zinc-200">
        {verse.text}
      </blockquote>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-medium tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
            {verse.book} Chapter {verse.chapter}
          </h3>
          <ChapterReadToggle bookName={verse.book} chapter={verse.chapter} />
        </div>
        <div className="flex flex-col gap-1">
          {chapterVerses.map((cv) => {
            const isFocused = cv.id === verse.id;
            return (
              <Link
                key={cv.id}
                href={`/verse/${cv.id}`}
                className={`group flex gap-3 rounded px-3 py-2 text-sm transition-colors ${
                  isFocused
                    ? "bg-zinc-100 dark:bg-zinc-800"
                    : "hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                }`}
              >
                <span
                  className={`shrink-0 w-8 text-right tabular-nums ${
                    isFocused
                      ? "font-semibold text-zinc-900 dark:text-zinc-100"
                      : "text-zinc-400 dark:text-zinc-500"
                  }`}
                >
                  {cv.verse}
                </span>
                <span
                  className={`leading-relaxed ${
                    isFocused
                      ? "font-medium text-zinc-900 dark:text-zinc-100"
                      : "text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  {cv.text}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
