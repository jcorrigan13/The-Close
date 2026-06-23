import { gossipMessages } from "../data/gossip";
import type { GameState } from "../types";
import { pickSeeded } from "./random";

const seasons = ["Spring", "Summer", "Autumn", "Winter"] as const;
const weather = ["bright wind", "soft rain", "low mist", "hard sun", "ferry-cancelling gusts"];
const events = ["Village hall night", "School term bustle", "Pub quiz week", "Ferry timetable change", "Quiet Sunday market"];

export function advanceWeek(state: GameState): GameState {
  const nextWeek = state.time.week + 1;
  const season = seasons[Math.floor((nextWeek - 1) / 13) % seasons.length];
  const next: GameState = {
    ...state,
    time: {
      ...state.time,
      week: nextWeek,
      daysElapsed: state.time.daysElapsed + 7,
      season,
      schoolTerm: nextWeek % 13 === 0 ? "holiday" : "term",
      weatherMood: pickSeeded(weather, state.seed, `weather-${nextWeek}`) ?? "soft rain",
      publicEvent: pickSeeded(events, state.seed, `event-${nextWeek}`) ?? "Village hall night",
    },
    activeStoryletId: undefined,
    selectedLocationId: undefined,
    lastChoiceResult: undefined,
    characterSim: updateCharacterLocations(state, nextWeek),
    pregnancies: progressPregnancies(state),
    coParenting: progressCoParenting(state),
    teenDrama: progressTeenDrama(state),
    gossipFeed: updateGossip(state, nextWeek),
    updatedAt: new Date().toISOString(),
  };
  return resolveContradictions(next);
}

export function updateCharacterLocations(state: GameState, week: number) {
  const locationCycle = ["harbour", "wee-shop", "selkie-arms", "rowan-house", "school-bus-stop", "village-hall", "beach-path", "macrae-farm"];
  return Object.fromEntries(
    Object.entries(state.characterSim).map(([id, sim]) => {
      if (id === "newcomer") return [id, { ...sim, currentLocationId: state.selectedLocationId ?? sim.currentLocationId }];
      const location = pickSeeded(locationCycle, state.seed + week, `${id}-location`) ?? sim.currentLocationId;
      return [id, { ...sim, currentLocationId: location, availability: "available" as const }];
    }),
  );
}

export function progressPregnancies(state: GameState) {
  return state.pregnancies.map((pregnancy) => {
    if (pregnancy.outcomeStatus !== "ongoing") return pregnancy;
    const weeksPregnant = pregnancy.weeksPregnant + 1;
    const late = weeksPregnant >= pregnancy.dueWeek - 3;
    return {
      ...pregnancy,
      weeksPregnant,
      pregnancyStatus: pregnancy.knownPublicly ? "public" : pregnancy.pregnancyStatus,
      stressLevel: Math.min(10, pregnancy.stressLevel + (pregnancy.supportNetwork.length > 0 ? 0 : 1)),
      futureChoiceFlags: late ? [...new Set([...pregnancy.futureChoiceFlags, "late_pregnancy_support_needed"])] : pregnancy.futureChoiceFlags,
    };
  });
}

export function progressCoParenting(state: GameState) {
  return state.coParenting.map((route) => ({
    ...route,
    conflictLevel: Math.min(100, route.conflictLevel + (state.worldFlags.includes("coparenting_helped_this_week") ? -4 : 3)),
    publicGossipLevel: Math.min(100, route.publicGossipLevel + (route.conflictLevel > 60 ? 5 : 1)),
  }));
}

export function progressTeenDrama(state: GameState) {
  if (!state.teenDrama.active) return state.teenDrama;
  const weeksIgnored = state.worldFlags.includes("teen_helped_this_week") ? 0 : state.teenDrama.weeksIgnored + 1;
  return {
    ...state.teenDrama,
    weeksIgnored,
    groupChatStatus: weeksIgnored >= 2 ? "public" : state.teenDrama.groupChatStatus === "quiet" ? "rumbling" : state.teenDrama.groupChatStatus,
  };
}

export function updateGossip(state: GameState, week: number) {
  const message = pickSeeded(gossipMessages, state.seed, `gossip-${week}`);
  if (!message || state.gossipFeed.some((item) => item.id === message.id)) return state.gossipFeed;
  return [...state.gossipFeed, message].slice(-12);
}

export function resolveContradictions(state: GameState) {
  return {
    ...state,
    pregnancies: state.pregnancies.map((pregnancy) =>
      pregnancy.knownPublicly ? { ...pregnancy, pregnancyStatus: pregnancy.pregnancyStatus === "private" ? "public" : pregnancy.pregnancyStatus } : pregnancy,
    ),
  };
}
