import Link from "next/link";
import type { Breadcrumb } from "@/lib/content/types";

export function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="font-[var(--font-ui)] text-xs text-[var(--text-muted)] mb-8">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((crumb, i) => (
          <li key={crumb.href} className="flex items-center gap-1.5">
            {i > 0 && (
              <svg viewBox="0 0 8 12" className="w-2 h-3 opacity-30" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 2l4 4-4 4" />
              </svg>
            )}
            {i === items.length - 1 ? (
              <span className="text-[var(--text-secondary)]">{crumb.label}</span>
            ) : (
              <Link
                href={crumb.href}
                className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
