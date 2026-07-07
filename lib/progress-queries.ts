import { BOOKS, CATEGORIES, type BibleBook, type BookCategory } from "./bible-books";
import { getProgress } from "./progress";

export interface BookProgress {
  usfm: string;
  name: string;
  testament: "OT" | "NT";
  read: number;
  total: number;
  percentage: number;
}

function toBookProgress(book: BibleBook, bits: number[] | undefined): BookProgress {
  const read = bits ? bits.filter((b) => b === 1).length : 0;
  return {
    usfm: book.usfm,
    name: book.name,
    testament: book.testament,
    read,
    total: book.chapters,
    percentage: book.chapters > 0 ? Math.round((read / book.chapters) * 100) : 0,
  };
}

/** All books with at least 1 chapter read, sorted by chapters-read descending. */
export function getStartedBooks(): BookProgress[] {
  const progress = getProgress();
  const started: BookProgress[] = [];

  for (const book of BOOKS) {
    const bp = toBookProgress(book, progress[book.usfm]);
    if (bp.read > 0) started.push(bp);
  }

  return started.sort((a, b) => b.read - a.read || b.percentage - a.percentage);
}

/** Top N books by chapters read. Defaults to 5. */
export function getTopBooks(limit = 5): BookProgress[] {
  return getStartedBooks().slice(0, limit);
}

/** Book with highest percentage. Tie-break: most chapters read. Returns null if nothing read. */
export function getMostReadBook(): BookProgress | null {
  const started = getStartedBooks();
  if (started.length === 0) return null;

  return started.reduce((best, cur) =>
    cur.percentage > best.percentage ||
    (cur.percentage === best.percentage && cur.read > best.read)
      ? cur
      : best
  );
}

/** Aggregated stats for a single testament. */
export function getTestamentStats(
  testament: "OT" | "NT"
): { read: number; total: number; percentage: number } {
  const progress = getProgress();
  let read = 0;
  let total = 0;

  for (const book of BOOKS) {
    if (book.testament !== testament) continue;
    total += book.chapters;
    const bits = progress[book.usfm];
    if (bits) read += bits.filter((b) => b === 1).length;
  }

  return {
    read,
    total,
    percentage: total > 0 ? Math.round((read / total) * 100) : 0,
  };
}

/** Full progress snapshot for every book (used by the book grid). */
export function getAllBookStats(): Record<string, { read: number; total: number }> {
  const progress = getProgress();
  const result: Record<string, { read: number; total: number }> = {};
  for (const book of BOOKS) {
    const bp = toBookProgress(book, progress[book.usfm]);
    result[book.usfm] = { read: bp.read, total: bp.total };
  }
  return result;
}

/** Books where every chapter has been read, in canonical order. */
export function getCompletedBooks(): BookProgress[] {
  const progress = getProgress();
  const completed: BookProgress[] = [];
  for (const book of BOOKS) {
    const bp = toBookProgress(book, progress[book.usfm]);
    if (bp.read === bp.total) completed.push(bp);
  }
  return completed;
}

export interface AlmostDone extends BookProgress {
  remaining: number;
}

/** Started-but-not-finished books sorted by fewest remaining chapters. */
export function getClosestToCompletion(limit = 3): AlmostDone[] {
  const progress = getProgress();
  const inProgress: AlmostDone[] = [];

  for (const book of BOOKS) {
    const bp = toBookProgress(book, progress[book.usfm]);
    if (bp.read > 0 && bp.read < bp.total) {
      inProgress.push({ ...bp, remaining: bp.total - bp.read });
    }
  }

  return inProgress.sort((a, b) => a.remaining - b.remaining).slice(0, limit);
}

export interface ContinueItem {
  usfm: string;
  name: string;
  nextChapter: number;
}

/** For each in-progress book, finds the first unread chapter. Up to `limit` books. */
export function getContinueReading(limit = 3): ContinueItem[] {
  const progress = getProgress();
  const items: ContinueItem[] = [];

  for (const book of BOOKS) {
    const bits = progress[book.usfm];
    if (!bits) continue;
    const readCount = bits.filter((b) => b === 1).length;
    if (readCount === 0 || readCount === book.chapters) continue;

    const nextIdx = bits.indexOf(0);
    if (nextIdx !== -1) {
      items.push({ usfm: book.usfm, name: book.name, nextChapter: nextIdx + 1 });
    }
    if (items.length >= limit) break;
  }

  return items;
}

export interface CategoryStat {
  category: BookCategory;
  read: number;
  total: number;
  percentage: number;
  booksComplete: number;
  booksTotal: number;
}

/**
 * Returns the first unread chapter for a book, or chapter 1 if
 * no progress exists or the book is fully read.
 */
export function getNextChapterForBook(usfm: string): number {
  const progress = getProgress();
  const bits = progress[usfm];
  if (!bits) return 1;
  const idx = bits.indexOf(0);
  return idx === -1 ? 1 : idx + 1;
}

/** Build a /read/USFM/chapter URL. Defaults to the next unread chapter. */
export function readLink(usfm: string, chapter?: number): string {
  const ch = chapter ?? getNextChapterForBook(usfm);
  return `/read/${usfm}/${ch}`;
}

/** Aggregated chapter and book counts per category. */
export function getCategoryProgress(): CategoryStat[] {
  const progress = getProgress();

  return CATEGORIES.map((category) => {
    const categoryBooks = BOOKS.filter((b) => b.category === category);
    let read = 0;
    let total = 0;
    let booksComplete = 0;

    for (const book of categoryBooks) {
      total += book.chapters;
      const bits = progress[book.usfm];
      if (bits) {
        const bookRead = bits.filter((b) => b === 1).length;
        read += bookRead;
        if (bookRead === book.chapters) booksComplete++;
      }
    }

    return {
      category,
      read,
      total,
      percentage: total > 0 ? Math.round((read / total) * 100) : 0,
      booksComplete,
      booksTotal: categoryBooks.length,
    };
  });
}
