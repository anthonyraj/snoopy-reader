# Verse Explorer

Search the Bible by meaning, not just keywords.

## Quick Start

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## How It Works

The app ships with a SQLite database containing all 31,102 KJV Bible verses and their vector embeddings (computed with OpenAI `text-embedding-3-small`). When you search, your query is embedded into the same vector space and compared against every verse using cosine similarity — so searching "courage in hard times" finds verses about perseverance, strength, and faith even if they don't contain those exact words.

```
User query → OpenAI embedding → sqlite-vec KNN search → ranked results
```

### Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [OpenAI API](https://platform.openai.com/) (embeddings + chat)
- [SQLite](https://sqlite.org/) + [sqlite-vec](https://alexgarcia.xyz/sqlite-vec/) (vector search)
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) (Node.js SQLite driver)

## Guided Path

Follow along step by step, building each feature with the Cursor agent:

- [ ] **Verse search** — Type a phrase or concept (e.g. "courage in hard times") and get a list of semantically similar verses, ranked by relevance
- [ ] **Results display** — Show each result with its book, chapter:verse reference, text preview, and similarity score
- [ ] **Verse detail view** — Click a result to see the full verse in context, with the surrounding chapter text and the selected verse highlighted
- [ ] **Filtering** — Narrow search results by testament (Old / New), book, or both
- [ ] **Tests and documentation** — Add tests for your search logic and API routes, then generate documentation for your components

## Accelerated Path

Work autonomously toward any of these larger goals.

- [ ] **AI-generated study notes** — Select a verse and get AI-generated devotional content, historical context, or study notes
- [ ] **Verse journeys** — Click a verse to find related verses, then click those to keep exploring — an endless chain of connected passages
- [ ] **Cross-reference visualization** — Show connections between books or testaments based on semantic similarity
- [ ] **Reading plan generator** — Enter a topic (e.g. "prayer", "wisdom") and generate a multi-day reading plan from the most relevant passages
- [ ] **Compare translations** — Fetch the same verse in different translations and show them side-by-side with a semantic diff
- [ ] **Server vs. client component tradeoffs** — Refactor to use React Server Components where possible and make intentional decisions about what runs on the server vs. the client
- [ ] **Prerendering and prefetching architecture** — Think deeply about which pages should be statically prerendered vs. dynamically rendered, how to use `generateStaticParams` for verse routes, and whether link prefetching strategies are optimal — are we making the right caching and data-fetching decisions for the best user experience?
- [ ] **Bring your own idea** — Apply the morning concepts (rules files, agentic workflows, semantic search) to whatever you want to ship

## Want Prebuilt Components?

Check out the [YouVersion Platform SDK for React](https://github.com/youversion/platform-sdk-react/tree/main/examples/nextjs), which includes prebuilt components for Bible content like verse references, reading plans, and more.
