import { z } from "zod";
import type { LocalRecord } from "@/domain";
import { readLocalStorageValue, writeLocalStorageValue } from "./localStorage";

const RECORD_KEY = "flashtap:v1:record";

const recordSchema = z.object({
  level: z.number().int().min(1),
  round: z.number().int().min(1),
  tempoMs: z.number().min(0),
}) satisfies z.ZodType<LocalRecord>;

export function readRecord(): LocalRecord | null {
  return readLocalStorageValue(RECORD_KEY, recordSchema.nullable(), null);
}

export function writeRecord(record: LocalRecord): void {
  writeLocalStorageValue(RECORD_KEY, record);
}
