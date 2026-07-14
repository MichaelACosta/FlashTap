export type LocalRecord = {
  level: number;
  round: number;
  tempoMs: number;
};

// GRS §19: recorde = maior progresso; empate desempatado por menor tempo.
export function isNewRecord(candidate: LocalRecord, current: LocalRecord | null): boolean {
  if (current === null) return true;
  if (candidate.level !== current.level) return candidate.level > current.level;
  if (candidate.round !== current.round) return candidate.round > current.round;
  return candidate.tempoMs < current.tempoMs;
}
