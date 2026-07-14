import styles from "./ResultSummary.module.css";

export type ResultOutcome = "gameOver" | "victory";

type ResultSummaryProps = {
  outcome: ResultOutcome;
  progress: string;
  distance: string;
  tempo: string | null;
  record: string | null;
  onPlayAgain: () => void;
};

const TITLES: Record<ResultOutcome, string> = {
  gameOver: "Fim de partida",
  victory: "Vitória!",
};

export function ResultSummary({
  outcome,
  progress,
  distance,
  tempo,
  record,
  onPlayAgain,
}: ResultSummaryProps) {
  const title = TITLES[outcome];

  return (
    <div
      className={`${styles.panel} ${outcome === "victory" ? styles.victory : styles.gameOver}`}
      role="region"
      aria-label={title}
    >
      <p className={styles.title}>{title}</p>
      <dl className={styles.grid}>
        <div className={styles.field}>
          <dt className={styles.label}>Progresso</dt>
          <dd className={styles.value}>{progress}</dd>
        </div>
        <div className={styles.field}>
          <dt className={styles.label}>Distância</dt>
          <dd className={styles.value}>{distance}</dd>
        </div>
        <div className={styles.field}>
          <dt className={styles.label}>Tempo</dt>
          <dd className={styles.value}>{tempo ?? "—"}</dd>
        </div>
        <div className={styles.field}>
          <dt className={styles.label}>Recorde</dt>
          <dd className={styles.value}>{record ?? "—"}</dd>
        </div>
      </dl>
      <button type="button" className={styles.playAgain} onClick={onPlayAgain}>
        Jogar novamente
      </button>
    </div>
  );
}
