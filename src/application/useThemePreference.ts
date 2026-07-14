import { useCallback, useSyncExternalStore } from "react";
import { readPreferences, writePreferences } from "@/infrastructure";

const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function notifyListeners(): void {
  listeners.forEach((listener) => listener());
}

function getSnapshot(): "light" | "dark" | null {
  return readPreferences().themeMode;
}

function getServerSnapshot(): "light" | "dark" | null {
  return null;
}

export type UseThemePreferenceResult = {
  themeModePreference: "light" | "dark" | null;
  setThemeModePreference: (mode: "light" | "dark") => void;
};

// US-20: preferência manual de tema, persistida em flashtap:v1:preferences
// (ADR-008), com prioridade sobre prefers-color-scheme (ADR-012).
export function useThemePreference(): UseThemePreferenceResult {
  const themeModePreference = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setThemeModePreference = useCallback((mode: "light" | "dark") => {
    writePreferences({ themeMode: mode });
    notifyListeners();
  }, []);

  return { themeModePreference, setThemeModePreference };
}
