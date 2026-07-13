import { useCallback, useSyncExternalStore } from "react";
import { readTutorialSeen, writeTutorialSeen } from "@/infrastructure";

const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function notifyListeners(): void {
  listeners.forEach((listener) => listener());
}

function getSnapshot(): boolean {
  return readTutorialSeen();
}

function getServerSnapshot(): boolean {
  return true;
}

export type UseTutorialFlagResult = {
  shouldShowTutorial: boolean;
  dismissTutorial: () => void;
};

export function useTutorialFlag(): UseTutorialFlagResult {
  const tutorialSeen = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const dismissTutorial = useCallback(() => {
    writeTutorialSeen(true);
    notifyListeners();
  }, []);

  return { shouldShowTutorial: !tutorialSeen, dismissTutorial };
}
