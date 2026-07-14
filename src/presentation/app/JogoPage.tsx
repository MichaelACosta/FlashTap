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
    level,
    round,
    board,
    readyCountdownMs,
    startGame,
    selectButton,
    submitRound,
    isSubmitEnabled,
    progress,
    distance,
    tempo,
    tempoMs,
    resetGame,
  } = useGameEngine();
  const { record, maybeUpdateRecord } = useLocalRecord();

  useEffect(() => {
    if (status === "idle") startGame();
  }, [status, startGame]);

  useEffect(() => {
    if (status === "gameOver" || status === "victory") {
      maybeUpdateRecord(level, round, tempoMs);
    }
  }, [status, level, round, tempoMs, maybeUpdateRecord]);

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
              <ResultSummary
                outcome={status === "victory" ? "victory" : "gameOver"}
                progress={progress}
                distance={distance}
                tempo={tempo}
                record={record}
                onPlayAgain={resetGame}
              />
            )}
          </div>
        )}
      </main>
      <HowToPlayModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}
