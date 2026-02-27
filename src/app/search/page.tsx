"use client";

import { useEffect, useState } from "react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagefind, setPagefind] = useState<PagefindInstance | null>(null);

  useEffect(() => {
    async function loadPagefind() {
      try {
        // @ts-expect-error pagefind is loaded from static files
        const pf = await import(/* webpackIgnore: true */ "/pagefind/pagefind.js");
        await pf.init();
        setPagefind(pf);
      } catch {
        console.log("Pagefind not available (run postbuild first)");
      }
    }
    loadPagefind();
  }, []);

  async function handleSearch(q: string) {
    setQuery(q);
    if (!pagefind || !q.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const search = await pagefind.search(q);
      const loaded = await Promise.all(
        search.results.slice(0, 20).map((r: PagefindResult) => r.data())
      );
      setResults(loaded);
    } catch (err) {
      console.error("Search error:", err);
    }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      <h1 className="font-[var(--font-ui)] text-2xl font-bold tracking-tight mb-6 animate-in">
        Search
      </h1>

      <div className="relative animate-in stagger-1">
        <svg
          viewBox="0 0 20 20"
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="8.5" cy="8.5" r="5.5" />
          <path d="M12.5 12.5L17 17" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Suttas, articles, P&#257;li terms..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-elevated)] text-[var(--text-primary)] font-[var(--font-ui)] text-sm focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors placeholder:text-[var(--text-muted)]"
          autoFocus
        />
      </div>

      {loading && (
        <p className="mt-6 text-[var(--text-muted)] font-[var(--font-ui)] text-sm">
          Searching...
        </p>
      )}

      {!loading && results.length > 0 && (
        <div className="mt-8 space-y-1 animate-in stagger-2">
          <p className="text-xs font-[var(--font-ui)] text-[var(--text-muted)] mb-4">
            {results.length} result{results.length !== 1 && "s"}
          </p>
          {results.map((r, i) => (
            <a
              key={i}
              href={r.url.replace(/\.html$/, "")}
              className="block p-4 -mx-2 rounded-lg hover:bg-[var(--bg-inset)] transition-colors no-underline group"
            >
              <span className="font-[var(--font-ui)] text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)]">
                {r.meta?.title || r.url}
              </span>
              <span
                className="block mt-1 text-xs text-[var(--text-muted)] leading-relaxed [&_mark]:bg-[var(--accent-surface)] [&_mark]:text-[var(--accent)] [&_mark]:px-0.5 [&_mark]:rounded"
                dangerouslySetInnerHTML={{ __html: r.excerpt }}
              />
            </a>
          ))}
        </div>
      )}

      {!loading && query && results.length === 0 && (
        <p className="mt-8 text-[var(--text-muted)] font-[var(--font-ui)] text-sm">
          No results for &ldquo;{query}&rdquo;
        </p>
      )}

      {!query && (
        <div className="mt-10 animate-in stagger-2">
          <p className="text-[var(--text-muted)] font-[var(--font-ui)] text-xs leading-relaxed mb-8">
            Search across all suttas, articles, books, and guides.
            Try P&#257;li terms, sutta names, or topics.
          </p>

          <div className="mb-8">
            <h2 className="font-[var(--font-ui)] text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">
              Try searching for
            </h2>
            <div className="flex flex-wrap gap-2">
              {["mindfulness", "nibbana", "four noble truths", "metta", "dependent origination", "jhana", "anatta", "dukkha", "noble eightfold path", "kamma"].map((term) => (
                <button
                  key={term}
                  onClick={() => handleSearch(term)}
                  className="px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] font-[var(--font-ui)] text-xs hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-[var(--font-ui)] text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">
              Or browse by
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-[var(--font-ui)] text-sm">
              <a href="/tipitaka" className="p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors no-underline">
                Tipitaka
              </a>
              <a href="/indexes/sutta" className="p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors no-underline">
                Sutta Index
              </a>
              <a href="/indexes/subject" className="p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors no-underline">
                Subject Index
              </a>
              <a href="/authors" className="p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors no-underline">
                Authors
              </a>
              <a href="/glossary" className="p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors no-underline">
                Glossary
              </a>
              <a href="/guides" className="p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors no-underline">
                Guides
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface PagefindInstance {
  init: () => Promise<void>;
  search: (query: string) => Promise<{ results: PagefindResult[] }>;
}

interface PagefindResult {
  data: () => Promise<SearchResult>;
}

interface SearchResult {
  url: string;
  excerpt: string;
  meta?: {
    title?: string;
  };
}
