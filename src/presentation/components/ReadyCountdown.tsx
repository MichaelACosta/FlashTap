import { useEffect, useState } from "react";
import styles from "./ReadyCountdown.module.css";

type ReadyCountdownProps = {
  durationMs: number;
};

export function ReadyCountdown({ durationMs }: ReadyCountdownProps) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    const tickMs = durationMs / 3;
    const intervalId = setInterval(() => {
      setCount((current) => (current > 1 ? current - 1 : 1));
    }, tickMs);

    return () => clearInterval(intervalId);
  }, [durationMs]);

  return (
    <div className={styles.countdown} role="status" aria-live="polite">
      {count}
    </div>
  );
}
