import { describe, expect, it } from "vitest";
import { BOARD_SIZE } from "./sequence";
import {
  canInteract,
  createInitialGameState,
  gameReducer,
  getButtonVisualState,
  isSubmitEnabled,
  type GameAction,
  type GameEngineState,
  type GameStatus,
} from "./gameEngine";

describe("createInitialGameState", () => {
  it("starts idle at level 1, round 1, with no sequence, no selection, no wrong button", () => {
    expect(createInitialGameState()).toEqual({
      status: "idle",
      level: 1,
      round: 1,
      sequence: [],
      selectedIds: [],
      wrongButtonId: null,
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

    const [correctId] = sequenceAfterReady;
    state = gameReducer(state, { type: "SELECT_BUTTON", buttonId: correctId });
    expect(state.status).toBe("waitingInput");
    expect(state.selectedIds).toEqual([correctId]);
  });
});

describe("gameReducer invalid transitions are no-ops (GRS §22)", () => {
  const statuses: GameStatus[] = [
    "idle",
    "ready",
    "showingSequence",
    "waitingInput",
    "gameOver",
    "victory",
  ];
  const validFrom: Record<GameAction["type"], GameStatus> = {
    START_GAME: "idle",
    READY_COUNTDOWN_DONE: "ready",
    SEQUENCE_SHOWN: "showingSequence",
    SELECT_BUTTON: "waitingInput",
    SUBMIT_ROUND_SUCCESS: "waitingInput",
  };
  const actions: GameAction[] = [
    { type: "START_GAME" },
    { type: "READY_COUNTDOWN_DONE" },
    { type: "SEQUENCE_SHOWN" },
    { type: "SELECT_BUTTON", buttonId: 1 },
    { type: "SUBMIT_ROUND_SUCCESS" },
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
            selectedIds: [],
            wrongButtonId: null,
          };

          expect(gameReducer(state, action)).toEqual(state);
        });
      });
  });
});

describe("gameReducer SELECT_BUTTON from waitingInput (GRS §10/§11)", () => {
  const baseState: GameEngineState = {
    status: "waitingInput",
    level: 2,
    round: 1,
    sequence: [3, 7],
    selectedIds: [],
    wrongButtonId: null,
  };

  it("adds a correct, not-yet-selected id to selectedIds", () => {
    const next = gameReducer(baseState, { type: "SELECT_BUTTON", buttonId: 3 });

    expect(next.status).toBe("waitingInput");
    expect(next.selectedIds).toEqual([3]);
    expect(next.wrongButtonId).toBeNull();
  });

  it("ignores a click on an already-selected id (no-op)", () => {
    const state: GameEngineState = { ...baseState, selectedIds: [3] };

    expect(gameReducer(state, { type: "SELECT_BUTTON", buttonId: 3 })).toEqual(state);
  });

  it("ends the match on a click outside the sequence, recording the wrong button", () => {
    const next = gameReducer(baseState, { type: "SELECT_BUTTON", buttonId: 9 });

    expect(next.status).toBe("gameOver");
    expect(next.wrongButtonId).toBe(9);
    expect(next.selectedIds).toEqual([]);
  });

  it("preserves previously-selected ids when a later click is wrong", () => {
    const state: GameEngineState = { ...baseState, selectedIds: [3] };

    const next = gameReducer(state, { type: "SELECT_BUTTON", buttonId: 9 });

    expect(next.status).toBe("gameOver");
    expect(next.wrongButtonId).toBe(9);
    expect(next.selectedIds).toEqual([3]);
  });
});

describe("gameReducer SUBMIT_ROUND_SUCCESS (GRS §14/§15)", () => {
  it("advances to the next round within the same level when round < 5", () => {
    const state: GameEngineState = {
      status: "waitingInput",
      level: 3,
      round: 2,
      sequence: [1, 2, 3],
      selectedIds: [1, 2, 3],
      wrongButtonId: null,
    };

    const next = gameReducer(state, { type: "SUBMIT_ROUND_SUCCESS" });

    expect(next.status).toBe("showingSequence");
    expect(next.level).toBe(3);
    expect(next.round).toBe(3);
    expect(next.selectedIds).toEqual([]);
    expect(next.sequence).toHaveLength(3);
    expect(new Set(next.sequence).size).toBe(3);
  });

  it("advances to the next level, resetting round to 1, when round 5 completes and level < 12", () => {
    const state: GameEngineState = {
      status: "waitingInput",
      level: 3,
      round: 5,
      sequence: [1, 2, 3],
      selectedIds: [1, 2, 3],
      wrongButtonId: null,
    };

    const next = gameReducer(state, { type: "SUBMIT_ROUND_SUCCESS" });

    expect(next.status).toBe("showingSequence");
    expect(next.level).toBe(4);
    expect(next.round).toBe(1);
    expect(next.selectedIds).toEqual([]);
    expect(next.sequence).toHaveLength(4);
    expect(new Set(next.sequence).size).toBe(4);
  });

  it("wins the game when round 5 of level 12 completes (GRS §15)", () => {
    const sequence = Array.from({ length: 12 }, (_, i) => i + 1);
    const state: GameEngineState = {
      status: "waitingInput",
      level: 12,
      round: 5,
      sequence,
      selectedIds: sequence,
      wrongButtonId: null,
    };

    const next = gameReducer(state, { type: "SUBMIT_ROUND_SUCCESS" });

    expect(next.status).toBe("victory");
    expect(next.level).toBe(12);
    expect(next.round).toBe(5);
    expect(next.sequence).toEqual(sequence);
    expect(next.selectedIds).toEqual(sequence);
  });

  it("is a no-op when the selection does not yet match the sequence (GRS §13)", () => {
    const state: GameEngineState = {
      status: "waitingInput",
      level: 3,
      round: 2,
      sequence: [1, 2, 3],
      selectedIds: [1, 2],
      wrongButtonId: null,
    };

    expect(gameReducer(state, { type: "SUBMIT_ROUND_SUCCESS" })).toEqual(state);
  });
});

