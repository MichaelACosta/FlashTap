import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ThemeToggle } from "./ThemeToggle";

describe("ThemeToggle (US-20)", () => {
  it("offers to switch to dark mode while in light mode", () => {
    render(<ThemeToggle mode="light" onClick={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Ativar tema escuro" })).toBeInTheDocument();
  });

  it("offers to switch to light mode while in dark mode", () => {
    render(<ThemeToggle mode="dark" onClick={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Ativar tema claro" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(<ThemeToggle mode="light" onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
