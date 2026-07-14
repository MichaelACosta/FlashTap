"use client";

import { createContext, useContext } from "react";

export type ThemeMode = "light" | "dark";

export type ThemeModeContextValue = {
  mode: ThemeMode;
  toggleMode: () => void;
};

export const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

export function useThemeMode(): ThemeModeContextValue {
  const context = useContext(ThemeModeContext);
  if (context === null) {
    throw new Error("useThemeMode must be used within a ThemeProvider");
  }
  return context;
}
