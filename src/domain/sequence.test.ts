import { describe, expect, it } from "vitest";
import { BOARD_SIZE, drawSequence, getSequenceLength } from "./sequence";

function seededRng(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

describe("getSequenceLength", () => {
  it.each(Array.from({ length: 12 }, (_, i) => i + 1))(
    "returns %i for level %i (GRS §5)",
    (level) => {
      expect(getSequenceLength(level)).toBe(level);
    },
  );
});

describe("drawSequence", () => {
  it.each(Array.from({ length: 12 }, (_, i) => i + 1))(
    "draws exactly n=%i unique ids within [1, boardSize] for n=%i",
    (n) => {
      const result = drawSequence(n, BOARD_SIZE, seededRng(n));

      expect(result).toHaveLength(n);
      expect(new Set(result).size).toBe(n);
      result.forEach((id) => {
        expect(id).toBeGreaterThanOrEqual(1);
        expect(id).toBeLessThanOrEqual(BOARD_SIZE);
      });
    },
  );

  it("returns an empty array for n=0", () => {
    expect(drawSequence(0, BOARD_SIZE, seededRng(1))).toEqual([]);
  });

  it("draws all board ids exactly once when n=boardSize", () => {
    const result = drawSequence(BOARD_SIZE, BOARD_SIZE, seededRng(7));

    expect(result).toEqual(Array.from({ length: BOARD_SIZE }, (_, i) => i + 1));
  });

  it("distributes draws roughly uniformly across ids over many trials (GRS §6)", () => {
    const trials = 6000;
    const n = 3;
    const counts = new Array<number>(BOARD_SIZE + 1).fill(0);
    let rngState = 42;
    const rng = () => {
      rngState = (rngState * 1103515245 + 12345) & 0x7fffffff;
      return rngState / 0x7fffffff;
    };

    for (let t = 0; t < trials; t++) {
      drawSequence(n, BOARD_SIZE, rng).forEach((id) => {
        counts[id]++;
      });
    }

    const expected = (trials * n) / BOARD_SIZE;
    for (let id = 1; id <= BOARD_SIZE; id++) {
      expect(counts[id]).toBeGreaterThan(expected * 0.6);
      expect(counts[id]).toBeLessThan(expected * 1.4);
    }
  });
});
