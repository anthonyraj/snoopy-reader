import { BOOKS, CATEGORIES, type BookCategory } from "./bible-books";
import { getProgress, type ReadingProgress } from "./progress";

export type BadgeCategory = "milestone" | "explorer" | "completionist";

export type BadgeIcon =
  | "footprints"
  | "seedling"
  | "book-open"
  | "shield"
  | "flag"
  | "lightning"
  | "crown"
  | "compass"
  | "globe"
  | "map"
  | "spectrum"
  | "scroll"
  | "landmark"
  | "lamp"
  | "feather"
  | "megaphone"
  | "cross"
  | "mail"
  | "eye"
  | "star";

export interface BadgeDef {
  id: string;
  name: string;
  description: string;
  category: BadgeCategory;
  icon: BadgeIcon;
  color: string;
  check: (ctx: ProgressContext) => boolean;
}

export interface Badge extends Omit<BadgeDef, "check"> {
  earned: boolean;
}

interface ProgressContext {
  totalRead: number;
  booksStarted: number;
  booksCompleted: number;
  testamentsStarted: Set<string>;
  categoriesStarted: Set<BookCategory>;
  categoryCompletion: Map<BookCategory, boolean>;
}

function buildContext(progress: ReadingProgress): ProgressContext {
  let totalRead = 0;
  let booksStarted = 0;
  let booksCompleted = 0;
  const testamentsStarted = new Set<string>();
  const categoriesStarted = new Set<BookCategory>();
  const categoryChapters = new Map<BookCategory, { read: number; total: number }>();

  for (const cat of CATEGORIES) {
    categoryChapters.set(cat, { read: 0, total: 0 });
  }

  for (const book of BOOKS) {
    const bits = progress[book.usfm];
    const read = bits ? bits.filter((b) => b === 1).length : 0;
    totalRead += read;

    const entry = categoryChapters.get(book.category)!;
    entry.total += book.chapters;
    entry.read += read;

    if (read > 0) {
      booksStarted++;
      testamentsStarted.add(book.testament);
      categoriesStarted.add(book.category);
    }
    if (read === book.chapters) {
      booksCompleted++;
    }
  }

  const categoryCompletion = new Map<BookCategory, boolean>();
  for (const [cat, { read, total }] of categoryChapters) {
    categoryCompletion.set(cat, total > 0 && read === total);
  }

  return {
    totalRead,
    booksStarted,
    booksCompleted,
    testamentsStarted,
    categoriesStarted,
    categoryCompletion,
  };
}

export const BADGE_DEFINITIONS: BadgeDef[] = [
  // --- Milestone badges ---
  {
    id: "first-steps",
    name: "First Steps",
    description: "Read your first chapter",
    category: "milestone",
    icon: "footprints",
    color: "sky",
    check: (ctx) => ctx.totalRead >= 1,
  },
  {
    id: "getting-started",
    name: "Getting Started",
    description: "Read 10 chapters",
    category: "milestone",
    icon: "seedling",
    color: "emerald",
    check: (ctx) => ctx.totalRead >= 10,
  },
  {
    id: "page-turner",
    name: "Page Turner",
    description: "Read 50 chapters",
    category: "milestone",
    icon: "book-open",
    color: "violet",
    check: (ctx) => ctx.totalRead >= 50,
  },
  {
    id: "centurion",
    name: "Centurion",
    description: "Read 100 chapters",
    category: "milestone",
    icon: "shield",
    color: "amber",
    check: (ctx) => ctx.totalRead >= 100,
  },
  {
    id: "halfway-there",
    name: "Halfway There",
    description: "Read 50% of the Bible",
    category: "milestone",
    icon: "flag",
    color: "orange",
    check: (ctx) => ctx.totalRead >= 595,
  },
  {
    id: "marathon-reader",
    name: "Marathon Reader",
    description: "Read 1,000 chapters",
    category: "milestone",
    icon: "lightning",
    color: "rose",
    check: (ctx) => ctx.totalRead >= 1000,
  },
  {
    id: "completionist",
    name: "Completionist",
    description: "Read the entire Bible",
    category: "milestone",
    icon: "crown",
    color: "amber",
    check: (ctx) => ctx.totalRead >= 1189,
  },

  // --- Explorer badges ---
  {
    id: "curious-mind",
    name: "Curious Mind",
    description: "Read from 5 different books",
    category: "explorer",
    icon: "compass",
    color: "teal",
    check: (ctx) => ctx.booksStarted >= 5,
  },
  {
    id: "well-rounded",
    name: "Well-Rounded",
    description: "Read from both testaments",
    category: "explorer",
    icon: "globe",
    color: "indigo",
    check: (ctx) => ctx.testamentsStarted.size >= 2,
  },
  {
    id: "genre-hopper",
    name: "Genre Hopper",
    description: "Read from 4+ categories",
    category: "explorer",
    icon: "map",
    color: "fuchsia",
    check: (ctx) => ctx.categoriesStarted.size >= 4,
  },
  {
    id: "full-spectrum",
    name: "Full Spectrum",
    description: "Read from all 8 categories",
    category: "explorer",
    icon: "spectrum",
    color: "violet",
    check: (ctx) => ctx.categoriesStarted.size >= 8,
  },

  // --- Category completionist badges ---
  {
    id: "law-scholar",
    name: "Law Scholar",
    description: "Complete all Law books",
    category: "completionist",
    icon: "scroll",
    color: "amber",
    check: (ctx) => ctx.categoryCompletion.get("Law") === true,
  },
  {
    id: "historian",
    name: "Historian",
    description: "Complete all History books",
    category: "completionist",
    icon: "landmark",
    color: "orange",
    check: (ctx) => ctx.categoryCompletion.get("History") === true,
  },
  {
    id: "wisdom-seeker",
    name: "Wisdom Seeker",
    description: "Complete all Wisdom books",
    category: "completionist",
    icon: "lamp",
    color: "amber",
    check: (ctx) => ctx.categoryCompletion.get("Wisdom") === true,
  },
  {
    id: "poet-at-heart",
    name: "Poet at Heart",
    description: "Complete all Poetry books",
    category: "completionist",
    icon: "feather",
    color: "rose",
    check: (ctx) => ctx.categoryCompletion.get("Poetry") === true,
  },
  {
    id: "prophets-voice",
    name: "Prophet's Voice",
    description: "Complete all Prophets books",
    category: "completionist",
    icon: "megaphone",
    color: "indigo",
    check: (ctx) => ctx.categoryCompletion.get("Prophets") === true,
  },
  {
    id: "gospel-bearer",
    name: "Gospel Bearer",
    description: "Complete all Gospels & Acts",
    category: "completionist",
    icon: "cross",
    color: "sky",
    check: (ctx) => ctx.categoryCompletion.get("Gospels & Acts") === true,
  },
  {
    id: "letter-carrier",
    name: "Letter Carrier",
    description: "Complete all Letters",
    category: "completionist",
    icon: "mail",
    color: "teal",
    check: (ctx) => ctx.categoryCompletion.get("Letters") === true,
  },
  {
    id: "revelation-complete",
    name: "Revelation Complete",
    description: "Complete Revelation",
    category: "completionist",
    icon: "eye",
    color: "fuchsia",
    check: (ctx) => ctx.categoryCompletion.get("Revelation") === true,
  },
];

export function getEarnedBadges(): Badge[] {
  const progress = getProgress();
  const ctx = buildContext(progress);

  return BADGE_DEFINITIONS.map(({ check, ...def }) => ({
    ...def,
    earned: check(ctx),
  }));
}
