import styles from "./Timer.module.css";

type TimerProps = {
  tempo: string;
};

export function Timer({ tempo }: TimerProps) {
  return (
    <div className={styles.timer} role="timer" aria-label="Tempo decorrido">
      {tempo}
    </div>
  );
}
