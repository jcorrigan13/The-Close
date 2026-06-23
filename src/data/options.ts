import type { AgeBracket, Ambition, Background, PersonalityTrait, Stats } from "../types";

export const ageBrackets: AgeBracket[] = ["18-24", "25-34", "35-49", "50+"];

export const backgrounds: { id: Background; label: string }[] = [
  { id: "returning", label: "Returning to the island" },
  { id: "born-and-raised", label: "Born and raised on Skerrybrae" },
  { id: "fresh-start", label: "Moved to the island for a fresh start" },
  { id: "family-connected", label: "Connected to one of the main families" },
];

export const personalityTraits: PersonalityTrait[] = [
  "ambitious",
  "loyal",
  "romantic",
  "chaotic",
  "practical",
  "secretive",
  "kind",
  "stubborn",
];

export const ambitions: Ambition[] = [
  "Find Love",
  "Build a Family",
  "Save the Family Business",
  "Escape the Island",
  "Become Island Legend",
  "Expose a Secret",
  "Repair Family Relationships",
  "Start Over",
];

export const startingStats: Stats = {
  money: 45,
  mood: 58,
  reputation: 50,
  family: 45,
  romance: 35,
  career: 38,
  stress: 28,
  islandTrust: 42,
};

export const statLabels: Record<keyof Stats, string> = {
  money: "Money",
  mood: "Mood",
  reputation: "Reputation",
  family: "Family",
  romance: "Romance",
  career: "Career",
  stress: "Stress",
  islandTrust: "Island Trust",
};
