import { z } from "zod";
import { readLocalStorageValue, writeLocalStorageValue } from "./localStorage";

const TUTORIAL_SEEN_KEY = "flashtap:v1:tutorial-seen";
const tutorialSeenSchema = z.boolean();
const TUTORIAL_SEEN_FALLBACK = false;

export function readTutorialSeen(): boolean {
  return readLocalStorageValue(TUTORIAL_SEEN_KEY, tutorialSeenSchema, TUTORIAL_SEEN_FALLBACK);
}

export function writeTutorialSeen(seen: boolean): void {
  writeLocalStorageValue(TUTORIAL_SEEN_KEY, seen);
}
