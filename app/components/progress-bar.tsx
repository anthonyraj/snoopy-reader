export function ProgressBar({
  percentage,
  height = "h-1",
  colorClass = "bg-sky-400 dark:bg-sky-500",
}: {
  percentage: number;
  height?: string;
  colorClass?: string;
}) {
  return (
    <div className={`${height} w-full rounded-full bg-zinc-100 dark:bg-zinc-800`}>
      <div
        className={`h-full rounded-full transition-all ${colorClass}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
