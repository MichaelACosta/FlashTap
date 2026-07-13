import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { HomePage } from "./HomePage";

const { useTutorialFlagMock, dismissTutorial } = vi.hoisted(() => ({
  dismissTutorial: vi.fn(),
  useTutorialFlagMock: vi.fn(),
}));

vi.mock("@/application", () => ({
  useLocalRecord: () => ({ record: null }),
  useTutorialFlag: useTutorialFlagMock,
}));

beforeEach(() => {
  dismissTutorial.mockClear();
  useTutorialFlagMock.mockReturnValue({ shouldShowTutorial: false, dismissTutorial });
});

describe("HomePage", () => {
  it("renders the logo, the Jogar CTA and the record chip (US-01/US-02)", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: "FlashTap" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Jogar" })).toHaveAttribute("href", "/jogo");
    expect(screen.getByText("Melhor recorde")).toBeInTheDocument();
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("shows the How To Play modal automatically when the tutorial has not been seen (US-03)", () => {
    useTutorialFlagMock.mockReturnValue({ shouldShowTutorial: true, dismissTutorial });

    render(<HomePage />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Como jogar")).toBeInTheDocument();
  });

  it("does not show the modal when the tutorial flag is already seen", () => {
    render(<HomePage />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("dismisses the tutorial when the modal is closed", () => {
    useTutorialFlagMock.mockReturnValue({ shouldShowTutorial: true, dismissTutorial });

    render(<HomePage />);
    fireEvent.click(screen.getByRole("button", { name: "Entendi" }));

    expect(dismissTutorial).toHaveBeenCalledTimes(1);
  });
});
