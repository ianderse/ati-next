import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tipitaka — The Pali Canon",
};

const nikayas = [
  { abbrev: "DN", name: "D\u012Bgha Nik\u0101ya", desc: "Collection of Long Discourses", href: "/tipitaka/dn" },
  { abbrev: "MN", name: "Majjhima Nik\u0101ya", desc: "Collection of Middle-Length Discourses", href: "/tipitaka/mn" },
  { abbrev: "SN", name: "Sa\u1E43yutta Nik\u0101ya", desc: "Collection of Grouped Discourses", href: "/tipitaka/sn" },
  { abbrev: "AN", name: "A\u1E45guttara Nik\u0101ya", desc: "Collection of Numerical Discourses", href: "/tipitaka/an" },
  { abbrev: "KN", name: "Khuddaka Nik\u0101ya", desc: "Collection of Little Texts", href: "/tipitaka/kn" },
  { abbrev: "Vin", name: "Vinaya Pi\u1E6Daka", desc: "The Basket of Discipline", href: "/tipitaka/vin" },
];

export default function TipitakaPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      <h1 className="font-[var(--font-ui)] text-2xl md:text-3xl font-bold tracking-tight mb-2 animate-in">
        Tipitaka
      </h1>
      <p className="text-[var(--text-secondary)] text-sm font-[var(--font-ui)] mb-10 animate-in stagger-1">
        The P&#257;li Canon &mdash; the standard collection of scriptures in the Therav&#257;da Buddhist tradition.
      </p>

      <div className="space-y-3">
        {nikayas.map((n, i) => (
          <Link
            key={n.abbrev}
            href={n.href}
            className={`card-glow flex items-center gap-4 p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] no-underline group animate-in stagger-${i + 1}`}
          >
            <span className="badge badge-accent text-sm px-3 py-1 font-bold shrink-0 w-12 justify-center">
              {n.abbrev}
            </span>
            <div>
              <span className="font-[var(--font-ui)] text-[15px] font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)]">
                {n.name}
              </span>
              <span className="block text-xs text-[var(--text-muted)] font-[var(--font-ui)] mt-0.5">
                {n.desc}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
