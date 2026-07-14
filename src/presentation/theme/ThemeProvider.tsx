"use client";

import { useEffect } from "react";
import { ConfigProvider, theme } from "antd";
import { useThemePreference } from "@/application";
import { ThemeModeContext, type ThemeMode } from "./ThemeModeContext";
import { useSystemTheme } from "./useSystemTheme";
import { brandColors } from "./tokens";

type ThemeProviderProps = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemTheme = useSystemTheme();
  const { themeModePreference, setThemeModePreference } = useThemePreference();
  // US-20: preferência manual tem prioridade sobre o tema do sistema (US-19).
  const mode: ThemeMode = themeModePreference ?? systemTheme;

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  const toggleMode = () => {
    setThemeModePreference(mode === "dark" ? "light" : "dark");
  };

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <ConfigProvider
        theme={{
          algorithm: mode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            colorPrimary: brandColors.brand,
            fontFamily: "var(--font-inter)",
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeModeContext.Provider>
  );
}
