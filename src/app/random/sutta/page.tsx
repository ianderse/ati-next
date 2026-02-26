"use client";

import { useEffect, useState } from "react";
import suttaManifest from "@/data/manifest.json";

export default function RandomSuttaPage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const suttas = suttaManifest.documents.filter(
      (d) => d.type === "sutta"
    );
    if (suttas.length > 0) {
      const idx = Math.floor(Math.random() * suttas.length);
      window.location.replace(suttas[idx].urlPath);
    } else {
      window.location.replace("/tipitaka");
    }
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="max-w-prose mx-auto px-4 py-16 text-center font-sans">
        <p className="text-[var(--muted)]">Finding a random sutta...</p>
      </div>
    );
  }

  return null;
}
