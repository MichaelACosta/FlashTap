import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { readTutorialSeen, writeTutorialSeen } from "@/infrastructure";
import { useTutorialFlag } from "./useTutorialFlag";

vi.mock("@/infrastructure", () => ({
  readTutorialSeen: vi.fn(),
  writeTutorialSeen: vi.fn(),
}));

const readTutorialSeenMock = vi.mocked(readTutorialSeen);
const writeTutorialSeenMock = vi.mocked(writeTutorialSeen);

beforeEach(() => {
  readTutorialSeenMock.mockReset();
  writeTutorialSeenMock.mockReset();
});

describe("useTutorialFlag", () => {
  it("shows the tutorial when it has not been seen yet", () => {
    readTutorialSeenMock.mockReturnValue(false);

    const { result } = renderHook(() => useTutorialFlag());

    expect(result.current.shouldShowTutorial).toBe(true);
  });

  it("does not show the tutorial once it has already been seen", () => {
    readTutorialSeenMock.mockReturnValue(true);

    const { result } = renderHook(() => useTutorialFlag());

    expect(result.current.shouldShowTutorial).toBe(false);
  });

  it("persists the flag and hides the tutorial when dismissed", () => {
    readTutorialSeenMock.mockReturnValue(false);

    const { result } = renderHook(() => useTutorialFlag());
    expect(result.current.shouldShowTutorial).toBe(true);

    readTutorialSeenMock.mockReturnValue(true);
    act(() => {
      result.current.dismissTutorial();
    });

    expect(writeTutorialSeenMock).toHaveBeenCalledTimes(1);
    expect(writeTutorialSeenMock).toHaveBeenCalledWith(true);
    expect(result.current.shouldShowTutorial).toBe(false);
  });
});
