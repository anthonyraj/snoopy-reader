/**
 * build-db.ts
 *
 * One-time script to build the SQLite database with verse embeddings.
 * NOT part of the workshop — students never run this.
 *
 * Usage:
 *   npx tsx scripts/build-db.ts
 *
 * Prerequisites:
 *   - data/kjv.json must exist (run the download step first)
 *   - OPENAI_API_KEY must be set in .env.local or environment
 */

import Database from "better-sqlite3";
import * as sqliteVec from "sqlite-vec";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const EMBEDDING_MODEL = "text-embedding-3-small";
const EMBEDDING_DIMENSIONS = 256;
const BATCH_SIZE = 2048; // OpenAI supports up to 2048 inputs per request
const DB_PATH = path.join(process.cwd(), "data", "verses.db");
const KJV_PATH = path.join(process.cwd(), "data", "kjv.json");

// ---------------------------------------------------------------------------
// Load environment
// ---------------------------------------------------------------------------

// Read .env.local manually (we're outside Next.js)
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim();
    }
  }
}

if (!process.env.OPENAI_API_KEY) {
  console.error("Error: OPENAI_API_KEY not found. Set it in .env.local or environment.");
  process.exit(1);
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Verse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  testament: "OT" | "NT";
  book_order: number;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("Reading KJV data...");
  const verses: Verse[] = JSON.parse(fs.readFileSync(KJV_PATH, "utf-8"));
  console.log(`Loaded ${verses.length} verses`);

  // Remove old DB if it exists
  if (fs.existsSync(DB_PATH)) {
    fs.unlinkSync(DB_PATH);
    console.log("Removed existing database");
  }

  // Create database
  console.log("Creating SQLite database...");
  const db = new Database(DB_PATH);
  sqliteVec.load(db);

  // Check sqlite-vec is loaded
  const { vec_version } = db
    .prepare("SELECT vec_version() AS vec_version")
    .get() as { vec_version: string };
  console.log(`sqlite-vec version: ${vec_version}`);

  // Create verses table
  db.exec(`
    CREATE TABLE verses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book TEXT NOT NULL,
      chapter INTEGER NOT NULL,
      verse INTEGER NOT NULL,
      text TEXT NOT NULL,
      testament TEXT NOT NULL,
      book_order INTEGER NOT NULL
    )
  `);

  // Create indexes for common queries
  db.exec(`
    CREATE INDEX idx_verses_book ON verses(book);
    CREATE INDEX idx_verses_testament ON verses(testament);
    CREATE INDEX idx_verses_book_chapter ON verses(book, chapter);
  `);

  // Insert all verses
  console.log("Inserting verses...");
  const insertVerse = db.prepare(`
    INSERT INTO verses (book, chapter, verse, text, testament, book_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((verses: Verse[]) => {
    for (const v of verses) {
      insertVerse.run(v.book, v.chapter, v.verse, v.text, v.testament, v.book_order);
    }
  });
  insertMany(verses);
  console.log(`Inserted ${verses.length} verses`);

  // Create the virtual table for embeddings
  db.exec(`
    CREATE VIRTUAL TABLE verse_embeddings USING vec0(
      embedding float[${EMBEDDING_DIMENSIONS}]
    )
  `);

  // Compute embeddings in batches
  console.log(`\nComputing embeddings (${EMBEDDING_MODEL}, ${EMBEDDING_DIMENSIONS}d)...`);
  console.log(`Batch size: ${BATCH_SIZE}, Total batches: ${Math.ceil(verses.length / BATCH_SIZE)}`);

  const insertEmbedding = db.prepare(`
    INSERT INTO verse_embeddings (rowid, embedding)
    VALUES (?, ?)
  `);

  const insertEmbeddings = db.transaction(
    (rows: { rowid: number; embedding: Float32Array }[]) => {
      for (const row of rows) {
        insertEmbedding.run(BigInt(row.rowid), row.embedding);
      }
    }
  );

  let processed = 0;
  for (let i = 0; i < verses.length; i += BATCH_SIZE) {
    const batch = verses.slice(i, i + BATCH_SIZE);
    const texts = batch.map((v) => `${v.book} ${v.chapter}:${v.verse} - ${v.text}`);

    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      dimensions: EMBEDDING_DIMENSIONS,
      input: texts,
    });

    const rows = response.data.map((item, idx) => ({
      rowid: i + idx + 1, // SQLite rowids are 1-based
      embedding: new Float32Array(item.embedding),
    }));

    insertEmbeddings(rows);

    processed += batch.length;
    const pct = ((processed / verses.length) * 100).toFixed(1);
    console.log(
      `  Batch ${Math.floor(i / BATCH_SIZE) + 1}: embedded ${processed}/${verses.length} verses (${pct}%)`
    );
  }

  // Verify
  const { count } = db
    .prepare("SELECT COUNT(*) as count FROM verse_embeddings")
    .get() as { count: number };
  console.log(`\nVerification: ${count} embeddings in database`);

  // Test a quick search
  console.log("\nTest search: 'love your neighbor'");
  const testEmbedding = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    dimensions: EMBEDDING_DIMENSIONS,
    input: "love your neighbor",
  });
  const testVec = new Float32Array(testEmbedding.data[0].embedding);

  const results = db
    .prepare(
      `
    SELECT v.book, v.chapter, v.verse, v.text,
           vec_distance_cosine(e.embedding, ?) AS distance
    FROM verse_embeddings e
    JOIN verses v ON v.rowid = e.rowid
    ORDER BY distance
    LIMIT 5
  `
    )
    .all(testVec) as {
    book: string;
    chapter: number;
    verse: number;
    text: string;
    distance: number;
  }[];

  for (const r of results) {
    console.log(
      `  ${r.book} ${r.chapter}:${r.verse} (distance: ${r.distance.toFixed(4)})`
    );
    console.log(`    ${r.text.slice(0, 100)}...`);
  }

  db.close();

  const stats = fs.statSync(DB_PATH);
  console.log(`\nDatabase size: ${(stats.size / 1024 / 1024).toFixed(1)} MB`);
  console.log("Done!");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
