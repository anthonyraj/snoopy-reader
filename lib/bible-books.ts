export type BookCategory = "Law" | "History" | "Wisdom" | "Poetry" | "Prophets" | "Gospels & Acts" | "Letters" | "Revelation";

export const CATEGORIES: BookCategory[] = [
  "Law", "History", "Wisdom", "Poetry", "Prophets", "Gospels & Acts", "Letters", "Revelation",
];

export interface BibleBook {
  usfm: string;
  name: string;
  chapters: number;
  testament: "OT" | "NT";
  category: BookCategory;
}

export const BOOKS: BibleBook[] = [
  // Law
  { usfm: "GEN", name: "Genesis", chapters: 50, testament: "OT", category: "Law" },
  { usfm: "EXO", name: "Exodus", chapters: 40, testament: "OT", category: "Law" },
  { usfm: "LEV", name: "Leviticus", chapters: 27, testament: "OT", category: "Law" },
  { usfm: "NUM", name: "Numbers", chapters: 36, testament: "OT", category: "Law" },
  { usfm: "DEU", name: "Deuteronomy", chapters: 34, testament: "OT", category: "Law" },
  // History (OT)
  { usfm: "JOS", name: "Joshua", chapters: 24, testament: "OT", category: "History" },
  { usfm: "JDG", name: "Judges", chapters: 21, testament: "OT", category: "History" },
  { usfm: "RUT", name: "Ruth", chapters: 4, testament: "OT", category: "History" },
  { usfm: "1SA", name: "1 Samuel", chapters: 31, testament: "OT", category: "History" },
  { usfm: "2SA", name: "2 Samuel", chapters: 24, testament: "OT", category: "History" },
  { usfm: "1KI", name: "1 Kings", chapters: 22, testament: "OT", category: "History" },
  { usfm: "2KI", name: "2 Kings", chapters: 25, testament: "OT", category: "History" },
  { usfm: "1CH", name: "1 Chronicles", chapters: 29, testament: "OT", category: "History" },
  { usfm: "2CH", name: "2 Chronicles", chapters: 36, testament: "OT", category: "History" },
  { usfm: "EZR", name: "Ezra", chapters: 10, testament: "OT", category: "History" },
  { usfm: "NEH", name: "Nehemiah", chapters: 13, testament: "OT", category: "History" },
  { usfm: "EST", name: "Esther", chapters: 10, testament: "OT", category: "History" },
  // Wisdom
  { usfm: "JOB", name: "Job", chapters: 42, testament: "OT", category: "Wisdom" },
  { usfm: "PRO", name: "Proverbs", chapters: 31, testament: "OT", category: "Wisdom" },
  { usfm: "ECC", name: "Ecclesiastes", chapters: 12, testament: "OT", category: "Wisdom" },
  // Poetry
  { usfm: "PSA", name: "Psalms", chapters: 150, testament: "OT", category: "Poetry" },
  { usfm: "SNG", name: "Song of Solomon", chapters: 8, testament: "OT", category: "Poetry" },
  // Prophets
  { usfm: "ISA", name: "Isaiah", chapters: 66, testament: "OT", category: "Prophets" },
  { usfm: "JER", name: "Jeremiah", chapters: 52, testament: "OT", category: "Prophets" },
  { usfm: "LAM", name: "Lamentations", chapters: 5, testament: "OT", category: "Prophets" },
  { usfm: "EZK", name: "Ezekiel", chapters: 48, testament: "OT", category: "Prophets" },
  { usfm: "DAN", name: "Daniel", chapters: 12, testament: "OT", category: "Prophets" },
  { usfm: "HOS", name: "Hosea", chapters: 14, testament: "OT", category: "Prophets" },
  { usfm: "JOL", name: "Joel", chapters: 3, testament: "OT", category: "Prophets" },
  { usfm: "AMO", name: "Amos", chapters: 9, testament: "OT", category: "Prophets" },
  { usfm: "OBA", name: "Obadiah", chapters: 1, testament: "OT", category: "Prophets" },
  { usfm: "JON", name: "Jonah", chapters: 4, testament: "OT", category: "Prophets" },
  { usfm: "MIC", name: "Micah", chapters: 7, testament: "OT", category: "Prophets" },
  { usfm: "NAM", name: "Nahum", chapters: 3, testament: "OT", category: "Prophets" },
  { usfm: "HAB", name: "Habakkuk", chapters: 3, testament: "OT", category: "Prophets" },
  { usfm: "ZEP", name: "Zephaniah", chapters: 3, testament: "OT", category: "Prophets" },
  { usfm: "HAG", name: "Haggai", chapters: 2, testament: "OT", category: "Prophets" },
  { usfm: "ZEC", name: "Zechariah", chapters: 14, testament: "OT", category: "Prophets" },
  { usfm: "MAL", name: "Malachi", chapters: 4, testament: "OT", category: "Prophets" },
  // Gospels & Acts
  { usfm: "MAT", name: "Matthew", chapters: 28, testament: "NT", category: "Gospels & Acts" },
  { usfm: "MRK", name: "Mark", chapters: 16, testament: "NT", category: "Gospels & Acts" },
  { usfm: "LUK", name: "Luke", chapters: 24, testament: "NT", category: "Gospels & Acts" },
  { usfm: "JHN", name: "John", chapters: 21, testament: "NT", category: "Gospels & Acts" },
  { usfm: "ACT", name: "Acts", chapters: 28, testament: "NT", category: "Gospels & Acts" },
  // Letters
  { usfm: "ROM", name: "Romans", chapters: 16, testament: "NT", category: "Letters" },
  { usfm: "1CO", name: "1 Corinthians", chapters: 16, testament: "NT", category: "Letters" },
  { usfm: "2CO", name: "2 Corinthians", chapters: 13, testament: "NT", category: "Letters" },
  { usfm: "GAL", name: "Galatians", chapters: 6, testament: "NT", category: "Letters" },
  { usfm: "EPH", name: "Ephesians", chapters: 6, testament: "NT", category: "Letters" },
  { usfm: "PHP", name: "Philippians", chapters: 4, testament: "NT", category: "Letters" },
  { usfm: "COL", name: "Colossians", chapters: 4, testament: "NT", category: "Letters" },
  { usfm: "1TH", name: "1 Thessalonians", chapters: 5, testament: "NT", category: "Letters" },
  { usfm: "2TH", name: "2 Thessalonians", chapters: 3, testament: "NT", category: "Letters" },
  { usfm: "1TI", name: "1 Timothy", chapters: 6, testament: "NT", category: "Letters" },
  { usfm: "2TI", name: "2 Timothy", chapters: 4, testament: "NT", category: "Letters" },
  { usfm: "TIT", name: "Titus", chapters: 3, testament: "NT", category: "Letters" },
  { usfm: "PHM", name: "Philemon", chapters: 1, testament: "NT", category: "Letters" },
  { usfm: "HEB", name: "Hebrews", chapters: 13, testament: "NT", category: "Letters" },
  { usfm: "JAS", name: "James", chapters: 5, testament: "NT", category: "Letters" },
  { usfm: "1PE", name: "1 Peter", chapters: 5, testament: "NT", category: "Letters" },
  { usfm: "2PE", name: "2 Peter", chapters: 3, testament: "NT", category: "Letters" },
  { usfm: "1JN", name: "1 John", chapters: 5, testament: "NT", category: "Letters" },
  { usfm: "2JN", name: "2 John", chapters: 1, testament: "NT", category: "Letters" },
  { usfm: "3JN", name: "3 John", chapters: 1, testament: "NT", category: "Letters" },
  { usfm: "JUD", name: "Jude", chapters: 1, testament: "NT", category: "Letters" },
  // Revelation
  { usfm: "REV", name: "Revelation", chapters: 22, testament: "NT", category: "Revelation" },
];

const byName = new Map<string, BibleBook>();
const byUsfm = new Map<string, BibleBook>();

for (const book of BOOKS) {
  byName.set(book.name, book);
  byUsfm.set(book.usfm, book);
}

export function bookByName(name: string): BibleBook | undefined {
  return byName.get(name);
}

export function bookByUsfm(usfm: string): BibleBook | undefined {
  return byUsfm.get(usfm);
}

export const TOTAL_CHAPTERS = BOOKS.reduce((sum, b) => sum + b.chapters, 0);
