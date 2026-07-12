export type UseLocalRecordResult = {
  record: string | null;
};

// Mock temporário: leitura real do LocalStorage chega com US-17.
export function useLocalRecord(): UseLocalRecordResult {
  return { record: null };
}
