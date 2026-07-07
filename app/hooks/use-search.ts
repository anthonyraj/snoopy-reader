import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useInView } from "react-intersection-observer";
import type { VerseResult } from "@/lib/search";

interface SearchCache {
  query: string;
  results: VerseResult[];
  hasMore: boolean;
  offset: number;
}

const SEARCH_CACHE_KEY = "verse-search";

function cacheSearch(data: SearchCache) {
  try {
    sessionStorage.setItem(SEARCH_CACHE_KEY, JSON.stringify(data));
  } catch { /* quota exceeded or SSR — ignore */ }
}

function restoreSearch(): SearchCache | null {
  try {
    const raw = sessionStorage.getItem(SEARCH_CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

export interface UseSearchReturn {
  query: string;
  setQuery: (q: string) => void;
  results: VerseResult[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  searched: boolean;
  hasMore: boolean;
  handleSearch: (e: FormEvent) => void;
  sentinelRef: (node?: Element | null) => void;
}

export function useSearch(): UseSearchReturn {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<VerseResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const requestIdRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const loadMoreControllerRef = useRef<AbortController | null>(null);
  const currentQueryRef = useRef("");

  const { ref: sentinelRef, inView } = useInView({
    threshold: 0,
    rootMargin: "200px",
  });

  useEffect(() => {
    const cached = restoreSearch();
    if (cached) {
      setQuery(cached.query);
      setResults(cached.results);
      setSearched(true);
      setHasMore(cached.hasMore);
      setOffset(cached.offset);
      currentQueryRef.current = cached.query;
    }
    return () => {
      abortControllerRef.current?.abort();
      loadMoreControllerRef.current?.abort();
    };
  }, []);

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setResults([]);
    setSearched(true);
    setHasMore(false);
    setOffset(0);
    abortControllerRef.current?.abort();
    loadMoreControllerRef.current?.abort();

    const requestId = ++requestIdRef.current;
    const controller = new AbortController();
    abortControllerRef.current = controller;
    currentQueryRef.current = trimmed;

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Request failed (${res.status})`);
      }

      const data = await res.json();
      if (requestId !== requestIdRef.current) return;

      setResults(data.results);
      setHasMore(data.hasMore);
      const nextOffset = data.results.length;
      setOffset(nextOffset);
      cacheSearch({ query: trimmed, results: data.results, hasMore: data.hasMore, offset: nextOffset });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    loadMoreControllerRef.current?.abort();
    const controller = new AbortController();
    loadMoreControllerRef.current = controller;

    const currentQuery = currentQueryRef.current;

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: currentQuery, offset }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Request failed (${res.status})`);
      }

      const data = await res.json();
      if (currentQuery !== currentQueryRef.current) return;

      setResults((prev) => {
        const updated = [...prev, ...data.results];
        const nextOffset = offset + data.results.length;
        setHasMore(data.hasMore);
        setOffset(nextOffset);
        cacheSearch({ query: currentQuery, results: updated, hasMore: data.hasMore, offset: nextOffset });
        return updated;
      });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, offset]);

  useEffect(() => {
    if (inView && hasMore && !loadingMore && !loading) {
      loadMore();
    }
  }, [inView, hasMore, loadingMore, loading, loadMore]);

  return {
    query,
    setQuery,
    results,
    loading,
    loadingMore,
    error,
    searched,
    hasMore,
    handleSearch,
    sentinelRef,
  };
}
