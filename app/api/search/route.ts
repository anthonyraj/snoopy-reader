import { NextRequest, NextResponse } from "next/server";
import { searchVerses } from "@/lib/search";

const MAX_QUERY_LENGTH = 500;

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Request body must be valid JSON." },
        { status: 400 }
      );
    }

    const { query, limit, offset } =
      typeof body === "object" && body !== null
        ? (body as { query?: unknown; limit?: unknown; offset?: unknown })
        : {};

    if (typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json(
        { error: "A non-empty query string is required." },
        { status: 400 }
      );
    }

    const trimmedQuery = query.trim();
    if (trimmedQuery.length > MAX_QUERY_LENGTH) {
      return NextResponse.json(
        { error: `Query must be ${MAX_QUERY_LENGTH} characters or fewer.` },
        { status: 400 }
      );
    }

    const safeLimit =
      typeof limit === "number" && Number.isFinite(limit) && limit > 0
        ? Math.min(Math.floor(limit), 50)
        : 20;

    const safeOffset =
      typeof offset === "number" && Number.isFinite(offset) && offset >= 0
        ? Math.min(Math.floor(offset), 200)
        : 0;

    const { results, hasMore } = await searchVerses(
      trimmedQuery,
      safeLimit,
      safeOffset
    );

    return NextResponse.json({ results, hasMore });
  } catch (err) {
    console.error("Search failed:", err);
    return NextResponse.json(
      { error: "Search failed. Please try again." },
      { status: 500 }
    );
  }
}
