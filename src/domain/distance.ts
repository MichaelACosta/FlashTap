export const TOTAL_LEVELS = 12;
export const ROUNDS_PER_LEVEL = 5;

export function formatProgress(level: number, round: number): string {
  return `${level}.${round}`;
}

export function computeDistance(level: number, round: number): string {
  const levelsRemaining = TOTAL_LEVELS - level;
  const roundsRemaining = ROUNDS_PER_LEVEL - round;

  if (levelsRemaining <= 0 && roundsRemaining <= 0) {
    return "Concluído";
  }

  const parts: string[] = [];
  if (levelsRemaining > 0) {
    parts.push(`${levelsRemaining} ${levelsRemaining === 1 ? "nível" : "níveis"}`);
  }
  if (roundsRemaining > 0) {
    parts.push(`${roundsRemaining} ${roundsRemaining === 1 ? "rodada" : "rodadas"}`);
  }
  return parts.join(" e ");
}
