import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <p className="text-6xl font-[var(--font-ui)] font-bold text-[var(--border-primary)] mb-4">
        404
      </p>
      <h1 className="font-[var(--font-ui)] text-xl font-semibold mb-2 text-[var(--text-primary)]">
        Page not found
      </h1>
      <p className="text-sm text-[var(--text-muted)] mb-8 font-[var(--font-ui)]">
        This page may have been moved or no longer exists.
      </p>
      <div className="flex flex-wrap justify-center gap-3 font-[var(--font-ui)] text-sm">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-lg bg-[var(--accent)] text-white no-underline font-medium hover:opacity-90 transition-opacity"
        >
          Home
        </Link>
        <Link
          href="/search"
          className="px-5 py-2.5 rounded-lg border border-[var(--border-primary)] text-[var(--text-secondary)] no-underline font-medium hover:bg-[var(--bg-inset)] transition-colors"
        >
          Search
        </Link>
      </div>
    </div>
  );
}
