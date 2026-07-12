"use client";

import { useEffect, useState } from "react";
import { ConfigProvider, theme } from "antd";
import { brandColors } from "./tokens";

export type ThemeMode = "light" | "dark";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
};

export function ThemeProvider({ children, defaultMode = "light" }: ThemeProviderProps) {
  const [mode] = useState<ThemeMode>(defaultMode);

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  return (
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
  );
}
