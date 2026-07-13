"use client";

import { useState } from "react";
import { HelpButton, HowToPlayModal } from "@/presentation/components";
import styles from "./JogoPage.module.css";

export function JogoPage() {
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <HelpButton onClick={() => setHelpOpen(true)} />
      </header>
      <p className={styles.placeholder}>O motor de jogo chega nas próximas features (F3).</p>
      <HowToPlayModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}
