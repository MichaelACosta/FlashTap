import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ResultSummary } from "./ResultSummary";

describe("ResultSummary (GRS §16)", () => {
  it("renders progress, distance, time and record fields", () => {
    render(
      <ResultSummary
        outcome="gameOver"
        progress="1.1"
        distance="11 níveis e 4 rodadas"
        tempo="00:12"
        record="3.2"
        onPlayAgain={vi.fn()}
      />,
    );

    expect(screen.getByRole("region", { name: "Fim de partida" })).toBeInTheDocument();
    expect(screen.getByText("1.1")).toBeInTheDocument();
    expect(screen.getByText("11 níveis e 4 rodadas")).toBeInTheDocument();
    expect(screen.getByText("00:12")).toBeInTheDocument();
    expect(screen.getByText("3.2")).toBeInTheDocument();
  });

  it("renders '—' for tempo and record when they are null", () => {
    render(
      <ResultSummary
        outcome="gameOver"
        progress="1.1"
        distance="11 níveis e 4 rodadas"
        tempo={null}
        record={null}
        onPlayAgain={vi.fn()}
      />,
    );

    expect(screen.getAllByText("—")).toHaveLength(2);
  });

  it("uses a distinct region name and title for victory, not reading as a defeat (US-15)", () => {
    render(
      <ResultSummary
        outcome="victory"
        progress="12.5"
        distance="Concluído"
        tempo="04:30"
        record="12.5"
        onPlayAgain={vi.fn()}
      />,
    );

    expect(screen.getByRole("region", { name: "Vitória!" })).toBeInTheDocument();
    expect(screen.queryByText("Fim de partida")).not.toBeInTheDocument();
  });

  it("renders a 'Jogar novamente' button and calls onPlayAgain when clicked (US-16)", () => {
    const onPlayAgain = vi.fn();
    render(
      <ResultSummary
        outcome="gameOver"
        progress="1.1"
        distance="11 níveis e 4 rodadas"
        tempo={null}
        record={null}
        onPlayAgain={onPlayAgain}
      />,
    );

    const button = screen.getByRole("button", { name: "Jogar novamente" });
    fireEvent.click(button);

    expect(onPlayAgain).toHaveBeenCalledTimes(1);
  });
});
