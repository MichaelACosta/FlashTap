import styles from "./ResultSummary.module.css";

type ResultSummaryProps = {
  progress: string;
  distance: string;
  tempo: string | null;
  record: string | null;
};

export function ResultSummary({ progress, distance, tempo, record }: ResultSummaryProps) {
  return (
    <div className={styles.panel} role="region" aria-label="Fim de partida">
      <p className={styles.title}>Fim de partida</p>
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
    </div>
  );
}
