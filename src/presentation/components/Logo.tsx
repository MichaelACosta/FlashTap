import styles from "./Logo.module.css";

export function Logo() {
  return (
    <div className={styles.mark}>
      <svg className={styles.icon} viewBox="0 0 100 100" fill="none" aria-hidden="true">
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="url(#logo-grad)"
          strokeWidth="4"
          opacity="0.35"
        />
        <path d="M55 8 L28 54 H46 L40 92 L74 42 H54 L55 8Z" fill="url(#logo-grad)" />
        <defs>
          <linearGradient id="logo-grad" x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%" stopColor="#7C5CFC" />
            <stop offset="100%" stopColor="#FF3EA5" />
          </linearGradient>
        </defs>
      </svg>
      <h1 className={styles.wordmark}>
        Flash<span className={styles.accent}>Tap</span>
      </h1>
      <p className={styles.tagline}>Velocidade · Reflexo · Concentração</p>
    </div>
  );
}
