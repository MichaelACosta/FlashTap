import { describe, expect, it } from "vitest";
import { computeDistance, formatProgress, ROUNDS_PER_LEVEL, TOTAL_LEVELS } from "./distance";

describe("formatProgress", () => {
  it.each([
    [1, 1, "1.1"],
    [3, 2, "3.2"],
    [12, 5, "12.5"],
  ])("formats level %i round %i as %s", (level, round, expected) => {
    expect(formatProgress(level, round)).toBe(expected);
  });
});

describe("computeDistance (GRS §17)", () => {
  it.each([
    [1, 1, "11 níveis e 4 rodadas"],
    [3, 2, "9 níveis e 3 rodadas"],
    [5, 5, "7 níveis"],
    [9, 4, "3 níveis e 1 rodada"],
    [9, 5, "3 níveis"],
    [11, 5, "1 nível"],
    [12, 5, "Concluído"],
  ])("computes distance for %i.%i as %s", (level, round, expected) => {
    expect(computeDistance(level, round)).toBe(expected);
  });

  it("handles the edge case of a fresh level with only rounds remaining stated as rodadas", () => {
    expect(computeDistance(12, 1)).toBe("4 rodadas");
  });
});

describe("constants", () => {
  it("matches the GRS board structure (12 levels x 5 rounds)", () => {
    expect(TOTAL_LEVELS).toBe(12);
    expect(ROUNDS_PER_LEVEL).toBe(5);
  });
});
