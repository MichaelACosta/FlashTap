import { render, screen, fireEvent } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useThemePreference } from "@/application";
import { ThemeProvider } from "./ThemeProvider";
import { useThemeMode } from "./ThemeModeContext";

vi.mock("@/application", () => ({
  useThemePreference: vi.fn(),
}));

const useThemePreferenceMock = vi.mocked(useThemePreference);

function mockMatchMedia(matches: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({
      matches,
      media: "(prefers-color-scheme: dark)",
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  );
}

function ModeConsumer() {
  const { mode, toggleMode } = useThemeMode();
  return (
    <button type="button" onClick={toggleMode}>
      {mode}
    </button>
  );
}

beforeEach(() => {
  document.documentElement.removeAttribute("data-theme");
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("ThemeProvider (US-19/US-20)", () => {
  it("uses the system theme when there is no manual preference", () => {
    mockMatchMedia(true);
    const setThemeModePreference = vi.fn();
    useThemePreferenceMock.mockReturnValue({
      themeModePreference: null,
      setThemeModePreference,
    });

    render(
      <ThemeProvider>
        <ModeConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByRole("button")).toHaveTextContent("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("prioritizes the manual preference over the system theme", () => {
    mockMatchMedia(true);
    const setThemeModePreference = vi.fn();
    useThemePreferenceMock.mockReturnValue({
      themeModePreference: "light",
      setThemeModePreference,
    });

    render(
      <ThemeProvider>
        <ModeConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByRole("button")).toHaveTextContent("light");
  });

  it("persists the opposite mode when toggled manually", () => {
    mockMatchMedia(false);
    const setThemeModePreference = vi.fn();
    useThemePreferenceMock.mockReturnValue({
      themeModePreference: "light",
      setThemeModePreference,
    });

    render(
      <ThemeProvider>
        <ModeConsumer />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByRole("button"));

    expect(setThemeModePreference).toHaveBeenCalledWith("dark");
  });
});
