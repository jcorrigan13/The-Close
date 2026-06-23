export const SAVE_VERSION = 3;

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
  | "trusted"
  | "suspicious"
  | "flirty"
  | "romantic tension"
  | "complicated"
  | "protective"
  | "jealous"
  | "hurt"
  | "loyal"
  | "distant"
  | "betrayed"
  | "secret ally"
  | "family resentment"
  | "family"
  | "friend"
  | "rival"
  | "love interest"
  | "ex"
  | "partner"
  | "spouse"
  | "co-parent"
  | "step-family"
  | "enemy"
  | "neighbour"
  | "business rival";

export interface Relationship {
  characterId: string;
  score: number;
  label: RelationshipLabel;
  states: RelationshipLabel[];
  lastChanged?: string;
}

export interface PortraitConfig {
  faceShape: "round" | "oval" | "square" | "heart";
  skinTone: string;
  hairStyle: "short" | "bob" | "waves" | "curls" | "bun" | "bald";
  hairColor: string;
  outfitColor: string;
  accessory: "none" | "glasses" | "scarf" | "earrings" | "cap" | "beard";
  expression:
    | "neutral"
    | "warm"
    | "serious"
    | "wry"
    | "worried"
    | "bright"
    | "amused"
    | "angry"
    | "sad"
    | "suspicious"
    | "flirty"
    | "embarrassed"
    | "smug";
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
  romanticStatus?: string;
  familyTension?: string;
  privateWorry?: string;
  publicReputation?: string;
  connections?: string[];
  lastSeenLocationId?: string;
  currentStorylineTags?: string[];
  playerRelationship?: string;
  quote?: string;
  isTeen?: boolean;
  isSingleParent?: boolean;
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
  associatedFamilyId?: string;
  mapPosition: { x: number; y: number };
  status: string;
  badges: LocationBadge[];
  activeDrama: string;
  storyArcTags: string[];
  gossip: string;
  socialStatus: string;
}

export type LocationBadge =
  | "Drama"
  | "Secret"
  | "Romance"
  | "Family"
  | "Teen Drama"
  | "Gossip"
  | "Conflict"
  | "Opportunity"
  | "Locked"
  | "Consequence";

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

export type ChoiceTone =
  | "Kind"
  | "Risky"
  | "Flirty"
  | "Honest"
  | "Messy"
  | "Protective"
  | "Practical"
  | "Confrontational"
  | "Secretive";

export interface DialogueLine {
  characterId: string;
  text: string;
  tone: string;
}

export interface SceneChoice {
  id: string;
  label: string;
  description: string;
  toneBadge: ChoiceTone;
  hintedConsequence: string;
  immediateResponseText: string;
  statChanges: StatChanges;
  relationshipChanges: Record<string, number>;
  relationshipStateChanges?: Record<string, RelationshipLabel[]>;
  flagsAdded: string[];
  flagsRemoved: string[];
  storyArcProgressChanges?: Record<string, number>;
  gossipUnlocked?: string[];
  hooksUnlocked?: string[];
  futureLocks?: string[];
  discoveredSecrets?: string[];
  nextSceneId?: string;
  recapLine: string;
  childRoute?: ChildRoute["route"];
}

export type Choice = SceneChoice;

export interface EpisodeScene {
  id: string;
  episodeId: string;
  locationId: string;
  sceneTitle: string;
  narration: string;
  dialogueLines: DialogueLine[];
  involvedCharacterIds: string[];
  mood: string;
  choices: SceneChoice[];
  defaultNextSceneId?: string;
}

export interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  subtitle: string;
  previouslyText: string;
  objectiveText: string;
  locationIds: string[];
  storyArcTags: string[];
  scenes: EpisodeScene[];
  finalRecap: string;
  cliffhanger: string;
  possibleEndStates: string[];
  locked?: boolean;
}

export interface ChoiceResult {
  choiceLabel: string;
  immediateResponseText: string;
  statChanges: StatChanges;
  relationshipChanges: Record<string, number>;
  relationshipStateChanges: Record<string, RelationshipLabel[]>;
  gossipUnlocked: string[];
  hooksUnlocked: string[];
  futureLocks: string[];
  recapLine: string;
}

