export const BOARD_SIZE = 12;

export type ButtonId = number;

export function getSequenceLength(level: number): number {
  return level;
}

export function drawSequence(
  n: number,
  boardSize: number,
  rng: () => number = Math.random,
): ButtonId[] {
  const pool = Array.from({ length: boardSize }, (_, index) => index + 1);

  for (let i = pool.length - 1; i > pool.length - 1 - n; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(pool.length - n).sort((a, b) => a - b);
}