describe("getButtonVisualState", () => {
  it("marks ids in the active sequence as showing only while status is showingSequence", () => {
    const showingState: GameEngineState = {
      status: "showingSequence",
      level: 1,
      round: 1,
      sequence: [3, 7],
      selectedIds: [],
      wrongButtonId: null,
    };

    expect(getButtonVisualState(showingState, 3)).toBe("showing");
    expect(getButtonVisualState(showingState, 7)).toBe("showing");
    expect(getButtonVisualState(showingState, 5)).toBe("idle");
  });

  it.each<GameStatus>(["idle", "ready", "waitingInput"])(
    "treats every id as idle when status is %s, even if it is in the sequence",
    (status) => {
      const state: GameEngineState = {
        status,
        level: 1,
        round: 1,
        sequence: [3, 7],
        selectedIds: [],
        wrongButtonId: null,
      };

      expect(getButtonVisualState(state, 3)).toBe("idle");
    },
  );

  it("marks selected ids as selected during waitingInput", () => {
    const state: GameEngineState = {
      status: "waitingInput",
      level: 1,
      round: 1,
      sequence: [3, 7],
      selectedIds: [3],
      wrongButtonId: null,
    };

    expect(getButtonVisualState(state, 3)).toBe("selected");
    expect(getButtonVisualState(state, 7)).toBe("idle");
  });

  it("marks only the offending id as wrong during gameOver, never revealing the rest of the sequence", () => {
    const state: GameEngineState = {
      status: "gameOver",
      level: 1,
      round: 1,
      sequence: [3, 7],
      selectedIds: [3],
      wrongButtonId: 9,
    };

    expect(getButtonVisualState(state, 9)).toBe("wrong");
    expect(getButtonVisualState(state, 3)).toBe("selected");
    // 7 belongs to the drawn sequence but was never clicked — must stay idle, not be revealed.
    expect(getButtonVisualState(state, 7)).toBe("idle");
  });
});

describe("canInteract", () => {
  it.each<GameStatus>(["idle", "ready", "showingSequence", "gameOver", "victory"])(
    "returns false when status is %s",
    (status) => {
      expect(
        canInteract({
          status,
          level: 1,
          round: 1,
          sequence: [],
          selectedIds: [],
          wrongButtonId: null,
        }),
      ).toBe(false);
    },
  );

  it("returns true only when status is waitingInput", () => {
    expect(
      canInteract({
        status: "waitingInput",
        level: 1,
        round: 1,
        sequence: [],
        selectedIds: [],
        wrongButtonId: null,
      }),
    ).toBe(true);
  });
});

describe("isSubmitEnabled", () => {
  it.each(Array.from({ length: 12 }, (_, i) => i + 1))(
    "is false until all %i selected ids match the sequence, then true",
    (n) => {
      const sequence = Array.from({ length: n }, (_, i) => i + 1);

      for (let selectedCount = 0; selectedCount < n; selectedCount++) {
        const state: GameEngineState = {
          status: "waitingInput",
          level: n,
          round: 1,
          sequence,
          selectedIds: sequence.slice(0, selectedCount),
          wrongButtonId: null,
        };
        expect(isSubmitEnabled(state)).toBe(false);
      }

      const complete: GameEngineState = {
        status: "waitingInput",
        level: n,
        round: 1,
        sequence,
        selectedIds: sequence,
        wrongButtonId: null,
      };
      expect(isSubmitEnabled(complete)).toBe(true);
    },
  );

  it.each<GameStatus>(["gameOver", "victory"])(
    "is false outside waitingInput (status %s) even when selection length matches the sequence",
    (status) => {
      const state: GameEngineState = {
        status,
        level: 1,
        round: 1,
        sequence: [3],
        selectedIds: [3],
        wrongButtonId: status === "gameOver" ? 9 : null,
      };

      expect(isSubmitEnabled(state)).toBe(false);
    },
  );
});
