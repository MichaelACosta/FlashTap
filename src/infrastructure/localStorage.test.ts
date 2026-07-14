import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { readLocalStorageValue, writeLocalStorageValue } from "./localStorage";

const KEY = "flashtap:v1:test-key";
const schema = z.object({ value: z.number() });
const FALLBACK = { value: 0 };

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("readLocalStorageValue (US-18)", () => {
  it("returns the fallback when the key is missing", () => {
    expect(readLocalStorageValue(KEY, schema, FALLBACK)).toEqual(FALLBACK);
  });

  it("returns the parsed value when it matches the schema", () => {
    localStorage.setItem(KEY, JSON.stringify({ value: 42 }));
    expect(readLocalStorageValue(KEY, schema, FALLBACK)).toEqual({ value: 42 });
  });

  it("returns the fallback for malformed (non-JSON) data, never throwing", () => {
    localStorage.setItem(KEY, "{not-valid-json");
    expect(() => readLocalStorageValue(KEY, schema, FALLBACK)).not.toThrow();
    expect(readLocalStorageValue(KEY, schema, FALLBACK)).toEqual(FALLBACK);
  });

  it("returns the fallback for JSON that does not match the schema (old/incompatible version)", () => {
    localStorage.setItem(KEY, JSON.stringify({ value: "not-a-number" }));
    expect(readLocalStorageValue(KEY, schema, FALLBACK)).toEqual(FALLBACK);
  });

  it("returns the fallback for a schema shape from a previous version (e.g. renamed field)", () => {
    localStorage.setItem(KEY, JSON.stringify({ oldFieldName: 42 }));
    expect(readLocalStorageValue(KEY, schema, FALLBACK)).toEqual(FALLBACK);
  });

  it("returns the fallback instead of throwing when localStorage.getItem throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("privacy mode");
    });
    expect(() => readLocalStorageValue(KEY, schema, FALLBACK)).not.toThrow();
    expect(readLocalStorageValue(KEY, schema, FALLBACK)).toEqual(FALLBACK);
  });

  it("returns the fallback during SSR (no window)", () => {
    const originalWindow = globalThis.window;
    // @ts-expect-error simulating a server environment without window
    delete globalThis.window;

    try {
      expect(readLocalStorageValue(KEY, schema, FALLBACK)).toEqual(FALLBACK);
    } finally {
      globalThis.window = originalWindow;
    }
  });
});

describe("writeLocalStorageValue (US-18)", () => {
  it("round-trips a written value", () => {
    writeLocalStorageValue(KEY, { value: 7 });
    expect(readLocalStorageValue(KEY, schema, FALLBACK)).toEqual({ value: 7 });
  });

  it("does not throw when localStorage.setItem throws (quota exceeded)", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });
    expect(() => writeLocalStorageValue(KEY, { value: 1 })).not.toThrow();
  });

  it("does nothing during SSR (no window), without throwing", () => {
    const originalWindow = globalThis.window;
    // @ts-expect-error simulating a server environment without window
    delete globalThis.window;

    try {
      expect(() => writeLocalStorageValue(KEY, { value: 1 })).not.toThrow();
    } finally {
      globalThis.window = originalWindow;
    }
  });
});
