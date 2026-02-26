import Link from "next/link";
import type { ATIDocument } from "@/lib/content/types";

export function SuttaHeader({ doc }: { doc: ATIDocument }) {
  return (
    <header className="mb-10 animate-in">
      {/* Reference line: badges + PTS */}
      {(doc.nikayaAbbrev || doc.number || doc.ptsId) && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {doc.nikayaAbbrev && (
            <span className="badge badge-accent">
              {doc.nikayaAbbrev} {doc.number}
            </span>
          )}
          {!doc.nikayaAbbrev && doc.number && (
            <span className="badge">{doc.number}</span>
          )}
          {doc.ptsId && (
            <span className="font-[var(--font-ui)] text-[11px] text-[var(--text-muted)] tracking-wide">
              PTS: {doc.ptsId}
            </span>
          )}
          {doc.extent && doc.extent !== "complete" && (
            <span className="badge" style={{ background: "var(--gold-surface)", color: "var(--gold)" }}>
              {doc.extent}
            </span>
          )}
        </div>
      )}

      {/* Title */}
      <h1 className="font-[var(--font-ui)] text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-[1.15] text-[var(--text-primary)]">
        {doc.title}
      </h1>

      {/* Subtitles */}
      {doc.subtitle && (
        <p className="mt-1.5 text-lg sm:text-xl text-[var(--text-secondary)] italic leading-snug">
          {doc.subtitle}
        </p>
      )}
      {doc.subtitle2 && (
        <p className="mt-1 text-base text-[var(--text-muted)]">{doc.subtitle2}</p>
      )}

      {/* Author / translator */}
      {doc.author && (
        <p className="mt-4 font-[var(--font-ui)] text-sm text-[var(--text-muted)]">
          {doc.type === "sutta" ? "Translated from the P\u0101li by " : "By "}
          <span className="text-[var(--text-secondary)] font-medium">
            {doc.author}
          </span>
        </p>
      )}

      {/* Alternate translations */}
      {doc.altTranslations.length > 0 && (
        <div className="mt-2.5 font-[var(--font-ui)] text-xs text-[var(--text-muted)]">
          Also translated by{" "}
          {doc.altTranslations.map((alt, i) => (
            <span key={alt.path}>
              {i > 0 && ", "}
              <Link href={alt.path} className="text-[var(--accent)] hover:underline">
                {alt.translator}
              </Link>
            </span>
          ))}
        </div>
      )}

      {/* Divider */}
      <div className="mt-8 h-px bg-gradient-to-r from-[var(--gold-muted)] via-[var(--border-subtle)] to-transparent" />
    </header>
  );
}
