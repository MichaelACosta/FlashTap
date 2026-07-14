import { useCallback, useSyncExternalStore } from "react";
import { formatProgress, isNewRecord, type LocalRecord } from "@/domain";
import { readRecord, writeRecord } from "@/infrastructure";

const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function notifyListeners(): void {
  listeners.forEach((listener) => listener());
}

// Returns a formatted string (not the raw object) so useSyncExternalStore can
// compare snapshots by value and avoid re-rendering (or looping) on every read.
function getSnapshot(): string | null {
  const stored = readRecord();
  return stored ? formatProgress(stored.level, stored.round) : null;
}

function getServerSnapshot(): string | null {
  return null;
}

export type UseLocalRecordResult = {
  record: string | null;
  maybeUpdateRecord: (level: number, round: number, tempoMs: number) => void;
};

// US-17: recorde real, persistido em flashtap:v1:record (ADR-008).
export function useLocalRecord(): UseLocalRecordResult {
  const record = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const maybeUpdateRecord = useCallback((level: number, round: number, tempoMs: number) => {
    const candidate: LocalRecord = { level, round, tempoMs };
    if (isNewRecord(candidate, readRecord())) {
      writeRecord(candidate);
      notifyListeners();
    }
  }, []);

  return { record, maybeUpdateRecord };
}
