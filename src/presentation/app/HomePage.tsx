"use client";

import Link from "next/link";
import { useLocalRecord, useTutorialFlag } from "@/application";
import { HowToPlayModal, Logo, RecordChip } from "@/presentation/components";
import styles from "./HomePage.module.css";

export function HomePage() {
  const { record } = useLocalRecord();
  const { shouldShowTutorial, dismissTutorial } = useTutorialFlag();

  return (
    <div className={styles.page}>
      <Logo />
      <Link href="/jogo" className={styles.ctaPlay}>
        Jogar
      </Link>
      <RecordChip value={record} />
      <HowToPlayModal open={shouldShowTutorial} onClose={dismissTutorial} />
    </div>
  );
}
