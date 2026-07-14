import { beforeEach, describe, expect, it, vi } from "vitest";
import { readAnalyticsConsent, writeAnalyticsConsent } from "./consentStorage";

const KEY = "flashtap:v1:consent";

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("readAnalyticsConsent", () => {
  it("returns null when no choice has been made", () => {
    expect(readAnalyticsConsent()).toBeNull();
  });

  it("returns the stored choice", () => {
    localStorage.setItem(KEY, JSON.stringify("accepted"));
    expect(readAnalyticsConsent()).toBe("accepted");
  });

  it("returns null for corrupted or invalid data (US-18)", () => {
    localStorage.setItem(KEY, "{not-json");
    expect(readAnalyticsConsent()).toBeNull();

    localStorage.setItem(KEY, JSON.stringify("maybe"));
    expect(readAnalyticsConsent()).toBeNull();
  });
});

describe("writeAnalyticsConsent", () => {
  it("round-trips a written choice", () => {
    writeAnalyticsConsent("declined");
    expect(readAnalyticsConsent()).toBe("declined");
  });

  it("does not throw when localStorage.setItem throws", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota exceeded");
    });
    expect(() => writeAnalyticsConsent("accepted")).not.toThrow();
  });
});
