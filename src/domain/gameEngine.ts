import { BOARD_SIZE, drawSequence, getSequenceLength, type ButtonId } from "./sequence";

export type ButtonVisualState = "idle" | "showing" | "selected" | "wrong";

export type GameStatus = "idle" | "ready" | "showingSequence" | "waitingInput" | "gameOver";

export type GameEngineState = {
  status: GameStatus;
  level: number;
  round: number;
  sequence: ButtonId[];
  selectedIds: ButtonId[];
  wrongButtonId: ButtonId | null;
};

export type GameAction =
  | { type: "START_GAME" }
  | { type: "READY_COUNTDOWN_DONE" }
  | { type: "SEQUENCE_SHOWN" }
  | { type: "SELECT_BUTTON"; buttonId: ButtonId };

export function createInitialGameState(): GameEngineState {
  return {
    status: "idle",
    level: 1,
    round: 1,
    sequence: [],
    selectedIds: [],
    wrongButtonId: null,
  };
}

export function gameReducer(state: GameEngineState, action: GameAction): GameEngineState {
  switch (action.type) {
    case "START_GAME": {
      if (state.status !== "idle") return state;
      return {
        ...state,
        status: "ready",
        sequence: drawSequence(getSequenceLength(state.level), BOARD_SIZE),
      };
    }
    case "READY_COUNTDOWN_DONE": {
      if (state.status !== "ready") return state;
      return { ...state, status: "showingSequence" };
    }
    case "SEQUENCE_SHOWN": {
      if (state.status !== "showingSequence") return state;
      return { ...state, status: "waitingInput" };
    }
    case "SELECT_BUTTON": {
      if (state.status !== "waitingInput") return state;
      if (state.selectedIds.includes(action.buttonId)) return state;
      if (!state.sequence.includes(action.buttonId)) {
        return { ...state, status: "gameOver", wrongButtonId: action.buttonId };
      }
      return { ...state, selectedIds: [...state.selectedIds, action.buttonId] };
    }
    default:
      return state;
  }
}

export function getButtonVisualState(
  state: GameEngineState,
  buttonId: ButtonId,
): ButtonVisualState {
  if (state.status === "showingSequence" && state.sequence.includes(buttonId)) {
    return "showing";
  }
  if (state.wrongButtonId === buttonId) {
    return "wrong";
  }
  if (state.selectedIds.includes(buttonId)) {
    return "selected";
  }
  return "idle";
}

export function canInteract(state: GameEngineState): boolean {
  return state.status === "waitingInput";
}

export function isSubmitEnabled(state: GameEngineState): boolean {
  return state.status === "waitingInput" && state.selectedIds.length === state.sequence.length;
}
