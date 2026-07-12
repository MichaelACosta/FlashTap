import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { HomePage } from "./HomePage";

vi.mock("@/application", () => ({
  useLocalRecord: () => ({ record: null }),
}));

describe("HomePage", () => {
  it("renders the logo, the Jogar CTA and the record chip (US-01/US-02)", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: "FlashTap" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Jogar" })).toHaveAttribute("href", "/jogo");
    expect(screen.getByText("Melhor recorde")).toBeInTheDocument();
    expect(screen.getByText("—")).toBeInTheDocument();
  });
});
