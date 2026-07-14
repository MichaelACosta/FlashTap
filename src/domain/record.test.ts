import { describe, expect, it } from "vitest";
import { isNewRecord, type LocalRecord } from "./record";

describe("isNewRecord (GRS §19)", () => {
  it("is always a new record when there is no current record", () => {
    const candidate: LocalRecord = { level: 1, round: 1, tempoMs: 9999 };
    expect(isNewRecord(candidate, null)).toBe(true);
  });

  it("is a new record when the level is higher, regardless of time", () => {
    const current: LocalRecord = { level: 3, round: 5, tempoMs: 1000 };
    const candidate: LocalRecord = { level: 4, round: 1, tempoMs: 999_999 };
    expect(isNewRecord(candidate, current)).toBe(true);
  });

  it("is not a new record when the level is lower, regardless of time", () => {
    const current: LocalRecord = { level: 4, round: 1, tempoMs: 999_999 };
    const candidate: LocalRecord = { level: 3, round: 5, tempoMs: 1 };
    expect(isNewRecord(candidate, current)).toBe(false);
  });

  it("is a new record when the level ties but the round is higher", () => {
    const current: LocalRecord = { level: 3, round: 2, tempoMs: 1000 };
    const candidate: LocalRecord = { level: 3, round: 3, tempoMs: 999_999 };
    expect(isNewRecord(candidate, current)).toBe(true);
  });

  it("is not a new record when the level ties but the round is lower", () => {
    const current: LocalRecord = { level: 3, round: 3, tempoMs: 999_999 };
    const candidate: LocalRecord = { level: 3, round: 2, tempoMs: 1 };
    expect(isNewRecord(candidate, current)).toBe(false);
  });

  it("breaks a tie in progress (same level and round) by a lower elapsed time", () => {
    const current: LocalRecord = { level: 5, round: 4, tempoMs: 5000 };
    const fasterCandidate: LocalRecord = { level: 5, round: 4, tempoMs: 4999 };
    const slowerCandidate: LocalRecord = { level: 5, round: 4, tempoMs: 5001 };

    expect(isNewRecord(fasterCandidate, current)).toBe(true);
    expect(isNewRecord(slowerCandidate, current)).toBe(false);
  });

  it("is not a new record on an exact tie (same progress, same time)", () => {
    const current: LocalRecord = { level: 5, round: 4, tempoMs: 5000 };
    const candidate: LocalRecord = { level: 5, round: 4, tempoMs: 5000 };
    expect(isNewRecord(candidate, current)).toBe(false);
  });
});
