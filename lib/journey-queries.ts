import { BOOKS, CATEGORIES, bookByUsfm, type BookCategory } from "./bible-books";
import { getReadingLog, type ReadingEvent } from "./journey";
import { getProgress } from "./progress";
import { getCompletedBooks, getCategoryProgress } from "./progress-queries";

// ── helpers ────────────────────────────────────────────────────

function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function dayKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const MS_PER_DAY = 86_400_000;

// ── streaks ────────────────────────────────────────────────────

export interface StreakInfo {
  current: number;
  longest: number;
}

export function getReadingStreak(): StreakInfo {
  const log = getReadingLog();
  if (log.length === 0) return { current: 0, longest: 0 };

  const uniqueDays = [...new Set(log.map((e) => dayKey(e.ts)))].sort();
  if (uniqueDays.length === 0) return { current: 0, longest: 0 };

  let longest = 1;
  let run = 1;

  for (let i = 1; i < uniqueDays.length; i++) {
    const prev = new Date(uniqueDays[i - 1]).getTime();
    const curr = new Date(uniqueDays[i]).getTime();
    if (curr - prev === MS_PER_DAY) {
      run++;
      if (run > longest) longest = run;
    } else {
      run = 1;
    }
  }

  const todayStr = dayKey(Date.now());
  const yesterdayStr = dayKey(Date.now() - MS_PER_DAY);
  const lastDay = uniqueDays[uniqueDays.length - 1];

  let current = 0;
  if (lastDay === todayStr || lastDay === yesterdayStr) {
    current = 1;
    for (let i = uniqueDays.length - 2; i >= 0; i--) {
      const prev = new Date(uniqueDays[i]).getTime();
      const curr = new Date(uniqueDays[i + 1]).getTime();
      if (curr - prev === MS_PER_DAY) {
        current++;
      } else {
        break;
      }
    }
  }

  return { current, longest };
}

// ── activity by day (heatmap) ──────────────────────────────────

export interface DayActivity {
  date: string;
  count: number;
}

