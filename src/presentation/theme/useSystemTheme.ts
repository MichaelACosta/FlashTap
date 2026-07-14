"use client";

import { useEffect, useState } from "react";
import type { ThemeMode } from "./ThemeModeContext";

const QUERY = "(prefers-color-scheme: dark)";

function resolveSystemTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";
  return window.matchMedia(QUERY).matches ? "dark" : "light";
}

// US-19: detecta o tema do sistema na montagem e reage a mudanças ao vivo.
export function useSystemTheme(): ThemeMode {
  const [systemTheme, setSystemTheme] = useState<ThemeMode>(resolveSystemTheme);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(QUERY);
    const listener = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? "dark" : "light");
    };

    mediaQueryList.addEventListener("change", listener);
    return () => mediaQueryList.removeEventListener("change", listener);
  }, []);

  return systemTheme;
}
