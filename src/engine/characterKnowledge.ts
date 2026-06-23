import type { GameState } from "../types";

export function getCharacterKnowledge(characterId: string, state: GameState) {
  return [...new Set([...(state.publicKnowledge ?? []), ...(state.characterKnowledge[characterId] ?? [])])];
}

export function knowsSecret(characterId: string, secretId: string, state: GameState) {
  return getCharacterKnowledge(characterId, state).includes(secretId);
}

export function getPublicGossip(state: GameState) {
  return state.gossipFeed.filter((message) => state.publicKnowledge.includes(message.id) || message.tone !== "clue");
}
