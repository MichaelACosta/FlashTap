"use client";

import Link from "next/link";
import { useLocalRecord, useTutorialFlag } from "@/application";
import { useThemeMode } from "@/presentation/theme";
import { HowToPlayModal, Logo, RecordChip, ThemeToggle } from "@/presentation/components";
import styles from "./HomePage.module.css";

export function HomePage() {
  const { record } = useLocalRecord();
  const { shouldShowTutorial, dismissTutorial } = useTutorialFlag();
  const { mode, toggleMode } = useThemeMode();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <ThemeToggle mode={mode} onClick={toggleMode} />
      </header>
      <div className={styles.content}>
        <Logo />
        <Link href="/jogo" className={styles.ctaPlay}>
          Jogar
        </Link>
        <RecordChip value={record} />
      </div>
      <HowToPlayModal open={shouldShowTutorial} onClose={dismissTutorial} />
    </div>
  );
}
