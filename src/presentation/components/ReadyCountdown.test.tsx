import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ReadyCountdown } from "./ReadyCountdown";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("ReadyCountdown", () => {
  it("counts down 3, 2, 1 over the given duration and stops at 1", () => {
    render(<ReadyCountdown durationMs={1500} />);

    expect(screen.getByRole("status")).toHaveTextContent("3");

    act(() => vi.advanceTimersByTime(500));
    expect(screen.getByRole("status")).toHaveTextContent("2");

    act(() => vi.advanceTimersByTime(500));
    expect(screen.getByRole("status")).toHaveTextContent("1");

    act(() => vi.advanceTimersByTime(500));
    expect(screen.getByRole("status")).toHaveTextContent("1");
  });
});
