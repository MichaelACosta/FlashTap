import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { JogoPage } from "./JogoPage";

const { useGameEngineMock, startGame } = vi.hoisted(() => ({
  startGame: vi.fn(),
  useGameEngineMock: vi.fn(),
}));

vi.mock("@/application", () => ({
  useGameEngine: useGameEngineMock,
}));

function buildBoard(overrides: Partial<Record<number, { state: string; disabled: boolean }>> = {}) {
  return Array.from({ length: 12 }, (_, index) => {
    const id = index + 1;
    const override = overrides[id];
    return { id, state: override?.state ?? "idle", disabled: override?.disabled ?? true };
  });
}

beforeEach(() => {
  startGame.mockClear();
  useGameEngineMock.mockReturnValue({
    status: "idle",
    level: 1,
    round: 1,
    board: buildBoard(),
    readyCountdownMs: 1500,
    startGame,
  });
});

describe("JogoPage", () => {
  it("renders a help button, with the modal closed by default, and starts the game on mount", () => {
    render(<JogoPage />);

    expect(screen.getByRole("button", { name: "Como jogar" })).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(startGame).toHaveBeenCalledTimes(1);
  });

  it("shows the ready countdown while status is ready (GRS §20)", () => {
    useGameEngineMock.mockReturnValue({
      status: "ready",
      level: 1,
      round: 1,
      board: buildBoard(),
      readyCountdownMs: 1500,
      startGame,
    });

    render(<JogoPage />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryAllByRole("button", { name: /^Botão/ })).toHaveLength(0);
  });

  it("shows the board with the showing button disabled while status is showingSequence (US-05)", () => {
    useGameEngineMock.mockReturnValue({
      status: "showingSequence",
      level: 1,
      round: 1,
      board: buildBoard({ 4: { state: "showing", disabled: true } }),
      readyCountdownMs: 1500,
      startGame,
    });

    render(<JogoPage />);

    const showingButton = screen.getByRole("button", { name: "Botão 4, destacado" });
    expect(showingButton).toBeDisabled();
  });

  it("shows the board with all buttons enabled while status is waitingInput (US-06)", () => {
    useGameEngineMock.mockReturnValue({
      status: "waitingInput",
      level: 1,
      round: 1,
      board: buildBoard({
        1: { state: "idle", disabled: false },
        2: { state: "idle", disabled: false },
      }),
      readyCountdownMs: 1500,
      startGame,
    });

    render(<JogoPage />);

    expect(screen.getAllByRole("button", { name: /^Botão/ })).toHaveLength(12);
    expect(screen.getByRole("button", { name: "Botão 1" })).toBeEnabled();
  });

  it("opens the How To Play modal when the help button is clicked (US-04)", () => {
    render(<JogoPage />);

    fireEvent.click(screen.getByRole("button", { name: "Como jogar" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Como jogar")).toBeInTheDocument();
  });
});
