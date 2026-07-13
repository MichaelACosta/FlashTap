import styles from "./HelpButton.module.css";

type HelpButtonProps = {
  onClick: () => void;
};

export function HelpButton({ onClick }: HelpButtonProps) {
  return (
    <button type="button" className={styles.button} onClick={onClick} aria-label="Como jogar">
      ?
    </button>
  );
}
