import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { JogoPage } from "./JogoPage";

const { useGameEngineMock, useLocalRecordMock, startGame, selectButton, submitRound, resetGame } =
  vi.hoisted(() => ({
    startGame: vi.fn(),
    selectButton: vi.fn(),
    submitRound: vi.fn(),
    resetGame: vi.fn(),
    useGameEngineMock: vi.fn(),
    useLocalRecordMock: vi.fn(),
  }));

vi.mock("@/application", () => ({
  useGameEngine: useGameEngineMock,
  useLocalRecord: useLocalRecordMock,
}));

function buildBoard(overrides: Partial<Record<number, { state: string; disabled: boolean }>> = {}) {
  return Array.from({ length: 12 }, (_, index) => {
    const id = index + 1;
    const override = overrides[id];
    return { id, state: override?.state ?? "idle", disabled: override?.disabled ?? true };
  });
}

function baseGameEngine(overrides: Record<string, unknown> = {}) {
  return {
    status: "idle",
    level: 1,
    round: 1,
    board: buildBoard(),
    readyCountdownMs: 1500,
    startGame,
    selectButton,
    submitRound,
    isSubmitEnabled: false,
    progress: "1.1",
    distance: "11 níveis e 4 rodadas",
    tempo: "00:00",
    resetGame,
    ...overrides,
  };
}

beforeEach(() => {
  startGame.mockClear();
  selectButton.mockClear();
  submitRound.mockClear();
  resetGame.mockClear();
  useGameEngineMock.mockReturnValue(baseGameEngine());
  useLocalRecordMock.mockReturnValue({ record: null });
});

describe("JogoPage", () => {
  it("renders a help button, with the modal closed by default, and starts the game on mount", () => {
    render(<JogoPage />);

    expect(screen.getByRole("button", { name: "Como jogar" })).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(startGame).toHaveBeenCalledTimes(1);
  });

  it("shows the ready countdown while status is ready (GRS §20)", () => {
    useGameEngineMock.mockReturnValue(baseGameEngine({ status: "ready" }));

    render(<JogoPage />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryAllByRole("button", { name: /^Botão/ })).toHaveLength(0);
  });

  it("shows the board with the showing button disabled while status is showingSequence (US-05)", () => {
    useGameEngineMock.mockReturnValue(
      baseGameEngine({
        status: "showingSequence",
        board: buildBoard({ 4: { state: "showing", disabled: true } }),
      }),
    );

    render(<JogoPage />);

    const showingButton = screen.getByRole("button", { name: "Botão 4, destacado" });
    expect(showingButton).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Enviar" })).not.toBeInTheDocument();
  });

  it("shows the board with all buttons enabled and a disabled Enviar while status is waitingInput (US-06/US-09)", () => {
    useGameEngineMock.mockReturnValue(
      baseGameEngine({
        status: "waitingInput",
        board: buildBoard({
          1: { state: "idle", disabled: false },
          2: { state: "idle", disabled: false },
        }),
        isSubmitEnabled: false,
      }),
    );

    render(<JogoPage />);

    expect(screen.getAllByRole("button", { name: /^Botão/ })).toHaveLength(12);
    expect(screen.getByRole("button", { name: "Botão 1" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Enviar" })).toBeDisabled();
  });

  it("calls selectButton when a board button is clicked during waitingInput (US-07)", () => {
    useGameEngineMock.mockReturnValue(
      baseGameEngine({
        status: "waitingInput",
        board: buildBoard({ 3: { state: "idle", disabled: false } }),
      }),
    );

    render(<JogoPage />);
    fireEvent.click(screen.getByRole("button", { name: "Botão 3" }));

    expect(selectButton).toHaveBeenCalledWith(3);
  });

  it("does not wire board clicks to selectButton outside waitingInput (defense in depth)", () => {
    useGameEngineMock.mockReturnValue(
      baseGameEngine({
        status: "showingSequence",
        board: buildBoard({ 3: { state: "idle", disabled: false } }),
      }),
    );

    render(<JogoPage />);
    fireEvent.click(screen.getByRole("button", { name: "Botão 3" }));

    expect(selectButton).not.toHaveBeenCalled();
  });

  it("enables Enviar when isSubmitEnabled is true (US-09)", () => {
    useGameEngineMock.mockReturnValue(
      baseGameEngine({ status: "waitingInput", isSubmitEnabled: true }),
    );

    render(<JogoPage />);

    expect(screen.getByRole("button", { name: "Enviar" })).toBeEnabled();
  });

  it("calls submitRound when Enviar is clicked (US-10)", () => {
    useGameEngineMock.mockReturnValue(
      baseGameEngine({ status: "waitingInput", isSubmitEnabled: true }),
    );

    render(<JogoPage />);
    fireEvent.click(screen.getByRole("button", { name: "Enviar" }));

    expect(submitRound).toHaveBeenCalledTimes(1);
  });

  it("shows the result summary and disables the whole board on gameOver, without an Enviar button (US-08)", () => {
    useLocalRecordMock.mockReturnValue({ record: "3.2" });
    useGameEngineMock.mockReturnValue(
      baseGameEngine({
        status: "gameOver",
        board: buildBoard({ 5: { state: "wrong", disabled: true } }),
        progress: "1.1",
        distance: "11 níveis e 4 rodadas",
      }),
    );

    render(<JogoPage />);

    expect(screen.getByRole("region", { name: "Fim de partida" })).toBeInTheDocument();
    expect(screen.getByText("1.1")).toBeInTheDocument();
    expect(screen.getByText("3.2")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Enviar" })).not.toBeInTheDocument();
    screen.getAllByRole("button", { name: /^Botão/ }).forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it("calls resetGame when 'Jogar novamente' is clicked after a game over (US-16)", () => {
    useGameEngineMock.mockReturnValue(baseGameEngine({ status: "gameOver" }));

    render(<JogoPage />);
    fireEvent.click(screen.getByRole("button", { name: "Jogar novamente" }));

    expect(resetGame).toHaveBeenCalledTimes(1);
  });

  it("shows the result summary and disables the whole board on victory, without an Enviar button (US-12)", () => {
    useLocalRecordMock.mockReturnValue({ record: "10.3" });
    useGameEngineMock.mockReturnValue(
      baseGameEngine({
        status: "victory",
        board: buildBoard(
          Object.fromEntries(
            Array.from({ length: 12 }, (_, i) => [i + 1, { state: "selected", disabled: true }]),
          ),
        ),
        progress: "12.5",
        distance: "Concluído",
      }),
    );

    render(<JogoPage />);

    expect(screen.getByRole("region", { name: "Vitória!" })).toBeInTheDocument();
    expect(screen.getByText("12.5")).toBeInTheDocument();
    expect(screen.getByText("Concluído")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Enviar" })).not.toBeInTheDocument();
    screen.getAllByRole("button", { name: /^Botão/ }).forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it("shows the running timer while the board is visible and passes it through to the result summary (US-13)", () => {
    useLocalRecordMock.mockReturnValue({ record: "3.2" });
    useGameEngineMock.mockReturnValue(
      baseGameEngine({ status: "gameOver", tempo: "00:42" }),
    );

    render(<JogoPage />);

    expect(screen.getByRole("timer", { name: "Tempo decorrido" })).toHaveTextContent("00:42");
    expect(screen.getAllByText("00:42")).toHaveLength(2);
  });

  it("opens the How To Play modal when the help button is clicked (US-04)", () => {
    render(<JogoPage />);

    fireEvent.click(screen.getByRole("button", { name: "Como jogar" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Como jogar")).toBeInTheDocument();
  });
});