export function getActivityByDay(weeks = 12): DayActivity[] {
  const log = getReadingLog();
  const totalDays = weeks * 7;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const cutoff = now.getTime() - (totalDays - 1) * MS_PER_DAY;

  const counts = new Map<string, number>();
  for (const e of log) {
    if (e.ts < cutoff) continue;
    const key = dayKey(e.ts);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const result: DayActivity[] = [];
  for (let i = 0; i < totalDays; i++) {
    const d = new Date(cutoff + i * MS_PER_DAY);
    const key = dayKey(d.getTime());
    result.push({ date: key, count: counts.get(key) ?? 0 });
  }

  return result;
}

// ── recent activity ────────────────────────────────────────────

export interface RecentEvent {
  usfm: string;
  bookName: string;
  chapter: number;
  ts: number;
}

export function getRecentActivity(limit = 10): RecentEvent[] {
  const log = getReadingLog();
  const sorted = [...log].sort((a, b) => b.ts - a.ts);
  const result: RecentEvent[] = [];

  for (const e of sorted) {
    if (result.length >= limit) break;
    const book = bookByUsfm(e.usfm);
    if (!book) continue;
    result.push({
      usfm: e.usfm,
      bookName: book.name,
      chapter: e.chapter,
      ts: e.ts,
    });
  }

  return result;
}

// ── milestones ─────────────────────────────────────────────────

export interface Milestone {
  id: string;
  title: string;
  description: string;
  earned: boolean;
}

export function getMilestones(): Milestone[] {
  const progress = getProgress();
  const log = getReadingLog();

  let totalRead = 0;
  for (const book of BOOKS) {
    const bits = progress[book.usfm];
    if (bits) totalRead += bits.filter((b) => b === 1).length;
  }

  const completedBooks = getCompletedBooks();
  const completedNames = new Set(completedBooks.map((b) => b.usfm));

  const categoryProgress = getCategoryProgress();
  const categoriesStarted = categoryProgress.filter((c) => c.read > 0).length;
  const categoriesComplete = categoryProgress.filter(
    (c) => c.read === c.total && c.total > 0,
  ).length;

  const otDone = categoryProgress
    .filter((c) => ["Law", "History", "Wisdom", "Poetry", "Prophets"].includes(c.category))
    .every((c) => c.read === c.total && c.total > 0);
  const ntDone = categoryProgress
    .filter((c) => ["Gospels & Acts", "Letters", "Revelation"].includes(c.category))
    .every((c) => c.read === c.total && c.total > 0);

  const gospelUsfms = ["MAT", "MRK", "LUK", "JHN"];
  const allGospelsRead = gospelUsfms.every((u) => completedNames.has(u));

  return [
    {
      id: "first-chapter",
      title: "First Step",
      description: "Read your first chapter",
      earned: totalRead >= 1,
    },
    {
      id: "first-book",
      title: "Cover to Cover",
      description: "Complete your first book",
      earned: completedBooks.length >= 1,
    },
    {
      id: "3-categories",
      title: "Explorer",
      description: "Read from 3 or more categories",
      earned: categoriesStarted >= 3,
    },
    {
      id: "50-chapters",
      title: "Committed Reader",
      description: "Read 50 chapters",
      earned: totalRead >= 50,
    },
    {
      id: "100-chapters",
      title: "Century Mark",
      description: "Read 100 chapters",
      earned: totalRead >= 100,
    },
    {
      id: "250-chapters",
      title: "Devoted Scholar",
      description: "Read 250 chapters",
      earned: totalRead >= 250,
    },
    {
      id: "500-chapters",
      title: "Half the Journey",
      description: "Read 500 chapters",
      earned: totalRead >= 500,
    },
    {
      id: "all-gospels",
      title: "Gospel Truth",
      description: "Complete all four Gospels",
      earned: allGospelsRead,
    },
    {
      id: "ot-complete",
      title: "Ancient Wisdom",
      description: "Complete the Old Testament",
      earned: otDone,
    },
    {
      id: "nt-complete",
      title: "New Covenant",
      description: "Complete the New Testament",
      earned: ntDone,
    },
    {
      id: "entire-bible",
      title: "The Whole Story",
      description: "Read every chapter of the Bible",
      earned: totalRead === 1189,
    },
  ];
}

// ── reading diversity ──────────────────────────────────────────

export interface DiversityStat {
  category: BookCategory;
  read: number;
  total: number;
  percentage: number;
}

export function getReadingDiversity(): DiversityStat[] {
  const progress = getProgress();

  return CATEGORIES.map((category) => {
    const categoryBooks = BOOKS.filter((b) => b.category === category);
    let read = 0;
    let total = 0;
    for (const book of categoryBooks) {
      total += book.chapters;
      const bits = progress[book.usfm];
      if (bits) read += bits.filter((b) => b === 1).length;
    }
    return {
      category,
      read,
      total,
      percentage: total > 0 ? Math.round((read / total) * 100) : 0,
    };
  });
}

// ── weekly pace ────────────────────────────────────────────────

export interface WeekPace {
  weekLabel: string;
  count: number;
}

export function getWeeklyPace(weeks = 8): WeekPace[] {
  const log = getReadingLog();
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const dayOfWeek = now.getDay();
  const weekStart = new Date(now.getTime() - dayOfWeek * MS_PER_DAY);

  const result: WeekPace[] = [];

  for (let w = weeks - 1; w >= 0; w--) {
    const start = new Date(weekStart.getTime() - w * 7 * MS_PER_DAY);
    const end = new Date(start.getTime() + 7 * MS_PER_DAY);
    const count = log.filter((e) => e.ts >= start.getTime() && e.ts < end.getTime()).length;

    const month = start.toLocaleString("default", { month: "short" });
    const day = start.getDate();
    result.push({ weekLabel: `${month} ${day}`, count });
  }

  return result;
}
