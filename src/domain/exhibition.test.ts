import { describe, expect, it } from "vitest";
import { computeExhibitionDurationMs, READY_COUNTDOWN_MS } from "./exhibition";

describe("computeExhibitionDurationMs (GRS §7)", () => {
  it("returns 1100ms for N=1", () => {
    expect(computeExhibitionDurationMs(1)).toBe(1100);
  });

  it("returns 3800ms for N=10 (highest value below the cap)", () => {
    expect(computeExhibitionDurationMs(10)).toBe(3800);
  });

  it("caps at 4000ms for N=11 (raw formula would be 4100ms)", () => {
    expect(computeExhibitionDurationMs(11)).toBe(4000);
  });

  it("caps at 4000ms for N=12 (raw formula would be 4400ms)", () => {
    expect(computeExhibitionDurationMs(12)).toBe(4000);
  });
});

describe("READY_COUNTDOWN_MS", () => {
  it("is fixed at 1.5s (GRS §20)", () => {
    expect(READY_COUNTDOWN_MS).toBe(1500);
  });
});
