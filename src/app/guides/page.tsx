import Link from "next/link";
import { getDocumentsBySection } from "@/lib/content/loader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Path to Freedom - Encyclopedic Guides",
};

export default function GuidesPage() {
  const guides = getDocumentsBySection("guides");

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-sans text-3xl font-bold mb-2">Path to Freedom</h1>
      <p className="text-[var(--muted)] mb-8">
        A comprehensive study guide organized by topic.
      </p>

      <div className="grid gap-4">
        <Link
          href="/guides/buddha"
          className="p-4 rounded-lg border border-[var(--border)] hover:border-[var(--link)] no-underline transition-colors"
        >
          <h2 className="font-sans font-semibold text-[var(--foreground)]">
            Buddha
          </h2>
          <p className="text-sm text-[var(--muted)]">The Awakened One</p>
        </Link>
        <Link
          href="/guides/dhamma"
          className="p-4 rounded-lg border border-[var(--border)] hover:border-[var(--link)] no-underline transition-colors"
        >
          <h2 className="font-sans font-semibold text-[var(--foreground)]">
            Dhamma
          </h2>
          <p className="text-sm text-[var(--muted)]">
            The Teaching: Four Noble Truths, Eightfold Path, and more
          </p>
        </Link>
        <Link
          href="/guides/sangha"
          className="p-4 rounded-lg border border-[var(--border)] hover:border-[var(--link)] no-underline transition-colors"
        >
          <h2 className="font-sans font-semibold text-[var(--foreground)]">
            Sangha
          </h2>
          <p className="text-sm text-[var(--muted)]">The Community of Noble Disciples</p>
        </Link>
      </div>

      {guides.length > 0 && (
        <div className="mt-8">
          <h2 className="font-sans text-xl font-semibold mb-4">All Guides</h2>
          <div className="space-y-2">
            {guides
              .sort((a, b) => a.title.localeCompare(b.title))
              .map((d) => (
                <div key={d.slug}>
                  <Link href={d.urlPath}>{d.title}</Link>
                  {d.subtitle && (
                    <span className="text-[var(--muted)]">: {d.subtitle}</span>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
