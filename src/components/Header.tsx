"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  {
    label: "Tipitaka",
    href: "/tipitaka",
    children: [
      { label: "Vinaya Pitaka", href: "/tipitaka/vin" },
      { label: "Digha Nikaya", href: "/tipitaka/dn" },
      { label: "Majjhima Nikaya", href: "/tipitaka/mn" },
      { label: "Samyutta Nikaya", href: "/tipitaka/sn" },
      { label: "Anguttara Nikaya", href: "/tipitaka/an" },
      { label: "Khuddaka Nikaya", href: "/tipitaka/kn" },
    ],
  },
  { label: "Authors", href: "/authors" },
  { label: "Guides", href: "/guides" },
  { label: "Indexes", href: "/indexes/sutta" },
  { label: "Glossary", href: "/glossary" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--nav-bg)] backdrop-blur-xl border-b border-[var(--nav-border)] shadow-[0_1px_3px_rgba(var(--shadow-color)/0.06)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 no-underline group"
          >
            {/* Dhamma wheel icon */}
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 text-[var(--gold)] transition-transform duration-300 group-hover:rotate-45"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="2.5" />
              <path d="M12 3v6.5M12 14.5V21M3 12h6.5M14.5 12H21M5.64 5.64l4.6 4.6M13.76 13.76l4.6 4.6M5.64 18.36l4.6-4.6M13.76 10.24l4.6-4.6" />
            </svg>
            <span className="font-[var(--font-ui)] font-semibold text-[17px] tracking-tight text-[var(--text-primary)]">
              Access to Insight
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5 font-[var(--font-ui)] text-[15px] font-medium">
            {navItems.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <Link
                    href={item.href}
                    className="px-3 py-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-inset)] transition-colors"
                  >
                    {item.label}
                    <svg
                      viewBox="0 0 12 12"
                      className="inline-block w-3 h-3 ml-0.5 opacity-40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M3 5l3 3 3-3" />
                    </svg>
                  </Link>
                  {dropdownOpen && (
                    <div className="absolute top-full left-0 pt-1 z-50">
                      <div className="w-52 bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-lg shadow-lg py-1.5 backdrop-blur-xl">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-3.5 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-inset)] transition-colors text-[15px]"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-3 py-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-inset)] transition-colors"
                >
                  {item.label}
                </Link>
              )
            )}

            {/* Search link */}
            <Link
              href="/search"
              className="ml-1 p-2 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-inset)] transition-colors"
              aria-label="Search"
            >
              <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="8.5" cy="8.5" r="5.5" />
                <path d="M12.5 12.5L17 17" />
              </svg>
            </Link>

            <div className="w-px h-5 bg-[var(--border-primary)] mx-1.5" />
            <ThemeToggle />
          </nav>

          {/* Mobile controls */}
          <div className="flex items-center gap-1 md:hidden">
            <Link
              href="/search"
              className="p-2 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-inset)] transition-colors"
              aria-label="Search"
            >
              <svg viewBox="0 0 20 20" className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="8.5" cy="8.5" r="5.5" />
                <path d="M12.5 12.5L17 17" />
              </svg>
            </Link>
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-inset)] transition-colors"
              aria-label="Toggle menu"
            >
              <svg viewBox="0 0 20 20" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                {mobileOpen ? (
                  <path d="M5 5l10 10M5 15L15 5" />
                ) : (
                  <path d="M3 6h14M3 10h14M3 14h14" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="md:hidden pb-4 pt-2 font-[var(--font-ui)] text-[16px] border-t border-[var(--border-subtle)]">
            {navItems.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  className="block px-3 py-2.5 rounded-md text-[var(--text-primary)] hover:bg-[var(--bg-inset)] font-medium transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children?.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="block pl-7 py-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-inset)] transition-colors text-[15px]"
                    onClick={() => setMobileOpen(false)}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
