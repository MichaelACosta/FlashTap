import { beforeEach, describe, expect, it, vi } from "vitest";
import { readTutorialSeen, writeTutorialSeen } from "./tutorialFlag";

const KEY = "flashtap:v1:tutorial-seen";

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("readTutorialSeen", () => {
  it("returns false when the key is missing", () => {
    expect(readTutorialSeen()).toBe(false);
  });

  it("returns true when a valid boolean true is stored", () => {
    localStorage.setItem(KEY, "true");
    expect(readTutorialSeen()).toBe(true);
  });

  it("returns false for corrupted non-JSON data", () => {
    localStorage.setItem(KEY, "{not-json");
    expect(readTutorialSeen()).toBe(false);
  });

  it("returns false for JSON of the wrong shape", () => {
    localStorage.setItem(KEY, JSON.stringify({ seen: true }));
    expect(readTutorialSeen()).toBe(false);
  });

  it("returns false when localStorage.getItem throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("privacy mode");
    });
    expect(readTutorialSeen()).toBe(false);
  });
});

describe("writeTutorialSeen", () => {
  it("round-trips a written value", () => {
    writeTutorialSeen(true);
    expect(readTutorialSeen()).toBe(true);
  });

  it("does not throw when localStorage.setItem throws", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota exceeded");
    });
    expect(() => writeTutorialSeen(true)).not.toThrow();
  });
});
