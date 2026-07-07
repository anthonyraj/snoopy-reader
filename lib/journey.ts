export interface ReadingEvent {
  usfm: string;
  chapter: number;
  ts: number;
}

const LOG_KEY = "verse-reading-log";

export function getReadingLog(): ReadingEvent[] {
  try {
    const raw = localStorage.getItem(LOG_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveLog(log: ReadingEvent[]) {
  try {
    localStorage.setItem(LOG_KEY, JSON.stringify(log));
  } catch { /* quota exceeded — ignore */ }
}

export function addReadingEvent(usfm: string, chapter: number): void {
  const log = getReadingLog();
  log.push({ usfm, chapter, ts: Date.now() });
  saveLog(log);
}

export function removeReadingEvent(usfm: string, chapter: number): void {
  const log = getReadingLog();
  const idx = log.findLastIndex(
    (e) => e.usfm === usfm && e.chapter === chapter,
  );
  if (idx !== -1) {
    log.splice(idx, 1);
    saveLog(log);
  }
}
