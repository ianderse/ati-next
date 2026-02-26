import Link from "next/link";
import { getManifest } from "@/lib/content/loader";

const sections = [
  {
    title: "Tipitaka",
    href: "/tipitaka",
    description: "The Pali Canon — suttas from the five Nikayas and the Vinaya Pitaka.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z" />
        <path d="M8 7h8M8 11h5" />
      </svg>
    ),
  },
  {
    title: "Authors",
    href: "/authors",
    description: "Works by Thanissaro Bhikkhu, Bhikkhu Bodhi, Nyanaponika Thera, and many others.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M16 3.13a4 4 0 010 7.75" />
        <path d="M21 21v-2a4 4 0 00-3-3.87" />
        <path d="M12.5 7a4 4 0 11-8 0 4 4 0 018 0zM1.5 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
      </svg>
    ),
  },
  {
    title: "Path to Freedom",
    href: "/guides",
    description: "Topical guides organized around the Buddha, Dhamma, and Sangha.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    title: "Indexes",
    href: "/indexes/sutta",
    description: "Browse by sutta name, subject, simile, proper name, number, or title.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 6h18M3 12h12M3 18h8" />
      </svg>
    ),
  },
  {
    title: "Glossary",
    href: "/glossary",
    description: "Key Pali terms and their definitions as used throughout the Canon.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
        <circle cx="12" cy="17" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Search",
    href: "/search",
    description: "Full-text search across every sutta, article, and book in the library.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ),
  },
];

export default function HomePage() {
  const manifest = getManifest();
  const suttaCount = manifest.documents.filter((d) => d.type === "sutta").length;
  const articleCount = manifest.documents.filter(
    (d) => d.type === "article" || d.type === "book"
  ).length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      {/* Hero */}
      <div className="pt-16 pb-14 md:pt-24 md:pb-20 text-center animate-in">
        {/* Decorative Dhamma wheel */}
        <div className="mb-6 flex justify-center">
          <svg
            viewBox="0 0 48 48"
            className="w-12 h-12 text-[var(--gold)]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <circle cx="24" cy="24" r="20" />
            <circle cx="24" cy="24" r="5" />
            <circle cx="24" cy="24" r="12" strokeDasharray="2 4" />
            <path d="M24 4v16M24 28v16M4 24h16M28 24h16M9.86 9.86L20.69 20.69M27.31 27.31L38.14 38.14M9.86 38.14L20.69 27.31M27.31 20.69L38.14 9.86" />
          </svg>
        </div>

        <h1 className="font-[var(--font-ui)] text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-4">
          Access to Insight
        </h1>

        <p className="text-[var(--text-secondary)] text-lg sm:text-xl font-[var(--font-body)] max-w-lg mx-auto leading-relaxed">
          Readings in Therav&#257;da Buddhism
        </p>

        <div className="mt-6 flex items-center justify-center gap-3 text-sm font-[var(--font-ui)] text-[var(--text-muted)]">
          <span>{suttaCount.toLocaleString()} suttas</span>
          <span className="text-[var(--gold)]">&bull;</span>
          <span>{articleCount.toLocaleString()} articles &amp; books</span>
        </div>
      </div>

      {/* Ornamental divider */}
      <div className="ornament mb-12 animate-in stagger-1">
        <span className="font-[var(--font-ui)] uppercase tracking-[0.2em]">Explore</span>
      </div>

      {/* Section grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
        {sections.map((s, i) => (
          <Link
            key={s.title}
            href={s.href}
            className={`card-glow block p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] no-underline group animate-in stagger-${i + 1}`}
          >
            <div className="flex items-start gap-3.5">
              <div className="mt-0.5 p-2 rounded-lg bg-[var(--accent-surface)] text-[var(--accent)] shrink-0 transition-colors group-hover:bg-[var(--accent)] group-hover:text-white">
                {s.icon}
              </div>
              <div>
                <h2 className="font-[var(--font-ui)] text-[15px] font-semibold text-[var(--text-primary)] mb-1">
                  {s.title}
                </h2>
                <p className="text-sm leading-relaxed text-[var(--text-muted)] font-[var(--font-ui)]">
                  {s.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Random discovery */}
      <div className="text-center pb-16 animate-in stagger-6">
        <p className="text-[var(--text-muted)] text-sm font-[var(--font-ui)] mb-4">
          Not sure where to start?
        </p>
        <div className="flex flex-wrap justify-center gap-3 font-[var(--font-ui)] text-sm">
          <Link
            href="/random/sutta"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--accent)] !text-white no-underline font-medium hover:opacity-90 transition-opacity shadow-[0_1px_3px_rgba(var(--shadow-color)/0.12)]"
          >
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1.5 10.5l3-3 3 3 4-7" />
              <path d="M10.5 3.5h3v3" />
            </svg>
            Random Sutta
          </Link>
          <Link
            href="/random/article"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--border-primary)] text-[var(--text-secondary)] no-underline font-medium hover:bg-[var(--bg-inset)] hover:text-[var(--text-primary)] transition-colors"
          >
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1.5 10.5l3-3 3 3 4-7" />
              <path d="M10.5 3.5h3v3" />
            </svg>
            Random Article
          </Link>
        </div>
      </div>
    </div>
  );
}
