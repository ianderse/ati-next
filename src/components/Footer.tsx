import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-[var(--gold-muted)]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="2.5" />
                <path d="M12 3v6.5M12 14.5V21M3 12h6.5M14.5 12H21" />
              </svg>
              <span className="font-[var(--font-ui)] font-semibold text-sm text-[var(--text-primary)]">
                Access to Insight
              </span>
            </div>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-xs">
              A digital library of suttas, articles, and books from the
              P&#257;li Canon and its commentaries.
            </p>
          </div>

          {/* Canon */}
          <div>
            <h4 className="font-[var(--font-ui)] text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">
              Canon
            </h4>
            <ul className="space-y-2 text-sm font-[var(--font-ui)]">
              <li><Link href="/tipitaka/dn" className="text-[var(--text-secondary)] hover:text-[var(--accent)]">D&#299;gha Nik&#257;ya</Link></li>
              <li><Link href="/tipitaka/mn" className="text-[var(--text-secondary)] hover:text-[var(--accent)]">Majjhima Nik&#257;ya</Link></li>
              <li><Link href="/tipitaka/sn" className="text-[var(--text-secondary)] hover:text-[var(--accent)]">Sa&#7747;yutta Nik&#257;ya</Link></li>
              <li><Link href="/tipitaka/an" className="text-[var(--text-secondary)] hover:text-[var(--accent)]">A&#7749;guttara Nik&#257;ya</Link></li>
              <li><Link href="/tipitaka/kn" className="text-[var(--text-secondary)] hover:text-[var(--accent)]">Khuddaka Nik&#257;ya</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-[var(--font-ui)] text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">
              Resources
            </h4>
            <ul className="space-y-2 text-sm font-[var(--font-ui)]">
              <li><Link href="/authors" className="text-[var(--text-secondary)] hover:text-[var(--accent)]">Authors</Link></li>
              <li><Link href="/guides" className="text-[var(--text-secondary)] hover:text-[var(--accent)]">Guides</Link></li>
              <li><Link href="/glossary" className="text-[var(--text-secondary)] hover:text-[var(--accent)]">Glossary</Link></li>
              <li><Link href="/indexes/sutta" className="text-[var(--text-secondary)] hover:text-[var(--accent)]">Indexes</Link></li>
              <li><Link href="/search" className="text-[var(--text-secondary)] hover:text-[var(--accent)]">Search</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-[var(--font-ui)] text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">
              About
            </h4>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Owned by the{" "}
              <a
                href="http://bcbsdharma.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-secondary)] hover:text-[var(--accent)]"
              >
                Barre Center for Buddhist Studies
              </a>.<br></br>
              Managed by {" "} 
              <a
                href="https://github.com/ianderse"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-secondary)] hover:text-[var(--accent)]"
              >
                Ian Andersen
              </a>
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-3 leading-relaxed">
              Originally created by John Bullitt.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--text-muted)] font-[var(--font-ui)]">
          <span>For free distribution only.</span>
          <span>
            Rebuilt with care using Next.js
          </span>
        </div>
      </div>
    </footer>
  );
}
