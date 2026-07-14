import { useCallback, useEffect, useRef, useState } from "react";
import type { GameStatus } from "@/domain";

const TICK_MS = 100;

export type UseGameTimerResult = {
  elapsedMs: number;
  reset: () => void;
};

function isRunningStatus(status: GameStatus): boolean {
  return status === "showingSequence" || status === "waitingInput";
}

// Uses performance.now() rather than Date.now() so elapsed time stays
// accurate across system clock adjustments (GRS §18, US-13).
export function useGameTimer(status: GameStatus): UseGameTimerResult {
  const [elapsedMs, setElapsedMs] = useState(0);
  const startedAtRef = useRef<number | null>(null);
  const accumulatedRef = useRef(0);

  const reset = useCallback(() => {
    startedAtRef.current = null;
    accumulatedRef.current = 0;
    setElapsedMs(0);
  }, []);

  useEffect(() => {
    if (!isRunningStatus(status)) return;

    if (startedAtRef.current === null) {
      startedAtRef.current = performance.now();
    }

    const intervalId = setInterval(() => {
      const startedAt = startedAtRef.current ?? performance.now();
      setElapsedMs(accumulatedRef.current + (performance.now() - startedAt));
    }, TICK_MS);

    return () => {
      clearInterval(intervalId);
      if (startedAtRef.current !== null) {
        accumulatedRef.current += performance.now() - startedAtRef.current;
        startedAtRef.current = null;
        setElapsedMs(accumulatedRef.current);
      }
    };
  }, [status]);

  return { elapsedMs, reset };
}
