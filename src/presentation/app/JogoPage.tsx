"use client";

import { useEffect, useState } from "react";
import { useGameEngine } from "@/application";
import { Board, HelpButton, HowToPlayModal, ReadyCountdown } from "@/presentation/components";
import styles from "./JogoPage.module.css";

export function JogoPage() {
  const [helpOpen, setHelpOpen] = useState(false);
  const { status, board, readyCountdownMs, startGame } = useGameEngine();

  useEffect(() => {
    startGame();
  }, [startGame]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <HelpButton onClick={() => setHelpOpen(true)} />
      </header>
      <main className={styles.main}>
        {status === "ready" && <ReadyCountdown durationMs={readyCountdownMs} />}
        {(status === "showingSequence" || status === "waitingInput") && <Board buttons={board} />}
      </main>
      <HowToPlayModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}
