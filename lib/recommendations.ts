import {
  BOOKS,
  CATEGORIES,
  type BibleBook,
  type BookCategory,
} from "./bible-books";
import { getProgress, type ReadingProgress } from "./progress";

export type RecommendationType =
  | "momentum"
  | "affinity"
  | "discovery"
  | "completion"
  | "start-here";

export interface Recommendation {
  type: RecommendationType;
  book: BibleBook;
  chapter: number;
  reason: string;
  priority: number;
}

const CATEGORY_AFFINITY: Record<BookCategory, BookCategory[]> = {
  Law: ["History"],
  History: ["Law", "Prophets"],
  Wisdom: ["Poetry"],
  Poetry: ["Wisdom"],
  Prophets: ["History"],
  "Gospels & Acts": ["Letters"],
  Letters: ["Gospels & Acts", "Revelation"],
  Revelation: ["Letters"],
};

const STARTER_BOOKS: Record<BookCategory, { usfm: string; pitch: string }> = {
  Law: { usfm: "GEN", pitch: "Where it all begins -- creation, Abraham, Joseph" },
  History: { usfm: "RUT", pitch: "A short, beautiful story of loyalty and redemption" },
  Wisdom: { usfm: "PRO", pitch: "Timeless practical wisdom for everyday life" },
  Poetry: { usfm: "PSA", pitch: "Prayers, songs, and honest conversations with God" },
  Prophets: { usfm: "JON", pitch: "A short adventure about second chances" },
  "Gospels & Acts": { usfm: "JHN", pitch: "The life of Jesus, written for everyone" },
  Letters: { usfm: "PHP", pitch: "A short, joyful letter about finding peace" },
  Revelation: { usfm: "REV", pitch: "A vivid vision of hope and ultimate victory" },
};

const BADGE_NAMES: Record<BookCategory, string> = {
  Law: "Law Scholar",
  History: "Historian",
  Wisdom: "Wisdom Seeker",
  Poetry: "Poet at Heart",
  Prophets: "Prophet's Voice",
  "Gospels & Acts": "Gospel Bearer",
  Letters: "Letter Carrier",
  Revelation: "Revelation Complete",
};

const NEW_USER_PICKS: { usfm: string; pitch: string }[] = [
  { usfm: "JHN", pitch: "The life of Jesus, written for everyone" },
  { usfm: "PSA", pitch: "Prayers, songs, and honest conversations with God" },
  { usfm: "GEN", pitch: "Where it all begins -- creation, Abraham, Joseph" },
  { usfm: "PHP", pitch: "A short, joyful letter about finding peace" },
];

interface BookStat {
  book: BibleBook;
  read: number;
  total: number;
  percentage: number;
  nextChapter: number;
  complete: boolean;
}

function analyzeProgress(progress: ReadingProgress): BookStat[] {
  return BOOKS.map((book) => {
    const bits = progress[book.usfm];
    const read = bits ? bits.filter((b) => b === 1).length : 0;
    const nextIdx = bits ? bits.indexOf(0) : 0;
    return {
      book,
      read,
      total: book.chapters,
      percentage: book.chapters > 0 ? Math.round((read / book.chapters) * 100) : 0,
      nextChapter: nextIdx === -1 ? book.chapters : nextIdx + 1,
      complete: read === book.chapters,
    };
  });
}

function momentumPicks(stats: BookStat[]): Recommendation[] {
  const inProgress = stats.filter((s) => s.read > 0 && !s.complete);
  const sorted = [...inProgress].sort((a, b) => {
    const aScore = a.percentage * 2 + (a.read / a.total) * 100;
    const bScore = b.percentage * 2 + (b.read / b.total) * 100;
    return bScore - aScore;
  });

  return sorted.slice(0, 2).map((s, i) => {
    const remaining = s.total - s.read;
    const reason =
      remaining <= 3
        ? `${remaining} chapter${remaining === 1 ? "" : "s"} left`
        : `You're ${s.percentage}% through`;
    return {
      type: "momentum" as const,
      book: s.book,
      chapter: s.nextChapter,
      reason,
      priority: 100 - i,
    };
  });
}

