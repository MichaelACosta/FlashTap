import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { HowToPlayModal } from "./HowToPlayModal";

describe("HowToPlayModal", () => {
  it("does not render when open is false", () => {
    render(<HowToPlayModal open={false} onClose={vi.fn()} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders the title and instructions when open is true", () => {
    render(<HowToPlayModal open onClose={vi.fn()} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Como jogar")).toBeInTheDocument();
  });

  it("calls onClose when the Entendi button is clicked", () => {
    const onClose = vi.fn();
    render(<HowToPlayModal open onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "Entendi" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape is pressed", () => {
    const onClose = vi.fn();
    render(<HowToPlayModal open onClose={onClose} />);
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape", code: "Escape", keyCode: 27 });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the close icon is clicked", () => {
    const onClose = vi.fn();
    render(<HowToPlayModal open onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "Fechar" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
