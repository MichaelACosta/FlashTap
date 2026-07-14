import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { readRecord, writeRecord } from "@/infrastructure";
import { useLocalRecord } from "./useLocalRecord";

vi.mock("@/infrastructure", () => ({
  readRecord: vi.fn(),
  writeRecord: vi.fn(),
}));

const readRecordMock = vi.mocked(readRecord);
const writeRecordMock = vi.mocked(writeRecord);

beforeEach(() => {
  readRecordMock.mockReset();
  writeRecordMock.mockReset();
});

describe("useLocalRecord (US-17)", () => {
  it("returns null when there is no stored record", () => {
    readRecordMock.mockReturnValue(null);

    const { result } = renderHook(() => useLocalRecord());

    expect(result.current.record).toBeNull();
  });

  it("formats the stored record as level.round", () => {
    readRecordMock.mockReturnValue({ level: 7, round: 4, tempoMs: 12_000 });

    const { result } = renderHook(() => useLocalRecord());

    expect(result.current.record).toBe("7.4");
  });

  it("persists and reflects a new record when the candidate beats the current one", () => {
    let stored: { level: number; round: number; tempoMs: number } | null = {
      level: 3,
      round: 2,
      tempoMs: 20_000,
    };
    readRecordMock.mockImplementation(() => stored);
    writeRecordMock.mockImplementation((record) => {
      stored = record;
    });

    const { result } = renderHook(() => useLocalRecord());
    expect(result.current.record).toBe("3.2");

    act(() => {
      result.current.maybeUpdateRecord(5, 1, 8_000);
    });

    expect(writeRecordMock).toHaveBeenCalledTimes(1);
    expect(writeRecordMock).toHaveBeenCalledWith({ level: 5, round: 1, tempoMs: 8_000 });
    expect(result.current.record).toBe("5.1");
  });

  it("does not persist when the candidate does not beat the current record (near-tie by time, GRS §19)", () => {
    readRecordMock.mockReturnValue({ level: 5, round: 4, tempoMs: 5000 });

    const { result } = renderHook(() => useLocalRecord());

    act(() => {
      result.current.maybeUpdateRecord(5, 4, 5001);
    });

    expect(writeRecordMock).not.toHaveBeenCalled();
  });
});
