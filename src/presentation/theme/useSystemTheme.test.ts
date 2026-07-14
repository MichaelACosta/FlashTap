import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useSystemTheme } from "./useSystemTheme";

type Listener = (event: MediaQueryListEvent) => void;

function mockMatchMedia(initialMatches: boolean) {
  let matches = initialMatches;
  const listeners = new Set<Listener>();

  const mql = {
    get matches() {
      return matches;
    },
    media: "(prefers-color-scheme: dark)",
    addEventListener: (_: "change", listener: Listener) => listeners.add(listener),
    removeEventListener: (_: "change", listener: Listener) => listeners.delete(listener),
  };

  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue(mql));

  return {
    setMatches(next: boolean) {
      matches = next;
      listeners.forEach((listener) => listener({ matches } as MediaQueryListEvent));
    },
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useSystemTheme (US-19)", () => {
  beforeEach(() => {
    mockMatchMedia(false);
  });

  it("detects light as the initial system theme", () => {
    const { result } = renderHook(() => useSystemTheme());
    expect(result.current).toBe("light");
  });

  it("detects dark as the initial system theme", () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useSystemTheme());
    expect(result.current).toBe("dark");
  });

  it("reacts live to a system theme change", () => {
    const media = mockMatchMedia(false);
    const { result } = renderHook(() => useSystemTheme());
    expect(result.current).toBe("light");

    act(() => media.setMatches(true));
    expect(result.current).toBe("dark");
  });
});
