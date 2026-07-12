"use client";

import { useState } from "react";
import { ConfigProvider, theme } from "antd";

export type ThemeMode = "light" | "dark";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
};

export function ThemeProvider({ children, defaultMode = "light" }: ThemeProviderProps) {
  const [mode] = useState<ThemeMode>(defaultMode);

  return (
    <ConfigProvider
      theme={{
        algorithm: mode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      {children}
    </ConfigProvider>
  );
}
