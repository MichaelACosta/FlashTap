"use client";

import Link from "next/link";
import { useLocalRecord } from "@/application";
import { Logo, RecordChip } from "@/presentation/components";
import styles from "./HomePage.module.css";

export function HomePage() {
  const { record } = useLocalRecord();

  return (
    <div className={styles.page}>
      <Logo />
      <Link href="/jogo" className={styles.ctaPlay}>
        Jogar
      </Link>
      <RecordChip value={record} />
    </div>
  );
}
