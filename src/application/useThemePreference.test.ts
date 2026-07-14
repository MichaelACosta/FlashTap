import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { readPreferences, writePreferences } from "@/infrastructure";
import { useThemePreference } from "./useThemePreference";

vi.mock("@/infrastructure", () => ({
  readPreferences: vi.fn(),
  writePreferences: vi.fn(),
}));

const readPreferencesMock = vi.mocked(readPreferences);
const writePreferencesMock = vi.mocked(writePreferences);

beforeEach(() => {
  readPreferencesMock.mockReset();
  writePreferencesMock.mockReset();
});

describe("useThemePreference (US-20)", () => {
  it("has no manual preference when nothing is stored", () => {
    readPreferencesMock.mockReturnValue({ themeMode: null });

    const { result } = renderHook(() => useThemePreference());

    expect(result.current.themeModePreference).toBeNull();
  });

  it("reflects the stored manual preference", () => {
    readPreferencesMock.mockReturnValue({ themeMode: "dark" });

    const { result } = renderHook(() => useThemePreference());

    expect(result.current.themeModePreference).toBe("dark");
  });

  it("persists a new manual preference and reflects it", () => {
    readPreferencesMock.mockReturnValue({ themeMode: null });

    const { result } = renderHook(() => useThemePreference());

    readPreferencesMock.mockReturnValue({ themeMode: "dark" });
    act(() => {
      result.current.setThemeModePreference("dark");
    });

    expect(writePreferencesMock).toHaveBeenCalledWith({ themeMode: "dark" });
    expect(result.current.themeModePreference).toBe("dark");
  });
});
