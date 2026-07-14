import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { GameButton } from "./GameButton";

describe("GameButton", () => {
  it("renders an idle button, enabled, with a plain aria-label", () => {
    render(<GameButton id={5} state="idle" disabled={false} />);

    const button = screen.getByRole("button", { name: "Botão 5" });
    expect(button).toBeEnabled();
    expect(button).toHaveAttribute("data-state", "idle");
  });

  it("renders a showing button as disabled with a distinguishing aria-label (GRS §8/§21)", () => {
    render(<GameButton id={5} state="showing" disabled={true} />);

    const button = screen.getByRole("button", { name: "Botão 5, destacado" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("data-state", "showing");
  });

  it("ignores clicks while disabled (Showing never accepts a click)", () => {
    const onClick = vi.fn();
    render(<GameButton id={5} state="showing" disabled={true} onClick={onClick} />);

    fireEvent.click(screen.getByRole("button", { name: "Botão 5, destacado" }));

    expect(onClick).not.toHaveBeenCalled();
  });

  it("calls onClick when enabled", () => {
    const onClick = vi.fn();
    render(<GameButton id={5} state="idle" disabled={false} onClick={onClick} />);

    fireEvent.click(screen.getByRole("button", { name: "Botão 5" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
