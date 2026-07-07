import Link from "next/link";
import { notFound } from "next/navigation";
import { bookByUsfm } from "@/lib/bible-books";
import { getChapterVerses } from "@/lib/search";
import { ChapterReadToggle } from "@/app/components/chapter-read-toggle";
import { BackLink } from "@/app/components/back-link";

export default async function ReadChapterPage({
  params,
}: {
  params: Promise<{ usfm: string; chapter: string }>;
}) {
  const { usfm, chapter: chapterStr } = await params;
  const book = bookByUsfm(usfm.toUpperCase());
  const chapter = Number(chapterStr);

  if (!book || isNaN(chapter) || chapter < 1 || chapter > book.chapters) {
    notFound();
  }

  const verses = getChapterVerses(book.name, chapter);
  if (verses.length === 0) {
    notFound();
  }

  const hasPrev = chapter > 1;
  const hasNext = chapter < book.chapters;

  return (
    <div className="flex flex-col gap-8">
      <BackLink />

      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          {book.name} {chapter}
        </h2>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">
          {book.testament === "OT" ? "Old Testament" : "New Testament"} &middot;{" "}
          {book.category} &middot; Chapter {chapter} of {book.chapters}
        </span>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {hasPrev && (
              <Link
                href={`/read/${usfm}/${chapter - 1}`}
                className="rounded px-2 py-1 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              >
                &larr; Ch. {chapter - 1}
              </Link>
            )}
            {hasNext && (
              <Link
                href={`/read/${usfm}/${chapter + 1}`}
                className="rounded px-2 py-1 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              >
                Ch. {chapter + 1} &rarr;
              </Link>
            )}
          </div>
          <ChapterReadToggle bookName={book.name} chapter={chapter} />
        </div>

        <div className="flex flex-col gap-1">
          {verses.map((v) => (
            <Link
              key={v.id}
              href={`/verse/${v.id}`}
              className="group flex gap-3 rounded px-3 py-2 text-sm transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
            >
              <span className="w-8 shrink-0 text-right tabular-nums text-zinc-400 dark:text-zinc-500">
                {v.verse}
              </span>
              <span className="leading-relaxed text-zinc-600 dark:text-zinc-400">
                {v.text}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
