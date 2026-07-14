import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { readAnalyticsConsent, writeAnalyticsConsent } from "@/infrastructure";
import { useAnalyticsConsent } from "./useAnalyticsConsent";

vi.mock("@/infrastructure", () => ({
  readAnalyticsConsent: vi.fn(),
  writeAnalyticsConsent: vi.fn(),
}));

const readAnalyticsConsentMock = vi.mocked(readAnalyticsConsent);
const writeAnalyticsConsentMock = vi.mocked(writeAnalyticsConsent);

beforeEach(() => {
  readAnalyticsConsentMock.mockReset();
  writeAnalyticsConsentMock.mockReset();
});

describe("useAnalyticsConsent (US-24)", () => {
  it("has no decision yet by default", () => {
    readAnalyticsConsentMock.mockReturnValue(null);

    const { result } = renderHook(() => useAnalyticsConsent());

    expect(result.current.consent).toBeNull();
  });

  it("persists and reflects acceptance", () => {
    readAnalyticsConsentMock.mockReturnValue(null);

    const { result } = renderHook(() => useAnalyticsConsent());

    readAnalyticsConsentMock.mockReturnValue("accepted");
    act(() => result.current.acceptAnalytics());

    expect(writeAnalyticsConsentMock).toHaveBeenCalledWith("accepted");
    expect(result.current.consent).toBe("accepted");
  });

  it("persists and reflects a decline", () => {
    readAnalyticsConsentMock.mockReturnValue(null);

    const { result } = renderHook(() => useAnalyticsConsent());

    readAnalyticsConsentMock.mockReturnValue("declined");
    act(() => result.current.declineAnalytics());

    expect(writeAnalyticsConsentMock).toHaveBeenCalledWith("declined");
    expect(result.current.consent).toBe("declined");
  });
});
