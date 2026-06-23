export type AgeBracket = "18-24" | "25-34" | "35-49" | "50+";

export type Background =
  | "returning"
  | "born-and-raised"
  | "fresh-start"
  | "family-connected";

export type PersonalityTrait =
  | "ambitious"
  | "loyal"
  | "romantic"
  | "chaotic"
  | "practical"
  | "secretive"
  | "kind"
  | "stubborn";

export type Ambition =
  | "Find Love"
  | "Build a Family"
  | "Save the Family Business"
  | "Escape the Island"
  | "Become Island Legend"
  | "Expose a Secret"
  | "Repair Family Relationships"
  | "Start Over";

export type StatKey =
  | "money"
  | "mood"
  | "reputation"
  | "family"
  | "romance"
  | "career"
  | "stress"
  | "islandTrust";

export type Stats = Record<StatKey, number>;

export type StatChanges = Partial<Record<StatKey, number>>;

export type RelationshipLabel =
  | "family"
  | "friend"
  | "rival"
  | "love interest"
  | "ex"
  | "partner"
  | "spouse"
  | "co-parent"
  | "enemy"
  | "neighbour"
  | "business rival";

export interface Relationship {
  characterId: string;
  score: number;
  label: RelationshipLabel;
}

export interface PortraitConfig {
  faceShape: "round" | "oval" | "square" | "heart";
  skinTone: string;
  hairStyle: "short" | "bob" | "waves" | "curls" | "bun" | "bald";
  hairColor: string;
  outfitColor: string;
  accessory: "none" | "glasses" | "scarf" | "earrings" | "cap" | "beard";
  expression: "warm" | "serious" | "wry" | "worried" | "bright";
}

export interface Character {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  familyId: string;
  householdId: string;
  occupation: string;
  locationId: string;
  traits: PersonalityTrait[];
  mood: string;
  publicDescription: string;
  privateSecret: string;
  unresolvedProblem: string;
  relationships: Relationship[];
  portraitConfig: PortraitConfig;
}

export interface Family {
  id: string;
  name: string;
  role: string;
  business: string;
  locationId: string;
  vibe: string;
  themes: string[];
  icon: string;
}

export interface Location {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Player {
  firstName: string;
  surname: string;
  ageBracket: AgeBracket;
  background: Background;
  trait: PersonalityTrait;
  ambition: Ambition;
}

export interface ChildRoute {
  route:
    | "none"
    | "trying"
    | "adoption"
    | "step-parent"
    | "co-parenting"
    | "guardianship"
    | "no-children";
  children: ChildCharacter[];
}

export interface ChildCharacter {
  name: string;
  age: number;
  traits: string[];
  bondWithPlayer: number;
  needs: string[];
  futurePotentialFlags: string[];
}

export interface Choice {
  id: string;
  label: string;
  description: string;
  statChanges: StatChanges;
  relationshipChanges: Record<string, number>;
  flagsAdded: string[];
  flagsRemoved: string[];
  discoveredSecrets?: string[];
  recapLine: string;
  resultText: string;
  childRoute?: ChildRoute["route"];
}

export interface Episode {
  id: string;
  title: string;
  episodeNumber: number;
  requiredFlags: string[];
  blockedFlags: string[];
  ambitionTags: Ambition[];
  involvedCharacterIds: string[];
  setupText: string;
  choices: Choice[];
  resultText: string;
  recapText: string;
  cliffhangerText: string;
}

export interface RecapEntry {
  episodeNumber: number;
  title: string;
  choiceLabel: string;
  recapLine: string;
  resultText: string;
}

export interface Ending {
  id: string;
  ambition?: Ambition;
  title: string;
  description: string;
  priority: number;
  requiredFlags?: string[];
  requiredStats?: Partial<Record<StatKey, { min?: number; max?: number }>>;
}

export interface GameState {
  player: Player;
  stats: Stats;
  currentEpisodeNumber: number;
  relationships: Record<string, Relationship>;
  flags: string[];
  discoveredSecrets: string[];
  parenthood: ChildRoute;
  recaps: RecapEntry[];
  endingId?: string;
  createdAt: string;
  updatedAt: string;
}

export type Screen =
  | "start"
  | "create"
  | "overview"
  | "episode"
  | "directory"
  | "profile"
  | "families"
  | "relationships"
  | "journal"
  | "finale";
