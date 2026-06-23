import { characters } from "../data/characters";
import { endings } from "../data/endings";
import { episodes } from "../data/episodes";
import { startingStats } from "../data/options";
import type { Choice, Ending, GameState, Player, Relationship, RelationshipLabel, Stats } from "../types";

const clamp = (value: number) => Math.max(0, Math.min(100, value));

export function createNewGame(player: Player): GameState {
  const now = new Date().toISOString();
  return {
    player,
    stats: tuneStartingStats(player),
    currentEpisodeNumber: 1,
    relationships: createInitialRelationships(),
    flags: [`ambition_${slug(player.ambition)}`, `background_${player.background}`, `trait_${player.trait}`],
    discoveredSecrets: [],
    parenthood: { route: "none", children: [] },
    recaps: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function getCurrentEpisode(state: GameState) {
  return episodes.find((episode) => episode.episodeNumber === state.currentEpisodeNumber);
}

export function getEpisodeByNumber(episodeNumber: number) {
  return episodes.find((episode) => episode.episodeNumber === episodeNumber);
}

export function applyChoice(state: GameState, episodeId: string, choice: Choice): GameState {
  const episode = episodes.find((item) => item.id === episodeId);
  if (!episode) {
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
    const existing = relationships[characterId] ?? {
      characterId,
      score: 40,
      label: "neighbour" as RelationshipLabel,
    };
    const score = clamp(existing.score + delta);
    relationships[characterId] = {
      ...existing,
      score,
      label: relationshipLabel(score, flags, characterId),
    };
  });

  const nextEpisodeNumber = episode.episodeNumber + 1;
  const parenthood = applyParenthoodRoute(state, choice);
  const endingId = nextEpisodeNumber > episodes.length ? chooseEnding({ ...state, stats, flags: [...flags] })?.id : undefined;

  return {
    ...state,
    stats,
    relationships,
    flags: [...flags],
    discoveredSecrets: [...discoveredSecrets],
    parenthood,
    currentEpisodeNumber: nextEpisodeNumber,
    recaps: [
      ...state.recaps,
      {
        episodeNumber: episode.episodeNumber,
        title: episode.title,
        choiceLabel: choice.label,
        recapLine: choice.recapLine,
        resultText: choice.resultText,
      },
    ],
    endingId,
    updatedAt: new Date().toISOString(),
  };
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

export function relationshipLabel(score: number, flags: Set<string>, characterId: string): RelationshipLabel {
  if (
    (flags.has("romance_with_jamie") && characterId === "jamie-campbell") ||
    (flags.has("romance_with_ferry_worker") && characterId === "rowan-buchanan")
  ) {
    return score >= 70 ? "partner" : "love interest";
  }
  if (score >= 75) return "friend";
  if (score >= 58) return "neighbour";
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
        characterId: character.id,
        score: 40,
        label: "neighbour",
      },
    ]),
  );
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

function applyParenthoodRoute(state: GameState, choice: Choice) {
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

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}
