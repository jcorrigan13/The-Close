import type { GameState } from "../types";

const SAVE_KEY = "the-close-save-v1";

export function saveGame(state: GameState) {
  localStorage.setItem(SAVE_KEY, JSON.stringify({ ...state, updatedAt: new Date().toISOString() }));
}

export function loadGame(): GameState | null {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as GameState;
  } catch {
    localStorage.removeItem(SAVE_KEY);
    return null;
  }
}

export function hasSave() {
  return Boolean(localStorage.getItem(SAVE_KEY));
}

export function clearSave() {
  localStorage.removeItem(SAVE_KEY);
}
