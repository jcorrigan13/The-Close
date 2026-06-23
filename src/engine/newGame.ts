import { characters } from "../data/characters";
import type {
  CharacterSimState,
  CoParentingState,
  GameState,
  IslandTime,
  Player,
  PregnancyState,
  TeenDramaState,
} from "../types";
import { pickManySeeded, pickSeeded } from "./random";

export function createIslandTime(): IslandTime {
  return {
    year: 2026,
    season: "Spring",
    week: 1,
    daysElapsed: 0,
    schoolTerm: "term",
    weatherMood: "bright wind",
    publicEvent: "Ferry timetable change",
  };
}

export function createCharacterSim(player: Player, seed: number): Record<string, CharacterSimState> {
  const sim = Object.fromEntries(
    characters.map((character) => [
      character.id,
      {
        characterId: character.id,
        lifeStage: lifeStageFor(character.age),
        currentLocationId: character.lastSeenLocationId ?? character.locationId,
        homeLocationId: character.locationId,
        playableStatus: character.isTeen ? "unlockable" : "unlockable",
        unlockReason: character.isTeen ? "Earn teen trust or follow their storyline." : "Build trust or activate their storyline.",
        availability: "available",
        stress: stressFor(character.id, seed),
        reputation: 45 + (character.age % 15),
        secretsKnown: [],
        secretsHidden: [character.privateSecret],
        goals: character.currentStorylineTags ?? [character.traits[0]],
        worries: [character.privateWorry ?? character.unresolvedProblem],
        romanceStatus: character.romanticStatus ?? "private",
        familyStatus: character.familyTension ?? "steady",
        parenthoodStatus: character.isSingleParent ? "single parent" : "none",
        currentStorylineTags: character.isTeen ? ["teen-drama"] : [],
        personalTimeline: [],
      } satisfies CharacterSimState,
    ]),
  ) as Record<string, CharacterSimState>;

  sim.newcomer = {
    characterId: "newcomer",
    lifeStage: player.ageBracket === "18-24" ? "youngAdult" : player.ageBracket === "50+" ? "olderAdult" : "adult",
    currentLocationId: "harbour",
    homeLocationId: "harbour",
    playableStatus: "playable",
    unlockReason: "Your created newcomer.",
    availability: "available",
    stress: 25,
    reputation: 45,
    secretsKnown: [],
    secretsHidden: [],
    goals: [player.ambition],
    worries: ["Learning who to trust on Skerrybrae."],
    romanceStatus: "open",
    familyStatus: player.background,
    parenthoodStatus: "none",
    currentStorylineTags: ["newcomer", "arrival"],
    personalTimeline: [`Arrived on Skerrybrae in week 1.`],
  };

  return sim;
}

export function createRandomIslandSetup(seed: number) {
  const secretPool = ["pregnancy_secret_active", "family_parentage_secret", "arrival_note_secret", "old_affair_rumour"];
  const romancePool = ["selkie_romance_tension", "jamie_still_cares", "rowan_warm_start", "isla_guarded_return"];
  const familyPool = ["macrae_sibling_pressure", "fraser_family_awkward", "murray_control_tension"];
  const secrets = pickManySeeded(secretPool, 2, seed, "secrets");
  const romance = pickManySeeded(romancePool, 2, seed, "romance");
  const family = pickSeeded(familyPool, seed, "family") ?? "macrae_sibling_pressure";
  const teenCentral = pickSeeded(["nina-patel", "brodie-macrae", "sorcha-buchanan"], seed, "teen") ?? "nina-patel";
  const rumourStarter = pickSeeded(["cam-murray", "sorcha-buchanan", "brodie-macrae"], seed, "rumour") ?? "cam-murray";
  const hiddenDramaLocation = pickSeeded(["harbour", "wee-shop", "rowan-house", "school-bus-stop"], seed, "hidden-location") ?? "wee-shop";

  return {
    worldFlags: [...secrets, ...romance, family, "teen_drama_active", "coparenting_active", `hidden_drama_${hiddenDramaLocation}`],
    teenCentral,
    rumourStarter,
    hiddenDramaLocation,
  };
}

export function createPregnancies(setup: ReturnType<typeof createRandomIslandSetup>): PregnancyState[] {
  if (!setup.worldFlags.includes("pregnancy_secret_active")) return [];
  return [
    {
      characterId: "isla-fraser",
      pregnancyStatus: "suspected",
      weeksPregnant: 7,
      dueWeek: 33,
      knownByCharacters: ["isla-fraser"],
      knownPublicly: false,
      coParentCharacterId: "jamie-campbell",
      supportNetwork: [],
      stressLevel: 6,
      medicalSupport: false,
      familyReaction: "unknown",
      futureChoiceFlags: [],
      outcomeStatus: "ongoing",
    },
  ];
}

export function createCoParenting(): CoParentingState[] {
  return [
    {
      childId: "poppy-fraser",
      parentAId: "isla-fraser",
      parentBId: "jamie-campbell",
      livingArrangement: "Poppy lives with Isla at Rowan House.",
      trustBetweenParents: 42,
      conflictLevel: 48,
      supportLevel: 36,
      newPartnerTension: 25,
      grandparentInterference: 30,
      childBondWithEachParent: { "isla-fraser": 78, "jamie-campbell": 46 },
      publicGossipLevel: 35,
    },
  ];
}

export function createTeenDrama(setup: ReturnType<typeof createRandomIslandSetup>): TeenDramaState {
  return {
    active: true,
    centralTeenId: setup.teenCentral,
    rumourStarterId: setup.rumourStarter,
    screenshotSubjectId: "isla-fraser",
    weeksIgnored: 0,
    groupChatStatus: "rumbling",
    teenTrust: {
      "nina-patel": 40,
      "brodie-macrae": 40,
      "sorcha-buchanan": 45,
      "cam-murray": 30,
    },
    parentTrust: {
      "asha-patel": 45,
      "eilidh-macrae": 42,
      "greer-murray": 25,
    },
  };
}

export function unlockInitialPOVs(state: GameState): GameState {
  const characterSim = { ...state.characterSim };
  ["newcomer", "jamie-campbell", "isla-fraser", state.teenDrama.centralTeenId].forEach((id) => {
    if (characterSim[id]) {
      characterSim[id] = { ...characterSim[id], playableStatus: id === "newcomer" ? "playable" : "unlockable" };
    }
  });
  return { ...state, characterSim };
}

function lifeStageFor(age: number): CharacterSimState["lifeStage"] {
  if (age < 13) return "child";
  if (age < 18) return "teen";
  if (age < 31) return "youngAdult";
  if (age < 60) return "adult";
  return "olderAdult";
}

function stressFor(id: string, seed: number) {
  return 25 + ((id.length * 13 + seed) % 42);
}