function affinityPicks(
  stats: BookStat[],
  usedUsfms: Set<string>,
): Recommendation[] {
  const categoryRead = new Map<BookCategory, number>();
  for (const cat of CATEGORIES) categoryRead.set(cat, 0);
  for (const s of stats) {
    categoryRead.set(s.book.category, categoryRead.get(s.book.category)! + s.read);
  }

  const sortedCategories = [...categoryRead.entries()]
    .filter(([, read]) => read > 0)
    .sort((a, b) => b[1] - a[1]);

  for (const [topCat] of sortedCategories) {
    const relatedCategories = CATEGORY_AFFINITY[topCat];
    for (const related of relatedCategories) {
      const candidates = stats.filter(
        (s) =>
          s.book.category === related &&
          !s.complete &&
          !usedUsfms.has(s.book.usfm),
      );
      const unstarted = candidates.filter((s) => s.read === 0);
      const pick = unstarted.length > 0
        ? unstarted.sort((a, b) => a.total - b.total)[0]
        : candidates.sort((a, b) => b.percentage - a.percentage)[0];

      if (pick) {
        return [
          {
            type: "affinity" as const,
            book: pick.book,
            chapter: pick.nextChapter,
            reason: `You enjoy ${topCat} \u2014 try ${related}`,
            priority: 80,
          },
        ];
      }
    }
  }

  return [];
}

function discoveryPicks(
  stats: BookStat[],
  usedUsfms: Set<string>,
): Recommendation[] {
  const categoryRead = new Map<BookCategory, number>();
  for (const cat of CATEGORIES) categoryRead.set(cat, 0);
  for (const s of stats) {
    if (s.read > 0) {
      categoryRead.set(s.book.category, categoryRead.get(s.book.category)! + 1);
    }
  }

  const untouched = CATEGORIES.filter((c) => categoryRead.get(c) === 0);
  if (untouched.length === 0) return [];

  for (const cat of untouched) {
    const starter = STARTER_BOOKS[cat];
    const stat = stats.find((s) => s.book.usfm === starter.usfm);
    if (stat && !stat.complete && !usedUsfms.has(stat.book.usfm)) {
      return [
        {
          type: "discovery" as const,
          book: stat.book,
          chapter: stat.nextChapter,
          reason: `Haven't explored ${cat} yet \u2014 ${stat.book.name} is a great start (${stat.book.chapters} chapters)`,
          priority: 70,
        },
      ];
    }
  }

  return [];
}

function completionPicks(
  stats: BookStat[],
  usedUsfms: Set<string>,
): Recommendation[] {
  const results: Recommendation[] = [];

  for (const cat of CATEGORIES) {
    const catBooks = stats.filter((s) => s.book.category === cat);
    const completed = catBooks.filter((s) => s.complete).length;
    const total = catBooks.length;
    if (total === 0 || completed === total) continue;
    if (completed / total < 0.5) continue;

    const remaining = catBooks.filter(
      (s) => !s.complete && !usedUsfms.has(s.book.usfm),
    );
    if (remaining.length === 0) continue;

    const pick = remaining.sort((a, b) => b.percentage - a.percentage)[0];
    const booksLeft = total - completed;
    const badgeName = BADGE_NAMES[cat];

    results.push({
      type: "completion" as const,
      book: pick.book,
      chapter: pick.nextChapter,
      reason: `${booksLeft} book${booksLeft === 1 ? "" : "s"} to earn ${badgeName}`,
      priority: 60,
    });

    if (results.length >= 2) break;
  }

  return results;
}

function startHerePicks(): Recommendation[] {
  return NEW_USER_PICKS.map((pick, i) => {
    const book = BOOKS.find((b) => b.usfm === pick.usfm)!;
    return {
      type: "start-here" as const,
      book,
      chapter: 1,
      reason: pick.pitch,
      priority: 90 - i,
    };
  });
}

export function getRecommendations(): Recommendation[] {
  const progress = getProgress();
  const hasAnyProgress = Object.values(progress).some((bits) =>
    bits.some((b) => b === 1),
  );

  if (!hasAnyProgress) {
    return startHerePicks();
  }

  const stats = analyzeProgress(progress);
  const usedUsfms = new Set<string>();
  const all: Recommendation[] = [];

  const momentum = momentumPicks(stats);
  for (const r of momentum) usedUsfms.add(r.book.usfm);
  all.push(...momentum);

  const affinity = affinityPicks(stats, usedUsfms);
  for (const r of affinity) usedUsfms.add(r.book.usfm);
  all.push(...affinity);

  const discovery = discoveryPicks(stats, usedUsfms);
  for (const r of discovery) usedUsfms.add(r.book.usfm);
  all.push(...discovery);

  const completion = completionPicks(stats, usedUsfms);
  all.push(...completion);

  all.sort((a, b) => b.priority - a.priority);
  return all.slice(0, 6);
}
