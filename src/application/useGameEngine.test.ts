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
});