export interface RecapEntry {
  episodeNumber: number;
  title: string;
  choiceLabel: string;
  recapLine: string;
  resultText: string;
  sceneTitle?: string;
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

export interface StoryHook {
  id: string;
  title: string;
  clueText: string;
  relatedCharacters: string[];
  relatedLocation: string;
  stage: number;
  discovered: boolean;
  resolved: boolean;
  hiddenDetails: string;
}

export interface GossipMessage {
  id: string;
  author: string;
  text: string;
  tone: "comic" | "clue" | "mean" | "warm" | "dramatic";
  episodeNumber?: number;
  locationId?: string;
  relatedFlags?: string[];
}

export interface GameState {
  saveVersion: number;
  player: Player;
  stats: Stats;
  seed: number;
  time: IslandTime;
  currentPOVCharacterId: string;
  activeStoryletId?: string;
  selectedLocationId?: string;
  currentEpisodeNumber: number;
  currentSceneId: string;
  relationships: Record<string, Relationship>;
  characterSim: Record<string, CharacterSimState>;
  pregnancies: PregnancyState[];
  coParenting: CoParentingState[];
  teenDrama: TeenDramaState;
  flags: string[];
  worldFlags: string[];
  publicKnowledge: string[];
  characterKnowledge: Record<string, string[]>;
  discoveredSecrets: string[];
  parenthood: ChildRoute;
  recaps: RecapEntry[];
  activeHookIds: string[];
  resolvedHookIds: string[];
  gossipFeed: GossipMessage[];
  storyArcProgress: Record<string, number>;
  futureLocks: string[];
  lastChoiceResult?: ChoiceResult;
  endingId?: string;
  createdAt: string;
  updatedAt: string;
}

export type Season = "Spring" | "Summer" | "Autumn" | "Winter";

export interface IslandTime {
  year: number;
  season: Season;
  week: number;
  daysElapsed: number;
  schoolTerm: "term" | "holiday";
  weatherMood: string;
  publicEvent: string;
}

export type LifeStage = "child" | "teen" | "youngAdult" | "adult" | "olderAdult";
export type PlayableStatus = "playable" | "unlockable" | "supporting" | "hidden" | "child" | "teen" | "unavailable";

export interface CharacterSimState {
  characterId: string;
  lifeStage: LifeStage;
  currentLocationId: string;
  homeLocationId: string;
  playableStatus: PlayableStatus;
  unlockReason: string;
  availability: "available" | "busy" | "locked" | "away";
  stress: number;
  reputation: number;
  secretsKnown: string[];
  secretsHidden: string[];
  goals: string[];
  worries: string[];
  romanceStatus: string;
  familyStatus: string;
  parenthoodStatus: string;
  currentStorylineTags: string[];
  personalTimeline: string[];
}

export interface PregnancyState {
  characterId: string;
  pregnancyStatus: "none" | "suspected" | "confirmed" | "private" | "public" | "complicated" | "resolved";
  weeksPregnant: number;
  dueWeek: number;
  knownByCharacters: string[];
  knownPublicly: boolean;
  coParentCharacterId?: string;
  supportNetwork: string[];
  stressLevel: number;
  medicalSupport: boolean;
  familyReaction: string;
  futureChoiceFlags: string[];
  outcomeStatus: "ongoing" | "birth" | "adoption" | "privateDecision" | "resolved";
}

export interface CoParentingState {
  childId: string;
  parentAId: string;
  parentBId: string;
  livingArrangement: string;
  trustBetweenParents: number;
  conflictLevel: number;
  supportLevel: number;
  newPartnerTension: number;
  grandparentInterference: number;
  childBondWithEachParent: Record<string, number>;
  publicGossipLevel: number;
}

export interface TeenDramaState {
  active: boolean;
  centralTeenId: string;
  rumourStarterId: string;
  screenshotSubjectId: string;
  weeksIgnored: number;
  groupChatStatus: "quiet" | "rumbling" | "spreading" | "public" | "resolved";
  teenTrust: Record<string, number>;
  parentTrust: Record<string, number>;
}

export interface StoryletChoice {
  id: string;
  label: string;
  toneBadge: ChoiceTone;
  hint: string;
  risk: "Low" | "Medium" | "High";
  responseText: string;
  statChanges: StatChanges;
  relationshipChanges: Record<string, number>;
  relationshipStateChanges?: Record<string, RelationshipLabel[]>;
  worldFlagsAdded?: string[];
  worldFlagsRemoved?: string[];
  characterKnowledgeAdded?: Record<string, string[]>;
  publicKnowledgeAdded?: string[];
  gossipUnlocked?: string[];
  hooksUnlocked?: string[];
  futureLocks?: string[];
  pregnancyUpdates?: Partial<PregnancyState>[];
  coParentingUpdates?: Partial<CoParentingState>[];
  teenDramaUpdates?: Partial<TeenDramaState>;
  recapLine: string;
}

export interface Storylet {
  id: string;
  title: string;
  locationId: string;
  eligiblePOVCharacters: string[] | "any";
  requiredWorldFlags: string[];
  blockedWorldFlags: string[];
  timeWindow?: { startWeek?: number; endWeek?: number };
  lifeStageTags: LifeStage[];
  storyTags: string[];
  priority: number;
  rarity: number;
  cooldownWeeks: number;
  setupText: string;
  dialogueLines: DialogueLine[];
  choices: StoryletChoice[];
  followUpHooks: string[];
  possibleNextStorylets: string[];
  tone: string;
  timeSensitive?: boolean;
  expiresAfterWeeks?: number;
}

export type Screen =
  | "start"
  | "create"
  | "map"
  | "episode"
  | "directory"
  | "profile"
  | "families"
  | "relationships"
  | "journal"
  | "gossip"
  | "settings"
  | "finale";
