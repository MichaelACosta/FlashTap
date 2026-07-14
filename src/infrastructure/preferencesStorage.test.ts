import { beforeEach, describe, expect, it, vi } from "vitest";
import { readPreferences, writePreferences } from "./preferencesStorage";

const KEY = "flashtap:v1:preferences";

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("readPreferences", () => {
  it("defaults to no manual theme override when nothing is stored", () => {
    expect(readPreferences()).toEqual({ themeMode: null });
  });

  it("returns the stored manual theme preference", () => {
    localStorage.setItem(KEY, JSON.stringify({ themeMode: "dark" }));
    expect(readPreferences()).toEqual({ themeMode: "dark" });
  });

  it("returns the fallback for corrupted non-JSON data (US-18)", () => {
    localStorage.setItem(KEY, "{not-json");
    expect(readPreferences()).toEqual({ themeMode: null });
  });

  it("returns the fallback for an invalid theme value (US-18)", () => {
    localStorage.setItem(KEY, JSON.stringify({ themeMode: "solarized" }));
    expect(readPreferences()).toEqual({ themeMode: null });
  });
});

describe("writePreferences", () => {
  it("round-trips a written preference", () => {
    writePreferences({ themeMode: "dark" });
    expect(readPreferences()).toEqual({ themeMode: "dark" });
  });

  it("does not throw when localStorage.setItem throws", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota exceeded");
    });
    expect(() => writePreferences({ themeMode: "light" })).not.toThrow();
  });
});
