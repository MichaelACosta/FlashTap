import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>FlashTap</h1>
        <p>Scaffolding do Sprint 0 — as telas do jogo chegam nas próximas features.</p>
      </main>
    </div>
  );
}
