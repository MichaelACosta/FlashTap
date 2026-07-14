import { useCallback, useEffect, useMemo, useReducer } from "react";
import {
  BOARD_SIZE,
  canInteract,
  computeDistance,
  computeExhibitionDurationMs,
  createInitialGameState,
  formatElapsedTime,
  formatProgress,
  gameReducer,
  getButtonVisualState,
  getSequenceLength,
  isSubmitEnabled,
  READY_COUNTDOWN_MS,
  type ButtonId,
  type ButtonVisualState,
  type GameStatus,
} from "@/domain";
import { useGameTimer } from "./useGameTimer";

export type BoardButtonViewModel = {
  id: number;
  state: ButtonVisualState;
  disabled: boolean;
};

export type UseGameEngineResult = {
  status: GameStatus;
  level: number;
  round: number;
  board: BoardButtonViewModel[];
  readyCountdownMs: number;
  startGame: () => void;
  selectButton: (id: ButtonId) => void;
  submitRound: () => void;
  isSubmitEnabled: boolean;
  progress: string;
  distance: string;
  tempo: string;
  tempoMs: number;
  resetGame: () => void;
};

export function useGameEngine(): UseGameEngineResult {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialGameState);
  const { elapsedMs, reset: resetTimer } = useGameTimer(state.status);

  useEffect(() => {
    if (state.status !== "ready") return;

    const timeoutId = setTimeout(() => {
      dispatch({ type: "READY_COUNTDOWN_DONE" });
    }, READY_COUNTDOWN_MS);

    return () => clearTimeout(timeoutId);
  }, [state.status]);

  useEffect(() => {
    if (state.status !== "showingSequence") return;

    const duration = computeExhibitionDurationMs(getSequenceLength(state.level));
    const timeoutId = setTimeout(() => {
      dispatch({ type: "SEQUENCE_SHOWN" });
    }, duration);

    return () => clearTimeout(timeoutId);
  }, [state.status, state.level]);

  const startGame = useCallback(() => {
    dispatch({ type: "START_GAME" });
  }, []);

  const selectButton = useCallback((id: ButtonId) => {
    dispatch({ type: "SELECT_BUTTON", buttonId: id });
  }, []);

  const submitRound = useCallback(() => {
    dispatch({ type: "SUBMIT_ROUND_SUCCESS" });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: "RESET_GAME" });
    resetTimer();
  }, [resetTimer]);

  const board = useMemo<BoardButtonViewModel[]>(() => {
    const interactive = canInteract(state);
    return Array.from({ length: BOARD_SIZE }, (_, index) => {
      const id = index + 1;
      const buttonState = getButtonVisualState(state, id);
      return { id, state: buttonState, disabled: !interactive || buttonState === "selected" };
    });
  }, [state]);

  return {
    status: state.status,
    level: state.level,
    round: state.round,
    board,
    readyCountdownMs: READY_COUNTDOWN_MS,
    startGame,
    selectButton,
    submitRound,
    isSubmitEnabled: isSubmitEnabled(state),
    progress: formatProgress(state.level, state.round),
    distance: computeDistance(state.level, state.round),
    tempo: formatElapsedTime(elapsedMs),
    tempoMs: elapsedMs,
    resetGame,
  };
}
