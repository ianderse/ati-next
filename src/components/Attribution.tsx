import type { ATIDocument } from "@/lib/content/types";

const licenseLabels: Record<string, string> = {
  "CC-BY-NC": "CC BY-NC 4.0",
  "CC-BY": "CC BY 4.0",
  PUBLIC_DOMAIN: "Public Domain",
  FREEWARE: "Freeware",
  "\u00A9": "All Rights Reserved",
  UNKNOWN: "See original for details",
};

const licenseFullNames: Record<string, string> = {
  "CC-BY-NC": "Creative Commons Attribution-NonCommercial 4.0 International",
  "CC-BY": "Creative Commons Attribution 4.0 International",
};

const licenseUrls: Record<string, string> = {
  "CC-BY-NC": "https://creativecommons.org/licenses/by-nc/4.0/",
  "CC-BY": "https://creativecommons.org/licenses/by/4.0/",
};

export function Attribution({ doc }: { doc: ATIDocument }) {
  const licenseLabel = licenseLabels[doc.license] || doc.license;
  const licenseUrl = licenseUrls[doc.license];

  return (
    <aside className="mt-14 pt-8 border-t border-[var(--border-subtle)] font-[var(--font-ui)]">
      <div className="flex flex-col gap-4 text-xs text-[var(--text-muted)] leading-relaxed">
        {/* Copyright + License row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {doc.copyrightOwner && (
            <span>
              &copy; {doc.copyrightYear && `${doc.copyrightYear} `}
              {doc.copyrightOwner}
            </span>
          )}
          {licenseUrl ? (
            <a
              href={licenseUrl}
              target="_blank"
              rel="noopener noreferrer license"
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[var(--accent-surface)] text-[var(--accent)] hover:underline"
              title={licenseFullNames[doc.license] || ""}
            >
              <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="8" cy="8" r="6.5" />
                <path d="M6 8.5a2 2 0 013.46-1.37" />
              </svg>
              {licenseLabel}
            </a>
          ) : (
            <span className="px-2 py-0.5 rounded bg-[var(--bg-inset)]">
              {licenseLabel}
            </span>
          )}
        </div>

        {/* Source */}
        {doc.source && (
          <p className="text-[11px]">
            <span className="text-[var(--text-muted)]">Source:</span>{" "}
            {doc.source}
          </p>
        )}

        {/* Editor&rsquo;s note */}
        {doc.editorsNote && (
          <div className="p-3 rounded-lg bg-[var(--bg-inset)] text-[11px] leading-relaxed border border-[var(--border-subtle)]">
            <strong className="text-[var(--text-secondary)]">Editor&apos;s note:</strong>{" "}
            <span dangerouslySetInnerHTML={{ __html: doc.editorsNote }} />
          </div>
        )}

        {/* Provenance */}
        <p className="text-[11px] text-[var(--text-muted)]">
          Originally published at Access to Insight. For free distribution only.
        </p>
      </div>
    </aside>
  );
}
