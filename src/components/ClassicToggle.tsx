"use client";

import { useClassicMode } from "@/lib/classic-mode";
import { useEffect, useState } from "react";

export function ClassicToggle() {
  const { isClassic, toggleClassic } = useClassicMode();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={toggleClassic}
      className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-150 cursor-pointer"
    >
      {isClassic ? "Modern view" : "Classic view"}
    </button>
  );
}
