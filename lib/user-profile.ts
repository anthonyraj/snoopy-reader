import { getDefaultSeason } from "./seasons";

export interface ReadingGoal {
  chaptersPerWeek: number;
  note: string;
}

export interface SavedPrompt {
  id: string;
  seasonId: string;
  generatedAt: string;
  readings: { usfm: string; chapter: number; prompt: string }[];
}

export interface UserProfile {
  name?: string;
  currentSeasonId: string;
  readingGoal: ReadingGoal;
  savedPrompts: SavedPrompt[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "verse-user-profile";

function defaultProfile(): UserProfile {
  const season = getDefaultSeason();
  const now = new Date().toISOString();
  return {
    currentSeasonId: season.id,
    readingGoal: {
      chaptersPerWeek: 5,
      note: "Seeking courage and wisdom through Scripture",
    },
    savedPrompts: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function getProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initProfile();
    return JSON.parse(raw);
  } catch {
    return initProfile();
  }
}

export function saveProfile(profile: UserProfile): void {
  try {
    profile.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch { /* quota exceeded — ignore */ }
}

export function initProfile(): UserProfile {
  const profile = defaultProfile();
  saveProfile(profile);
  return profile;
}

export function addSavedPrompt(prompt: SavedPrompt): void {
  const profile = getProfile();
  profile.savedPrompts.unshift(prompt);
  saveProfile(profile);
}

export function getSavedPrompts(): SavedPrompt[] {
  return getProfile().savedPrompts;
}
