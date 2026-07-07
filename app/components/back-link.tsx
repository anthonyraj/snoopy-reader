import Link from "next/link";
import type { ReactNode } from "react";

export function BackLink({
  href = "/",
  children = "Back to search",
}: {
  href?: string;
  children?: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm text-zinc-400 transition-colors hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
    >
      &larr; {children}
    </Link>
  );
}
