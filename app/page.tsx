"use client";

import { useSearch } from "@/app/hooks/use-search";
import { SearchForm } from "@/app/components/search-form";
import { ResultCard } from "@/app/components/result-card";
import { ResultSkeleton } from "@/app/components/result-skeleton";

const PAGE_SIZE = 20;

export default function Home() {
  const {
    query, setQuery, results, loading, loadingMore,
    error, searched, hasMore, handleSearch, sentinelRef,
  } = useSearch();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Search the Bible
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400">
          Search by meaning, not just keywords. Try concepts like{" "}
          <span className="text-zinc-700 dark:text-zinc-300">&ldquo;forgiveness&rdquo;</span>,{" "}
          <span className="text-zinc-700 dark:text-zinc-300">&ldquo;courage in hard times&rdquo;</span>, or{" "}
          <span className="text-zinc-700 dark:text-zinc-300">&ldquo;God&apos;s promises about the future&rdquo;</span>.
        </p>
      </div>

      <SearchForm
        query={query}
        onQueryChange={setQuery}
        onSubmit={handleSearch}
        loading={loading}
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      {loading && <ResultSkeleton count={8} />}

      {!loading && searched && results.length === 0 && !error && (
        <p className="text-center text-sm text-zinc-400 dark:text-zinc-500">
          No results found. Try a different phrase.
        </p>
      )}

      {!loading && results.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            {hasMore
              ? `Showing ${results.length} result${results.length !== 1 ? "s" : ""}`
              : `${results.length} result${results.length !== 1 ? "s" : ""}`}
          </p>
          <div className="flex flex-col gap-2">
            {results.map((r, index) => (
              <ResultCard key={r.id} result={r} rank={index + 1} />
            ))}
          </div>

          {loadingMore && <ResultSkeleton count={3} />}

          {hasMore && !loadingMore && <div ref={sentinelRef} className="h-10" />}

          {!hasMore && results.length > PAGE_SIZE && (
            <p className="py-4 text-center text-xs text-zinc-400 dark:text-zinc-500">
              All results loaded
            </p>
          )}
        </div>
      )}
    </div>
  );
}
