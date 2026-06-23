import { storylets } from "../data/storylets";
import type { GameState, Storylet } from "../types";
import { hashSeed, randomFromSeed } from "./random";

export function getAvailableStorylets(state: GameState, selectedCharacterId = state.currentPOVCharacterId, locationId?: string) {
  const character = state.characterSim[selectedCharacterId];
  if (!character) return [];

  return storylets
    .filter((storylet) => !locationId || storylet.locationId === locationId)
    .filter((storylet) => isPOVEligible(storylet, selectedCharacterId))
    .filter((storylet) => storylet.lifeStageTags.includes(character.lifeStage))
    .filter((storylet) => storylet.requiredWorldFlags.every((flag) => state.worldFlags.includes(flag)))
    .filter((storylet) => !storylet.blockedWorldFlags.some((flag) => state.worldFlags.includes(flag)))
    .filter((storylet) => isInTimeWindow(storylet, state.time.week))
    .filter((storylet) => !isOnCooldown(state, storylet))
    .sort((a, b) => scoreStorylet(b, state) - scoreStorylet(a, state))
    .slice(0, 4);
}

export function getStoryletById(id?: string) {
  return storylets.find((storylet) => storylet.id === id);
}

export function getLocationStorylets(state: GameState, locationId: string) {
  const pov = state.currentPOVCharacterId;
  return getAvailableStorylets(state, pov, locationId);
}

function isPOVEligible(storylet: Storylet, characterId: string) {
  return storylet.eligiblePOVCharacters === "any" || storylet.eligiblePOVCharacters.includes(characterId);
}

function isInTimeWindow(storylet: Storylet, week: number) {
  if (!storylet.timeWindow) return true;
  return (storylet.timeWindow.startWeek === undefined || week >= storylet.timeWindow.startWeek) && (storylet.timeWindow.endWeek === undefined || week <= storylet.timeWindow.endWeek);
}

function isOnCooldown(state: GameState, storylet: Storylet) {
  const recent = state.recaps
    .slice(-storylet.cooldownWeeks)
    .some((recap) => recap.title === storylet.title || recap.recapLine.includes(storylet.title));
  return recent;
}

function scoreStorylet(storylet: Storylet, state: GameState) {
  const random = randomFromSeed(hashSeed(`${state.seed}:${state.time.week}:${storylet.id}`));
  const urgency = storylet.timeSensitive ? 12 : 0;
  const tagMatch = storylet.storyTags.some((tag) => state.characterSim[state.currentPOVCharacterId]?.currentStorylineTags.includes(tag)) ? 8 : 0;
  return storylet.priority + urgency + tagMatch + random() * 10 - storylet.rarity;
}
