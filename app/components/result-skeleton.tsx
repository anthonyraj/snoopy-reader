export function ResultSkeleton({ count }: { count: number }) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-lg border border-zinc-200 p-5 dark:border-zinc-800"
          style={{ animationDelay: `${i * 75}ms` }}
        >
          <div className="mb-3 flex items-center gap-3">
            <div className="h-4 w-5 rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-4 w-28 rounded bg-zinc-200 dark:bg-zinc-700" />
          </div>
          <div className="mb-2 h-3 w-full rounded bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-3 w-2/3 rounded bg-zinc-100 dark:bg-zinc-800" />
          <div className="mt-3 h-0.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800" />
        </div>
      ))}
    </div>
  );
}
