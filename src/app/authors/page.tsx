import Link from "next/link";
import { getUniqueAuthors } from "@/lib/content/loader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authors",
};

export default function AuthorsPage() {
  const authors = getUniqueAuthors();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      <h1 className="font-[var(--font-ui)] text-2xl md:text-3xl font-bold tracking-tight mb-2 animate-in">
        Authors
      </h1>
      <p className="text-[var(--text-muted)] text-sm font-[var(--font-ui)] mb-10 animate-in stagger-1">
        {authors.length} translators and authors
      </p>

      <div className="space-y-1 animate-in stagger-2">
        {authors.map((a) => (
          <Link
            key={a.shortname}
            href={`/authors/${a.shortname.toLowerCase()}`}
            className="flex items-center justify-between px-3 py-2.5 -mx-3 rounded-lg hover:bg-[var(--bg-inset)] no-underline transition-colors group"
          >
            <span className="font-[var(--font-ui)] text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)]">
              {a.name}
            </span>
            <span className="text-xs text-[var(--text-muted)] font-[var(--font-ui)] tabular-nums">
              {a.count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
