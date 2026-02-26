"use client";

import { useEffect, useState } from "react";
import manifest from "@/data/manifest.json";

export default function RandomArticlePage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const articles = manifest.documents.filter(
      (d) => d.type === "article" || d.type === "book" || d.type === "excerpt"
    );
    if (articles.length > 0) {
      const idx = Math.floor(Math.random() * articles.length);
      window.location.replace(articles[idx].urlPath);
    } else {
      window.location.replace("/authors");
    }
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="max-w-prose mx-auto px-4 py-16 text-center font-sans">
        <p className="text-[var(--muted)]">Finding a random article...</p>
      </div>
    );
  }

  return null;
}
