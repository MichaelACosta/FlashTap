import type { BoardButtonViewModel } from "@/application";
import { GameButton } from "./GameButton";
import styles from "./Board.module.css";

type BoardProps = {
  buttons: BoardButtonViewModel[];
  onButtonClick?: (id: number) => void;
};

export function Board({ buttons, onButtonClick }: BoardProps) {
  return (
    <div className={styles.board}>
      {buttons.map((button) => (
        <GameButton
          key={button.id}
          id={button.id}
          state={button.state}
          disabled={button.disabled}
          onClick={onButtonClick ? () => onButtonClick(button.id) : undefined}
        />
      ))}
    </div>
  );
}
