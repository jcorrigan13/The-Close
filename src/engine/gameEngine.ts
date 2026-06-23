import { characters } from "../data/characters";
import { endings } from "../data/endings";
import { gossipMessages } from "../data/gossip";
import { episodes } from "../data/longEpisodes";
import { startingStats } from "../data/options";
import type {
  ChoiceResult,
  Ending,
  Episode,
  EpisodeScene,
  GameState,
  Player,
  Relationship,
  RelationshipLabel,
  SceneChoice,
  Stats,
} from "../types";
import { SAVE_VERSION } from "../types";

const clamp = (value: number) => Math.max(0, Math.min(100, value));

export function createNewGame(player: Player): GameState {
  const now = new Date().toISOString();
  return {
    saveVersion: SAVE_VERSION,
    player,
    stats: tuneStartingStats(player),
    currentEpisodeNumber: 1,
    currentSceneId: "e1-s1",
    relationships: createInitialRelationships(),
    flags: [`ambition_${slug(player.ambition)}`, `background_${player.background}`, `trait_${player.trait}`],
    discoveredSecrets: [],
    parenthood: { route: "none", children: [] },
    recaps: [],
    activeHookIds: ["who-knew-arrival"],
    resolvedHookIds: [],
    gossipFeed: gossipMessages.filter((message) => message.id === "luggage-judgement"),
    storyArcProgress: {},
    futureLocks: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function getCurrentEpisode(state: GameState): Episode | undefined {
  return episodes.find((episode) => episode.episodeNumber === state.currentEpisodeNumber);
}

export function getEpisodeByNumber(episodeNumber: number) {
  return episodes.find((episode) => episode.episodeNumber === episodeNumber);
}

export function getCurrentScene(state: GameState): EpisodeScene | undefined {
  const episode = getCurrentEpisode(state);
  return episode?.scenes.find((scene) => scene.id === state.currentSceneId) ?? episode?.scenes[0];
}

export function applySceneChoice(state: GameState, episodeId: string, sceneId: string, choice: SceneChoice): GameState {
  const episode = episodes.find((item) => item.id === episodeId);
  const scene = episode?.scenes.find((item) => item.id === sceneId);
  if (!episode || !scene) {
    return state;
  }

  const flags = new Set(state.flags);
  choice.flagsRemoved.forEach((flag) => flags.delete(flag));
  choice.flagsAdded.forEach((flag) => flags.add(flag));

  const discoveredSecrets = new Set(state.discoveredSecrets);
  choice.discoveredSecrets?.forEach((secret) => discoveredSecrets.add(secret));

  const stats = { ...state.stats };
  Object.entries(choice.statChanges).forEach(([key, delta]) => {
    stats[key as keyof Stats] = clamp(stats[key as keyof Stats] + (delta ?? 0));
  });

  const relationships = { ...state.relationships };
  Object.entries(choice.relationshipChanges).forEach(([characterId, delta]) => {
    const existing = relationships[characterId] ?? createRelationship(characterId);
    const score = clamp(existing.score + delta);
    const states = mergeStates(existing.states, choice.relationshipStateChanges?.[characterId] ?? []);
    relationships[characterId] = {
      ...existing,
      score,
      states,
      label: relationshipLabel(score, states, flags, characterId),
      lastChanged: choice.recapLine,
    };
  });

  Object.entries(choice.relationshipStateChanges ?? {}).forEach(([characterId, statesToAdd]) => {
    const existing = relationships[characterId] ?? createRelationship(characterId);
    const states = mergeStates(existing.states, statesToAdd);
    relationships[characterId] = {
      ...existing,
      states,
      label: relationshipLabel(existing.score, states, flags, characterId),
      lastChanged: choice.recapLine,
    };
  });

  const activeHookIds = new Set(state.activeHookIds);
  choice.hooksUnlocked?.forEach((hookId) => activeHookIds.add(hookId));

  const futureLocks = new Set(state.futureLocks);
  choice.futureLocks?.forEach((lock) => futureLocks.add(lock));

  const storyArcProgress = { ...state.storyArcProgress };
  Object.entries(choice.storyArcProgressChanges ?? {}).forEach(([arc, delta]) => {
    storyArcProgress[arc] = (storyArcProgress[arc] ?? 0) + delta;
  });

  const gossipFeed = mergeGossip(state.gossipFeed, choice.gossipUnlocked ?? []);
  const nextSceneId = choice.nextSceneId ?? scene.defaultNextSceneId;
  const completingEpisode = !nextSceneId;
  const nextEpisodeNumber = completingEpisode ? episode.episodeNumber + 1 : episode.episodeNumber;
  const nextEpisode = episodes.find((item) => item.episodeNumber === nextEpisodeNumber);
  const nextScene = completingEpisode ? nextEpisode?.scenes[0]?.id ?? "" : nextSceneId;
  const parenthood = applyParenthoodRoute(state, choice);
  const endingId = nextEpisodeNumber > 10 ? chooseEnding({ ...state, stats, flags: [...flags] })?.id : undefined;
  const result: ChoiceResult = {
    choiceLabel: choice.label,
    immediateResponseText: choice.immediateResponseText,
    statChanges: choice.statChanges,
    relationshipChanges: choice.relationshipChanges,
    relationshipStateChanges: choice.relationshipStateChanges ?? {},
    gossipUnlocked: choice.gossipUnlocked ?? [],
    hooksUnlocked: choice.hooksUnlocked ?? [],
    futureLocks: choice.futureLocks ?? [],
    recapLine: choice.recapLine,
  };

  return {
    ...state,
    stats,
    relationships,
    flags: [...flags],
    discoveredSecrets: [...discoveredSecrets],
    parenthood,
    currentEpisodeNumber: nextEpisodeNumber,
    currentSceneId: nextScene,
    recaps: [
      ...state.recaps,
      {
        episodeNumber: episode.episodeNumber,
        title: episode.title,
        sceneTitle: scene.sceneTitle,
        choiceLabel: choice.label,
        recapLine: choice.recapLine,
        resultText: choice.immediateResponseText,
      },
    ],
    activeHookIds: [...activeHookIds],
    gossipFeed,
    storyArcProgress,
    futureLocks: [...futureLocks],
    lastChoiceResult: result,
    endingId,
    updatedAt: new Date().toISOString(),
  };
}

export const applyChoice = applySceneChoice;

export function clearChoiceResult(state: GameState): GameState {
  return { ...state, lastChoiceResult: undefined };
}

export function chooseEnding(state: GameState): Ending {
  const eligible = endings
    .filter((ending) => !ending.ambition || ending.ambition === state.player.ambition)
    .filter((ending) => hasRequiredFlags(state, ending))
    .filter((ending) => hasRequiredStats(state, ending))
    .sort((a, b) => b.priority - a.priority);

  return eligible[0] ?? endings[endings.length - 1];
}

export function getEnding(state: GameState): Ending {
  return endings.find((ending) => ending.id === state.endingId) ?? chooseEnding(state);
}

export function getIslandPulse(state: GameState) {
  const pulse = [
    "The ferry is running 40 minutes late. Everyone has blamed the weather except Dev, who blamed the council out of habit.",
    "The Wee Shop has sold out of milk, rolls, and plausible deniability.",
    "The Selkie Arms is pretending tonight will be peaceful.",
  ];
  if (state.flags.includes("risky_jamie_flirt") || state.flags.includes("jamie_public_spark")) {
    pulse.push("Rowan House B&B is polite in the way that means absolutely not relaxed.");
  }
  if (state.activeHookIds.includes("pregnancy-rumour")) {
    pulse.push("Nobody has said the word pregnancy out loud, which means everyone is thinking it.");
  }
  if (state.activeHookIds.includes("anonymous-group-chat")) {
    pulse.push("A teenager deleted a group chat message. Too late.");
  }
  if (state.flags.includes("cam_exposed_publicly")) {
    pulse.push("Murray House has entered the phrase 'taken out of context' into active service.");
  }
  return pulse.slice(-5);
}

export function relationshipLabel(score: number, states: RelationshipLabel[], flags: Set<string>, characterId: string): RelationshipLabel {
  if (states.includes("betrayed")) return "betrayed";
  if (states.includes("jealous")) return "jealous";
  if (states.includes("hurt")) return "hurt";
  if (states.includes("secret ally")) return "secret ally";
  if (
    states.includes("romantic tension") ||
    (flags.has("jamie_route_open") && characterId === "jamie-campbell") ||
    (flags.has("romance_with_ferry_worker") && characterId === "rowan-buchanan")
  ) {
    return score >= 68 ? "love interest" : "romantic tension";
  }
  if (states.includes("trusted")) return "trusted";
  if (states.includes("suspicious")) return "suspicious";
  if (score >= 75) return "trusted";
  if (score >= 58) return "friend";
  if (score <= 20) return "enemy";
  if (score <= 35) return "rival";
  return "neighbour";
}

function tuneStartingStats(player: Player): Stats {
  const stats = { ...startingStats };
  if (player.background === "returning") {
    stats.family += 6;
    stats.stress += 4;
  }
  if (player.background === "fresh-start") {
    stats.mood += 6;
    stats.islandTrust -= 4;
  }
  if (player.trait === "ambitious") {
    stats.career += 8;
  }
  if (player.trait === "romantic") {
    stats.romance += 8;
  }
  if (player.trait === "practical") {
    stats.stress -= 5;
    stats.money += 5;
  }
  if (player.trait === "secretive") {
    stats.reputation -= 3;
    stats.career += 4;
  }
  return Object.fromEntries(Object.entries(stats).map(([key, value]) => [key, clamp(value)])) as Stats;
}

function createInitialRelationships(): Record<string, Relationship> {
  return Object.fromEntries(
    characters.map((character) => [
      character.id,
      {
        ...createRelationship(character.id),
      },
    ]),
  );
}

function createRelationship(characterId: string): Relationship {
  return {
    characterId,
    score: 40,
    label: "neighbour",
    states: ["neighbour"],
  };
}

function mergeStates(existing: RelationshipLabel[], incoming: RelationshipLabel[]) {
  return [...new Set([...existing, ...incoming])].slice(-5);
}

function hasRequiredFlags(state: GameState, ending: Ending) {
  return (ending.requiredFlags ?? []).every((flag) => state.flags.includes(flag));
}

function hasRequiredStats(state: GameState, ending: Ending) {
  return Object.entries(ending.requiredStats ?? {}).every(([key, requirement]) => {
    const value = state.stats[key as keyof Stats];
    return (requirement.min === undefined || value >= requirement.min) && (requirement.max === undefined || value <= requirement.max);
  });
}

function applyParenthoodRoute(state: GameState, choice: SceneChoice) {
  if (!choice.childRoute) {
    return state.parenthood;
  }
  if (choice.childRoute === "adoption") {
    return {
      route: "adoption" as const,
      children: [
        {
          name: "Mairi",
          age: 7,
          traits: ["curious", "observant"],
          bondWithPlayer: 62,
          needs: ["stability", "patient routines"],
          futurePotentialFlags: ["child_bond_strong", "school_gate_story_open"],
        },
      ],
    };
  }
  return {
    route: choice.childRoute,
    children: state.parenthood.children,
  };
}

function findGossip(id: string) {
  return gossipMessages.find((message) => message.id === id);
}

function mergeGossip(existing: GameState["gossipFeed"], unlockedIds: string[]) {
  const map = new Map(existing.map((message) => [message.id, message]));
  unlockedIds.forEach((id) => {
    const message = findGossip(id);
    if (message) map.set(message.id, message);
  });
  return [...map.values()];
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}
