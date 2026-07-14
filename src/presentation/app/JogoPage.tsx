"use client";

import { useEffect, useState } from "react";
import { useGameEngine, useLocalRecord } from "@/application";
import {
  Board,
  HelpButton,
  HowToPlayModal,
  ReadyCountdown,
  ResultSummary,
  SubmitButton,
} from "@/presentation/components";
import styles from "./JogoPage.module.css";

export function JogoPage() {
  const [helpOpen, setHelpOpen] = useState(false);
  const {
    status,
    board,
    readyCountdownMs,
    startGame,
    selectButton,
    isSubmitEnabled,
    progress,
    distance,
  } = useGameEngine();
  const { record } = useLocalRecord();

  useEffect(() => {
    startGame();
  }, [startGame]);

  const showBoard =
    status === "showingSequence" || status === "waitingInput" || status === "gameOver";

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <HelpButton onClick={() => setHelpOpen(true)} />
      </header>
      <main className={styles.main}>
        {status === "ready" && <ReadyCountdown durationMs={readyCountdownMs} />}
        {showBoard && (
          <div className={styles.gameArea}>
            <Board
              buttons={board}
              onButtonClick={status === "waitingInput" ? selectButton : undefined}
            />
            {status === "waitingInput" && (
              // TODO(US-10): wire onClick once round/level progression exists.
              <SubmitButton disabled={!isSubmitEnabled} />
            )}
            {status === "gameOver" && (
              // TODO(US-13): pass the real elapsed time once useGameTimer exists.
              <ResultSummary progress={progress} distance={distance} tempo={null} record={record} />
            )}
          </div>
        )}
      </main>
      <HowToPlayModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}
