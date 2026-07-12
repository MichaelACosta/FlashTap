import styles from "./RecordChip.module.css";

type RecordChipProps = {
  value: string | null;
};

export function RecordChip({ value }: RecordChipProps) {
  return (
    <div className={styles.chip}>
      <span className={styles.label}>Melhor recorde</span>
      <span className={styles.value}>{value ?? "—"}</span>
    </div>
  );
}
