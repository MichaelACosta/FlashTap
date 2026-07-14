import { beforeEach, describe, expect, it, vi } from "vitest";
import { readRecord, writeRecord } from "./recordStorage";

const KEY = "flashtap:v1:record";

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("readRecord", () => {
  it("returns null when no record is stored", () => {
    expect(readRecord()).toBeNull();
  });

  it("returns the stored record when valid", () => {
    localStorage.setItem(KEY, JSON.stringify({ level: 5, round: 3, tempoMs: 12_000 }));
    expect(readRecord()).toEqual({ level: 5, round: 3, tempoMs: 12_000 });
  });

  it("returns null for corrupted non-JSON data (US-18)", () => {
    localStorage.setItem(KEY, "{not-json");
    expect(readRecord()).toBeNull();
  });

  it("returns null for a record shape from an incompatible/old version (US-18)", () => {
    localStorage.setItem(KEY, JSON.stringify({ progress: "5.3", time: "12" }));
    expect(readRecord()).toBeNull();
  });

  it("returns null when localStorage.getItem throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("privacy mode");
    });
    expect(readRecord()).toBeNull();
  });
});

describe("writeRecord", () => {
  it("round-trips a written record", () => {
    writeRecord({ level: 8, round: 1, tempoMs: 45_000 });
    expect(readRecord()).toEqual({ level: 8, round: 1, tempoMs: 45_000 });
  });

  it("does not throw when localStorage.setItem throws", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota exceeded");
    });
    expect(() => writeRecord({ level: 1, round: 1, tempoMs: 0 })).not.toThrow();
  });
});
