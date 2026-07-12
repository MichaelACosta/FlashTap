import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AppBadge } from "./AppBadge";

describe("AppBadge", () => {
  it("renders the label it receives via props", () => {
    render(<AppBadge label="FlashTap" />);
    expect(screen.getByText("FlashTap")).toBeInTheDocument();
  });
});
