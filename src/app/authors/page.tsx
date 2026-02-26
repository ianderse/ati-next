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
      <p style={{ color: "var(--text-muted)" }} className="text-sm font-[var(--font-ui)] mb-10 animate-in stagger-1">
        {authors.length} translators and authors
      </p>

      <div className="space-y-0.5 animate-in stagger-2">
        {authors.map((a) => (
          <div key={a.shortname} className="flex items-center justify-between px-3 py-2.5 -mx-3 rounded-lg hover:bg-[var(--bg-inset)] transition-colors">
            <Link
              href={`/authors/${a.shortname.toLowerCase()}`}
              className="font-[var(--font-ui)] text-sm font-medium !text-[#1c1917] dark:!text-[#e8e2d6] hover:!text-[var(--accent)] no-underline"
            >
              {a.name}
            </Link>
            <span className="text-xs font-[var(--font-ui)] tabular-nums" style={{ color: "var(--text-muted)" }}>
              {a.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
