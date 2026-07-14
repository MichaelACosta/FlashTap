import { z } from "zod";
import { readLocalStorageValue, writeLocalStorageValue } from "./localStorage";

const CONSENT_KEY = "flashtap:v1:consent";

const consentSchema = z.enum(["accepted", "declined"]).nullable();

export type AnalyticsConsent = z.infer<typeof consentSchema>;

export function readAnalyticsConsent(): AnalyticsConsent {
  return readLocalStorageValue(CONSENT_KEY, consentSchema, null);
}

export function writeAnalyticsConsent(consent: "accepted" | "declined"): void {
  writeLocalStorageValue(CONSENT_KEY, consent);
}
