import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Logo } from "./Logo";

describe("Logo", () => {
  it("renders the FlashTap wordmark as a heading", () => {
    render(<Logo />);
    expect(screen.getByRole("heading", { name: "FlashTap" })).toBeInTheDocument();
  });
});
