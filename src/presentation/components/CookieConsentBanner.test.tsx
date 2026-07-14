import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { CookieConsentBanner } from "./CookieConsentBanner";

describe("CookieConsentBanner (US-24)", () => {
  it("renders the consent dialog with accept and decline actions", () => {
    render(<CookieConsentBanner onAccept={vi.fn()} onDecline={vi.fn()} />);

    expect(
      screen.getByRole("dialog", { name: "Consentimento de cookies" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Aceitar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Recusar" })).toBeInTheDocument();
  });

  it("calls onAccept when Aceitar is clicked", () => {
    const onAccept = vi.fn();
    render(<CookieConsentBanner onAccept={onAccept} onDecline={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Aceitar" }));

    expect(onAccept).toHaveBeenCalledTimes(1);
  });

  it("calls onDecline when Recusar is clicked", () => {
    const onDecline = vi.fn();
    render(<CookieConsentBanner onAccept={vi.fn()} onDecline={onDecline} />);

    fireEvent.click(screen.getByRole("button", { name: "Recusar" }));

    expect(onDecline).toHaveBeenCalledTimes(1);
  });
});
