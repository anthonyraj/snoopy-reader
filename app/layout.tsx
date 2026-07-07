import type { Metadata } from "next";
import { Lora } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Verse Explorer",
  description: "Search the Bible by meaning, not just keywords",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lora.variable} antialiased`}
      >
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-12">
          <header className="mb-12 flex items-center justify-between">
            <Link href="/" className="group">
              <h1 className="text-sm font-medium tracking-widest text-zinc-400 uppercase transition-colors group-hover:text-zinc-800 dark:text-zinc-500 dark:group-hover:text-zinc-200">
                Verse Explorer
              </h1>
            </Link>
            <Link
              href="/progress"
              className="text-xs font-medium tracking-wide text-zinc-400 uppercase transition-colors hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-200"
            >
              Progress
            </Link>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
