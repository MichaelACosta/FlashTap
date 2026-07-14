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
  Timer,
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
    submitRound,
    isSubmitEnabled,
    progress,
    distance,
    tempo,
  } = useGameEngine();
  const { record } = useLocalRecord();

  useEffect(() => {
    startGame();
  }, [startGame]);

  const showBoard =
    status === "showingSequence" ||
    status === "waitingInput" ||
    status === "gameOver" ||
    status === "victory";
  const showResult = status === "gameOver" || status === "victory";

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <HelpButton onClick={() => setHelpOpen(true)} />
      </header>
      <main className={styles.main}>
        {status === "ready" && <ReadyCountdown durationMs={readyCountdownMs} />}
        {showBoard && (
          <div className={styles.gameArea}>
            <Timer tempo={tempo} />
            <Board
              buttons={board}
              onButtonClick={status === "waitingInput" ? selectButton : undefined}
            />
            {status === "waitingInput" && (
              <SubmitButton disabled={!isSubmitEnabled} onClick={submitRound} />
            )}
            {showResult && (
              // TODO(US-15): distinct visual treatment for victory vs. game over.
              <ResultSummary progress={progress} distance={distance} tempo={tempo} record={record} />
            )}
          </div>
        )}
      </main>
      <HowToPlayModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}
