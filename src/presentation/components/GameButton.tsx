import type { ButtonVisualState } from "@/application";
import styles from "./GameButton.module.css";

type GameButtonProps = {
  id: number;
  state: ButtonVisualState;
  disabled: boolean;
  onClick?: () => void;
};

const stateClassName: Record<ButtonVisualState, string> = {
  idle: styles.idle,
  showing: styles.showing,
  selected: styles.selected,
  wrong: styles.wrong,
};

const stateAriaSuffix: Record<ButtonVisualState, string> = {
  idle: "",
  showing: ", destacado",
  selected: ", selecionado",
  wrong: ", incorreto",
};

export function GameButton({ id, state, disabled, onClick }: GameButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.button} ${stateClassName[state]}`}
      data-state={state}
      disabled={disabled}
      onClick={onClick}
      aria-label={`Botão ${id}${stateAriaSuffix[state]}`}
    >
      {id}
    </button>
  );
}
