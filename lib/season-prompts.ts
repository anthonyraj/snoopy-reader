import { getSeasonById, type Season, type SeasonReading } from "./seasons";
import { getProgress, type ReadingProgress } from "./progress";
import { bookByUsfm } from "./bible-books";
import {
  getProfile,
  addSavedPrompt,
  type UserProfile,
  type SavedPrompt,
} from "./user-profile";

export interface SeasonReadingItem {
  usfm: string;
  bookName: string;
  chapter: number;
  title: string;
  prompt: string;
  completed: boolean;
}

export interface GeneratedPrompt {
  seasonId: string;
  seasonName: string;
  seasonDescription: string;
  readings: SeasonReadingItem[];
  completedCount: number;
  totalCount: number;
}

function isChapterDone(progress: ReadingProgress, usfm: string, chapter: number): boolean {
  const bits = progress[usfm];
  if (!bits) return false;
  return bits[chapter - 1] === 1;
}

/**
 * Generates a curated reading prompt based on the user's current season,
 * their reading progress, and their weekly chapter goal.
 *
 * Prioritizes unread chapters, but includes completed ones so the user
 * can see full progress. The list is capped to roughly match the weekly goal
 * for the "up next" feel, while still returning all season readings for
 * the full view.
 */
export function generateSeasonPrompt(): GeneratedPrompt | null {
  const profile = getProfile();
  const season = getSeasonById(profile.currentSeasonId);
  if (!season) return null;

  const progress = getProgress();

  const readings: SeasonReadingItem[] = season.readings.map((r) => {
    const book = bookByUsfm(r.usfm);
    return {
      usfm: r.usfm,
      bookName: book?.name ?? r.usfm,
      chapter: r.chapter,
      title: r.title,
      prompt: r.prompt,
      completed: isChapterDone(progress, r.usfm, r.chapter),
    };
  });

  const completedCount = readings.filter((r) => r.completed).length;

  return {
    seasonId: season.id,
    seasonName: season.name,
    seasonDescription: season.description,
    readings,
    completedCount,
    totalCount: readings.length,
  };
}

/**
 * Returns just the unread readings from the current season,
 * capped to the user's weekly chapter goal. This is the "focus list."
 */
export function getUpNextReadings(): SeasonReadingItem[] {
  const prompt = generateSeasonPrompt();
  if (!prompt) return [];

  const profile = getProfile();
  const unread = prompt.readings.filter((r) => !r.completed);
  return unread.slice(0, profile.readingGoal.chaptersPerWeek);
}

/**
 * Saves the current season prompt to the user's profile so they can
 * look back on it later.
 */
export function saveCurrentPrompt(): SavedPrompt {
  const prompt = generateSeasonPrompt();
  const profile = getProfile();

  const saved: SavedPrompt = {
    id: `${profile.currentSeasonId}-${Date.now()}`,
    seasonId: profile.currentSeasonId,
    generatedAt: new Date().toISOString(),
    readings: (prompt?.readings ?? []).map((r) => ({
      usfm: r.usfm,
      chapter: r.chapter,
      prompt: r.prompt,
    })),
  };

  addSavedPrompt(saved);
  return saved;
}
