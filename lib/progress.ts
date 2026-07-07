import { bookByName, bookByUsfm, BOOKS, TOTAL_CHAPTERS } from "./bible-books";
import { addReadingEvent, removeReadingEvent } from "./journey";

export type ReadingProgress = Record<string, number[]>;

const STORAGE_KEY = "verse-reading-progress";

export function getProgress(): ReadingProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveProgress(progress: ReadingProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch { /* quota exceeded — ignore */ }
}

function ensureBook(progress: ReadingProgress, usfm: string): number[] {
  if (!progress[usfm]) {
    const book = bookByUsfm(usfm);
    if (!book) return [];
    progress[usfm] = new Array(book.chapters).fill(0);
  }
  return progress[usfm];
}

export function setChapterRead(usfm: string, chapter: number, read: boolean): void {
  const progress = getProgress();
  const bits = ensureBook(progress, usfm);
  const idx = chapter - 1;
  if (idx < 0 || idx >= bits.length) return;
  bits[idx] = read ? 1 : 0;
  progress[usfm] = bits;
  saveProgress(progress);

  if (read) {
    addReadingEvent(usfm, chapter);
  } else {
    removeReadingEvent(usfm, chapter);
  }
}

export function isChapterRead(usfm: string, chapter: number): boolean {
  const progress = getProgress();
  const bits = progress[usfm];
  if (!bits) return false;
  return bits[chapter - 1] === 1;
}

export function isChapterReadByName(bookName: string, chapter: number): boolean {
  const book = bookByName(bookName);
  if (!book) return false;
  return isChapterRead(book.usfm, chapter);
}

export function setChapterReadByName(bookName: string, chapter: number, read: boolean): void {
  const book = bookByName(bookName);
  if (!book) return;
  setChapterRead(book.usfm, chapter, read);
}

export function getBookStats(usfm: string): { read: number; total: number } {
  const book = bookByUsfm(usfm);
  if (!book) return { read: 0, total: 0 };
  const progress = getProgress();
  const bits = progress[usfm];
  const read = bits ? bits.filter((b) => b === 1).length : 0;
  return { read, total: book.chapters };
}

export function getOverallStats(): { read: number; total: number } {
  const progress = getProgress();
  let read = 0;
  for (const book of BOOKS) {
    const bits = progress[book.usfm];
    if (bits) {
      read += bits.filter((b) => b === 1).length;
    }
  }
  return { read, total: TOTAL_CHAPTERS };
}
