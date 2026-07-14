import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { useAnalyticsConsent } from "@/application";
import { AnalyticsGate } from "./AnalyticsGate";

vi.mock("@/application", () => ({
  useAnalyticsConsent: vi.fn(),
}));

const useAnalyticsConsentMock = vi.mocked(useAnalyticsConsent);

beforeEach(() => {
  useAnalyticsConsentMock.mockReset();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("AnalyticsGate (US-24)", () => {
  it("shows the consent banner when no decision has been made yet", () => {
    useAnalyticsConsentMock.mockReturnValue({
      consent: null,
      acceptAnalytics: vi.fn(),
      declineAnalytics: vi.fn(),
    });

    render(<AnalyticsGate />);

    expect(screen.getByRole("dialog", { name: "Consentimento de cookies" })).toBeInTheDocument();
  });

  it("hides the banner and does not load Clarity when the user declined", () => {
    vi.stubEnv("NEXT_PUBLIC_CLARITY_PROJECT_ID", "project-123");
    useAnalyticsConsentMock.mockReturnValue({
      consent: "declined",
      acceptAnalytics: vi.fn(),
      declineAnalytics: vi.fn(),
    });

    render(<AnalyticsGate />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.getElementById("clarity-analytics")).not.toBeInTheDocument();
  });

  it("does not load Clarity when accepted but no project id is configured", () => {
    vi.stubEnv("NEXT_PUBLIC_CLARITY_PROJECT_ID", "");
    useAnalyticsConsentMock.mockReturnValue({
      consent: "accepted",
      acceptAnalytics: vi.fn(),
      declineAnalytics: vi.fn(),
    });

    render(<AnalyticsGate />);

    expect(document.getElementById("clarity-analytics")).not.toBeInTheDocument();
  });

  it("loads Clarity once accepted and a project id is configured", () => {
    vi.stubEnv("NEXT_PUBLIC_CLARITY_PROJECT_ID", "project-123");
    useAnalyticsConsentMock.mockReturnValue({
      consent: "accepted",
      acceptAnalytics: vi.fn(),
      declineAnalytics: vi.fn(),
    });

    render(<AnalyticsGate />);

    expect(document.getElementById("clarity-analytics")).toBeInTheDocument();
  });
});
