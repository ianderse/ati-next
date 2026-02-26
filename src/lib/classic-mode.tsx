"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { useTheme } from "next-themes";

interface ClassicModeContextValue {
  isClassic: boolean;
  toggleClassic: () => void;
}

const ClassicModeContext = createContext<ClassicModeContextValue>({
  isClassic: false,
  toggleClassic: () => {},
});

const STORAGE_KEY = "ati-classic";
const THEME_BEFORE_CLASSIC_KEY = "ati-theme-before-classic";

export function ClassicModeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClassic, setIsClassic] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { setTheme } = useTheme();
  // Track whether the toggle was just clicked (not initial mount)
  const didToggleRef = useRef(false);

  // Read stored preference on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) === "true";
    if (stored) {
      setIsClassic(true);
      document.documentElement.classList.add("classic");
      setTheme("light");
    }
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply side effects after isClassic changes from toggle
  useEffect(() => {
    if (!mounted || !didToggleRef.current) return;
    didToggleRef.current = false;

    if (isClassic) {
      const currentTheme = localStorage.getItem("theme") || "system";
      localStorage.setItem(THEME_BEFORE_CLASSIC_KEY, currentTheme);
      document.documentElement.classList.add("classic");
      setTheme("light");
    } else {
      document.documentElement.classList.remove("classic");
      const restoreTheme =
        localStorage.getItem(THEME_BEFORE_CLASSIC_KEY) || "system";
      setTheme(restoreTheme);
      localStorage.removeItem(THEME_BEFORE_CLASSIC_KEY);
    }

    localStorage.setItem(STORAGE_KEY, String(isClassic));
  }, [isClassic, mounted, setTheme]);

  const toggleClassic = useCallback(() => {
    didToggleRef.current = true;
    setIsClassic((prev) => !prev);
  }, []);

  return (
    <ClassicModeContext.Provider
      value={{ isClassic: mounted ? isClassic : false, toggleClassic }}
    >
      {children}
    </ClassicModeContext.Provider>
  );
}

export function useClassicMode() {
  return useContext(ClassicModeContext);
}
