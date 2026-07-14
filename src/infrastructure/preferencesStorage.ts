import { z } from "zod";
import { readLocalStorageValue, writeLocalStorageValue } from "./localStorage";

const PREFERENCES_KEY = "flashtap:v1:preferences";

const preferencesSchema = z.object({
  themeMode: z.enum(["light", "dark"]).nullable(),
});

export type StoredPreferences = z.infer<typeof preferencesSchema>;

const FALLBACK: StoredPreferences = { themeMode: null };

export function readPreferences(): StoredPreferences {
  return readLocalStorageValue(PREFERENCES_KEY, preferencesSchema, FALLBACK);
}

export function writePreferences(preferences: StoredPreferences): void {
  writeLocalStorageValue(PREFERENCES_KEY, preferences);
}
