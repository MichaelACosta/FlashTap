import { describe, expect, it } from "vitest";
import { formatElapsedTime } from "./time";

describe("formatElapsedTime (GRS §18)", () => {
  it.each([
    [0, "00:00"],
    [999, "00:00"],
    [1000, "00:01"],
    [12_000, "00:12"],
    [59_000, "00:59"],
    [60_000, "01:00"],
    [125_000, "02:05"],
    [3_600_000, "60:00"],
  ])("formats %i ms as %s", (ms, expected) => {
    expect(formatElapsedTime(ms)).toBe(expected);
  });
});
