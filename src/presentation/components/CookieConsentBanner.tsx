import styles from "./CookieConsentBanner.module.css";

type CookieConsentBannerProps = {
  onAccept: () => void;
  onDecline: () => void;
};

export function CookieConsentBanner({ onAccept, onDecline }: CookieConsentBannerProps) {
  return (
    <div className={styles.banner} role="dialog" aria-label="Consentimento de cookies">
      <p className={styles.text}>
        Usamos cookies para entender como o jogo é utilizado e melhorar a experiência. Você
        aceita?
      </p>
      <div className={styles.actions}>
        <button type="button" className={styles.decline} onClick={onDecline}>
          Recusar
        </button>
        <button type="button" className={styles.accept} onClick={onAccept}>
          Aceitar
        </button>
      </div>
    </div>
  );
}
