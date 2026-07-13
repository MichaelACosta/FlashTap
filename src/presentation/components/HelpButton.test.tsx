import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { HelpButton } from "./HelpButton";

describe("HelpButton", () => {
  it("renders an accessible help button", () => {
    render(<HelpButton onClick={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Como jogar" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(<HelpButton onClick={onClick} />);
    fireEvent.click(screen.getByRole("button", { name: "Como jogar" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
