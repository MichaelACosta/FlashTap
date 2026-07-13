import type { ZodType } from "zod";

/**
 * Reads and validates a JSON value from localStorage. Never throws: SSR (no
 * window), missing key, corrupted JSON, and schema mismatches (old/incompatible
 * version) all resolve to `fallback` (ADR-008).
 */
export function readLocalStorageValue<T>(key: string, schema: ZodType<T>, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;

    const parsed = schema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Writes a JSON-serializable value to localStorage. Never throws: SSR, quota
 * exceeded, and privacy-mode storage errors are silently swallowed (ADR-008).
 */
export function writeLocalStorageValue<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota exceeded / Safari private mode / disabled storage — degrade gracefully.
  }
}
