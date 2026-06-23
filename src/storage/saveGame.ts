import type { GameState } from "../types";
import { SAVE_VERSION } from "../types";

const SAVE_KEY = "the-close-save-v3";
const LEGACY_SAVE_KEY = "the-close-save-v2";

export function saveGame(state: GameState) {
  localStorage.setItem(SAVE_KEY, JSON.stringify({ ...state, saveVersion: SAVE_VERSION, updatedAt: new Date().toISOString() }));
}

export function loadGame(): GameState | null {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as GameState;
    if (parsed.saveVersion !== SAVE_VERSION) {
      localStorage.removeItem(SAVE_KEY);
      return null;
    }
    return parsed;
  } catch {
    localStorage.removeItem(SAVE_KEY);
    return null;
  }
}

export function hasSave() {
  return Boolean(localStorage.getItem(SAVE_KEY));
}

export function hasLegacySave() {
  return Boolean(localStorage.getItem(LEGACY_SAVE_KEY));
}

export function clearSave() {
  localStorage.removeItem(SAVE_KEY);
  localStorage.removeItem(LEGACY_SAVE_KEY);
  localStorage.removeItem("the-close-save-v1");
}
