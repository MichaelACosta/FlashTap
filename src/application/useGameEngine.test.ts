import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useGameEngine } from "./useGameEngine";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useGameEngine", () => {
  it("starts idle with all 12 buttons idle and disabled", () => {
    const { result } = renderHook(() => useGameEngine());

    expect(result.current.status).toBe("idle");
    expect(result.current.board).toHaveLength(12);
    result.current.board.forEach((button) => {
      expect(button.state).toBe("idle");
      expect(button.disabled).toBe(true);
    });
  });

  it("moves to ready when startGame is called", () => {
    const { result } = renderHook(() => useGameEngine());

    act(() => result.current.startGame());

    expect(result.current.status).toBe("ready");
  });

  it("shows exactly N buttons (N = level) as showing and disabled after the ready countdown", () => {
    const { result } = renderHook(() => useGameEngine());

    act(() => result.current.startGame());
    act(() => vi.advanceTimersByTime(1500));

    expect(result.current.status).toBe("showingSequence");
    const showing = result.current.board.filter((b) => b.state === "showing");
    expect(showing).toHaveLength(1);
    result.current.board.forEach((button) => expect(button.disabled).toBe(true));
  });

  it("hides the sequence and releases interaction after the exhibition time", () => {
    const { result } = renderHook(() => useGameEngine());

    act(() => result.current.startGame());
    act(() => vi.advanceTimersByTime(1500));
    act(() => vi.advanceTimersByTime(1100));

    expect(result.current.status).toBe("waitingInput");
    result.current.board.forEach((button) => {
      expect(button.state).toBe("idle");
      expect(button.disabled).toBe(false);
    });
  });

  it("does not throw when unmounted with a pending timer", () => {
    const { result, unmount } = renderHook(() => useGameEngine());

    act(() => result.current.startGame());

    expect(() => unmount()).not.toThrow();
  });

  it("exposes progress and distance from the very start", () => {
    const { result } = renderHook(() => useGameEngine());

    expect(result.current.progress).toBe("1.1");
    expect(result.current.distance).toBe("11 níveis e 4 rodadas");
    expect(result.current.isSubmitEnabled).toBe(false);
  });

  describe("once waiting for input (level 1, sequence length 1)", () => {
    function reachWaitingInput(result: { current: ReturnType<typeof useGameEngine> }) {
      act(() => result.current.startGame());
      act(() => vi.advanceTimersByTime(1500));
      const correctId = result.current.board.find((b) => b.state === "showing")!.id;
      act(() => vi.advanceTimersByTime(1100));
      return correctId;
    }

    it("marks the correct button selected and disabled, enabling submit", () => {
      const { result } = renderHook(() => useGameEngine());
      const correctId = reachWaitingInput(result);

      act(() => result.current.selectButton(correctId));

      const button = result.current.board.find((b) => b.id === correctId);
      expect(button?.state).toBe("selected");
      expect(button?.disabled).toBe(true);
      expect(result.current.isSubmitEnabled).toBe(true);
      expect(result.current.status).toBe("waitingInput");
    });

    it("ignores a repeated click on the same selected button", () => {
      const { result } = renderHook(() => useGameEngine());
      const correctId = reachWaitingInput(result);

      act(() => result.current.selectButton(correctId));
      const afterFirst = result.current.board;
      act(() => result.current.selectButton(correctId));

      expect(result.current.board).toEqual(afterFirst);
    });

    it("ends the match and disables the whole board on a wrong click", () => {
      const { result } = renderHook(() => useGameEngine());
      const correctId = reachWaitingInput(result);
      const wrongId = result.current.board.find((b) => b.id !== correctId)!.id;

      act(() => result.current.selectButton(wrongId));

      expect(result.current.status).toBe("gameOver");
      const wrongButton = result.current.board.find((b) => b.id === wrongId);
      expect(wrongButton?.state).toBe("wrong");
      result.current.board.forEach((button) => expect(button.disabled).toBe(true));
      expect(result.current.isSubmitEnabled).toBe(false);
    });
  });
});
