import { useCallback, useSyncExternalStore } from "react";
import { readAnalyticsConsent, writeAnalyticsConsent, type AnalyticsConsent } from "@/infrastructure";

const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function notifyListeners(): void {
  listeners.forEach((listener) => listener());
}

function getSnapshot(): AnalyticsConsent {
  return readAnalyticsConsent();
}

function getServerSnapshot(): AnalyticsConsent {
  return null;
}

export type UseAnalyticsConsentResult = {
  consent: AnalyticsConsent;
  acceptAnalytics: () => void;
  declineAnalytics: () => void;
};

// US-24: consentimento de cookies (LGPD) — bloqueia o Clarity até aceite explícito.
export function useAnalyticsConsent(): UseAnalyticsConsentResult {
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const acceptAnalytics = useCallback(() => {
    writeAnalyticsConsent("accepted");
    notifyListeners();
  }, []);

  const declineAnalytics = useCallback(() => {
    writeAnalyticsConsent("declined");
    notifyListeners();
  }, []);

  return { consent, acceptAnalytics, declineAnalytics };
}
