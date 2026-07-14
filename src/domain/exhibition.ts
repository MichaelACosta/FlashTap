export const READY_COUNTDOWN_MS = 1500;

const EXHIBITION_BASE_MS = 800;
const EXHIBITION_PER_BUTTON_MS = 300;
const EXHIBITION_CAP_MS = 4000;

export function computeExhibitionDurationMs(n: number): number {
  return Math.min(EXHIBITION_BASE_MS + n * EXHIBITION_PER_BUTTON_MS, EXHIBITION_CAP_MS);
}
