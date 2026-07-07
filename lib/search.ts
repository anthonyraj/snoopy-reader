import db from "./db";
import { embedQuery } from "./openai";

export interface VerseResult {
  id: number;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  testament: string;
  distance: number;
}

const embeddingCache = new Map<string, Float32Array>();

export async function searchVerses(
  query: string,
  limit = 20,
  offset = 0
): Promise<{ results: VerseResult[]; hasMore: boolean }> {
  let vector = embeddingCache.get(query);
  if (!vector) {
    const embedding = await embedQuery(query);
    vector = new Float32Array(embedding);
    embeddingCache.set(query, vector);
  }

  const rows = db
    .prepare(
      `
      SELECT
        v.id,
        v.book,
        v.chapter,
        v.verse,
        v.text,
        v.testament,
        vec_distance_cosine(e.embedding, ?) AS distance
      FROM verse_embeddings e
      JOIN verses v ON v.rowid = e.rowid
      ORDER BY distance
      LIMIT ? OFFSET ?
    `
    )
    .all(vector, limit + 1, offset) as VerseResult[];

  const hasMore = rows.length > limit;
  return { results: rows.slice(0, limit), hasMore };
}

export function getVerseById(id: number) {
  return db
    .prepare(
      `SELECT id, book, chapter, verse, text, testament, book_order
       FROM verses WHERE id = ?`
    )
    .get(id) as {
    id: number;
    book: string;
    chapter: number;
    verse: number;
    text: string;
    testament: string;
    book_order: number;
  } | undefined;
}

export function getChapterVerses(book: string, chapter: number) {
  return db
    .prepare(
      `SELECT id, book, chapter, verse, text, testament
       FROM verses
       WHERE book = ? AND chapter = ?
       ORDER BY verse`
    )
    .all(book, chapter) as {
    id: number;
    book: string;
    chapter: number;
    verse: number;
    text: string;
    testament: string;
  }[];
}
