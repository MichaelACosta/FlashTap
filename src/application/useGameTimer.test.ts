import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { GameStatus } from "@/domain";
import { useGameTimer } from "./useGameTimer";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useGameTimer (GRS §18)", () => {
  it("does not run while idle or ready", () => {
    const { result, rerender } = renderHook(({ status }) => useGameTimer(status), {
      initialProps: { status: "idle" as GameStatus },
    });
    expect(result.current.elapsedMs).toBe(0);

    rerender({ status: "ready" });
    act(() => vi.advanceTimersByTime(1500));
    expect(result.current.elapsedMs).toBe(0);
  });

  it("starts counting once showingSequence begins and keeps counting through waitingInput", () => {
    const { result, rerender } = renderHook(({ status }) => useGameTimer(status), {
      initialProps: { status: "showingSequence" as GameStatus },
    });

    act(() => vi.advanceTimersByTime(500));
    expect(result.current.elapsedMs).toBeCloseTo(500, -1);

    rerender({ status: "waitingInput" });
    act(() => vi.advanceTimersByTime(300));
    expect(result.current.elapsedMs).toBeCloseTo(800, -1);
  });

  it("never resets between rounds (showingSequence -> waitingInput -> showingSequence)", () => {
    const { result, rerender } = renderHook(({ status }) => useGameTimer(status), {
      initialProps: { status: "showingSequence" as GameStatus },
    });

    act(() => vi.advanceTimersByTime(400));
    rerender({ status: "waitingInput" });
    act(() => vi.advanceTimersByTime(400));
    rerender({ status: "showingSequence" });
    act(() => vi.advanceTimersByTime(400));

    expect(result.current.elapsedMs).toBeCloseTo(1200, -1);
  });

  it("stops and freezes the value on gameOver", () => {
    const { result, rerender } = renderHook(({ status }) => useGameTimer(status), {
      initialProps: { status: "waitingInput" as GameStatus },
    });

    act(() => vi.advanceTimersByTime(700));
    rerender({ status: "gameOver" });
    const frozen = result.current.elapsedMs;

    act(() => vi.advanceTimersByTime(2000));
    expect(result.current.elapsedMs).toBe(frozen);
  });

  it("stops and freezes the value on victory", () => {
    const { result, rerender } = renderHook(({ status }) => useGameTimer(status), {
      initialProps: { status: "waitingInput" as GameStatus },
    });

    act(() => vi.advanceTimersByTime(500));
    rerender({ status: "victory" });
    const frozen = result.current.elapsedMs;

    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.elapsedMs).toBe(frozen);
  });

  it("exposes reset() to zero the elapsed time and forget the previous accumulation (US-16 Jogar Novamente)", () => {
    const { result, rerender } = renderHook(({ status }) => useGameTimer(status), {
      initialProps: { status: "waitingInput" as GameStatus },
    });

    act(() => vi.advanceTimersByTime(500));
    expect(result.current.elapsedMs).toBeGreaterThan(0);

    act(() => result.current.reset());
    expect(result.current.elapsedMs).toBe(0);

    rerender({ status: "showingSequence" });
    act(() => vi.advanceTimersByTime(300));
    expect(result.current.elapsedMs).toBeCloseTo(300, -1);
  });
});
