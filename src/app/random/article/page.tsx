"use client";

import { useEffect } from "react";

export default function RandomArticlePage() {
  useEffect(() => {
    fetch("/article-paths.json")
      .then((r) => r.json())
      .then((paths: string[]) => {
        if (paths.length > 0) {
          const idx = Math.floor(Math.random() * paths.length);
          window.location.replace(paths[idx]);
        } else {
          window.location.replace("/authors");
        }
      })
      .catch(() => window.location.replace("/authors"));
  }, []);

  return (
    <div className="max-w-prose mx-auto px-4 py-16 text-center font-[var(--font-ui)]">
      <p className="text-[var(--text-muted)]">Finding a random article...</p>
    </div>
  );
}
