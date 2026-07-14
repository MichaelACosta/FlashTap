import styles from "./SubmitButton.module.css";

type SubmitButtonProps = {
  disabled: boolean;
  onClick?: () => void;
};

export function SubmitButton({ disabled, onClick }: SubmitButtonProps) {
  return (
    <button type="button" className={styles.button} disabled={disabled} onClick={onClick}>
      Enviar
    </button>
  );
}
