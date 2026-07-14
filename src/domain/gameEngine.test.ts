import { describe, expect, it } from "vitest";
import { BOARD_SIZE } from "./sequence";
import {
  canInteract,
  createInitialGameState,
  gameReducer,
  getButtonVisualState,
  type GameAction,
  type GameEngineState,
  type GameStatus,
} from "./gameEngine";

describe("createInitialGameState", () => {
  it("starts idle at level 1, round 1, with no sequence", () => {
    expect(createInitialGameState()).toEqual({
      status: "idle",
      level: 1,
      round: 1,
      sequence: [],
    });
  });
});

describe("gameReducer happy path (GRS §20)", () => {
  it("goes idle -> ready -> showingSequence -> waitingInput, drawing a valid sequence on START_GAME", () => {
    let state = createInitialGameState();

    state = gameReducer(state, { type: "START_GAME" });
    expect(state.status).toBe("ready");
    expect(state.sequence).toHaveLength(1);
    expect(new Set(state.sequence).size).toBe(1);
    state.sequence.forEach((id) => {
      expect(id).toBeGreaterThanOrEqual(1);
      expect(id).toBeLessThanOrEqual(BOARD_SIZE);
    });

    const sequenceAfterReady = state.sequence;
    state = gameReducer(state, { type: "READY_COUNTDOWN_DONE" });
    expect(state.status).toBe("showingSequence");
    expect(state.sequence).toEqual(sequenceAfterReady);

    state = gameReducer(state, { type: "SEQUENCE_SHOWN" });
    expect(state.status).toBe("waitingInput");
    expect(state.sequence).toEqual(sequenceAfterReady);
  });
});

describe("gameReducer invalid transitions are no-ops (GRS §22)", () => {
  const statuses: GameStatus[] = ["idle", "ready", "showingSequence", "waitingInput"];
  const validFrom: Record<GameAction["type"], GameStatus> = {
    START_GAME: "idle",
    READY_COUNTDOWN_DONE: "ready",
    SEQUENCE_SHOWN: "showingSequence",
  };
  const actions: GameAction[] = [
    { type: "START_GAME" },
    { type: "READY_COUNTDOWN_DONE" },
    { type: "SEQUENCE_SHOWN" },
  ];

  actions.forEach((action) => {
    statuses
      .filter((status) => status !== validFrom[action.type])
      .forEach((status) => {
        it(`ignores ${action.type} dispatched from status "${status}"`, () => {
          const state: GameEngineState = {
            status,
            level: 2,
            round: 3,
            sequence: [1, 2],
          };

          expect(gameReducer(state, action)).toEqual(state);
        });
      });
  });
});

describe("getButtonVisualState", () => {
  it("marks ids in the active sequence as showing only while status is showingSequence", () => {
    const showingState: GameEngineState = {
      status: "showingSequence",
      level: 1,
      round: 1,
      sequence: [3, 7],
    };

    expect(getButtonVisualState(showingState, 3)).toBe("showing");
    expect(getButtonVisualState(showingState, 7)).toBe("showing");
    expect(getButtonVisualState(showingState, 5)).toBe("idle");
  });

  it.each<GameStatus>(["idle", "ready", "waitingInput"])(
    "treats every id as idle when status is %s, even if it is in the sequence",
    (status) => {
      const state: GameEngineState = { status, level: 1, round: 1, sequence: [3, 7] };

      expect(getButtonVisualState(state, 3)).toBe("idle");
    },
  );
});

describe("canInteract", () => {
  it.each<GameStatus>(["idle", "ready", "showingSequence"])(
    "returns false when status is %s",
    (status) => {
      expect(canInteract({ status, level: 1, round: 1, sequence: [] })).toBe(false);
    },
  );

  it("returns true only when status is waitingInput", () => {
    expect(canInteract({ status: "waitingInput", level: 1, round: 1, sequence: [] })).toBe(true);
  });
});
