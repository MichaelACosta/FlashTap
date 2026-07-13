import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { JogoPage } from "./JogoPage";

describe("JogoPage", () => {
  it("renders the placeholder and a help button, with the modal closed by default", () => {
    render(<JogoPage />);

    expect(
      screen.getByText("O motor de jogo chega nas próximas features (F3)."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Como jogar" })).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens the How To Play modal when the help button is clicked (US-04)", () => {
    render(<JogoPage />);

    fireEvent.click(screen.getByRole("button", { name: "Como jogar" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Como jogar")).toBeInTheDocument();
  });
});
