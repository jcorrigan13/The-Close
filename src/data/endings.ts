import type { Ending } from "../types";

export const endings: Ending[] = [
  {
    id: "island-romance",
    ambition: "Find Love",
    title: "Island Romance",
    priority: 90,
    requiredFlags: ["committed_relationship", "finale_love_family_chosen"],
    requiredStats: { romance: { min: 65 } },
    description:
      "You chose a real relationship in front of a room that will never stop having opinions. It is not tidy, but it is honest, and on Skerrybrae that counts as a grand gesture.",
  },
  {
    id: "messy-but-real",
    ambition: "Find Love",
    title: "Messy But Real",
    priority: 70,
    requiredStats: { romance: { min: 55 } },
    description:
      "Your love life is complicated, public, and full of people saying they only want the best for you. Somehow, it still feels worth staying for.",
  },
  {
    id: "new-branch",
    ambition: "Build a Family",
    title: "A New Branch on the Family Tree",
    priority: 90,
    requiredFlags: ["chose_parenthood_route", "finale_love_family_chosen"],
    requiredStats: { family: { min: 60 } },
    description:
      "Family begins as a conversation, then a choice, then a promise. Whether by birth, adoption, or chosen bonds, you end season one making room for someone new.",
  },
  {
    id: "chosen-family",
    ambition: "Build a Family",
    title: "Chosen Family",
    priority: 75,
    requiredFlags: ["chosen_family_seed"],
    requiredStats: { family: { min: 55 } },
    description:
      "You learned that family on Skerrybrae is not only surname and bloodline. It is who shows up with soup, receipts, and blunt advice when life gets awkward.",
  },
  {
    id: "doors-stay-open",
    ambition: "Save the Family Business",
    title: "The Doors Stay Open",
    priority: 90,
    requiredFlags: ["businesses_rallied"],
    requiredStats: { islandTrust: { min: 60 } },
    description:
      "You turned panic into a plan. The pub, farm, ferry, and shop are not fixed forever, but their lights are still on because the island chose them.",
  },
  {
    id: "saved-at-cost",
    ambition: "Save the Family Business",
    title: "Saved, But At A Cost",
    priority: 65,
    requiredStats: { career: { min: 55 } },
    description:
      "You found ways to keep business moving, but favours on Skerrybrae gather interest. Next season, someone will ask what you owe.",
  },
  {
    id: "last-ferry-out",
    ambition: "Escape the Island",
    title: "Last Ferry Out",
    priority: 85,
    requiredFlags: ["personal_future_chosen"],
    requiredStats: { career: { min: 50 }, stress: { max: 55 } },
    description:
      "You made peace with leaving before the island could decide for you. The ferry pulls away with your heart heavier and your future wider.",
  },
  {
    id: "home-complicated",
    ambition: "Escape the Island",
    title: "Home Was Complicated",
    priority: 60,
    description:
      "You wanted the mainland, but Skerrybrae made itself difficult to abandon. The season ends with one foot on the pier and one still in the story.",
  },
  {
    id: "skerrybrae-icon",
    ambition: "Become Island Legend",
    title: "Skerrybrae Icon",
    priority: 90,
    requiredFlags: ["everyone_knows_name", "island_trust_high"],
    requiredStats: { reputation: { min: 60 } },
    description:
      "You became the person people quote, blame, invite, and imitate. It is fame by village hall standards, which is louder than national fame and comes with more tray bakes.",
  },
  {
    id: "village-hall-hero",
    ambition: "Become Island Legend",
    title: "Village Hall Hero",
    priority: 75,
    requiredFlags: ["village_hall_vote_won"],
    description:
      "Your finest hour involved folding chairs, public muttering, and a vote people will still bring up in five years.",
  },
  {
    id: "truth-at-ceilidh",
    ambition: "Expose a Secret",
    title: "Truth at the Ceilidh",
    priority: 95,
    requiredFlags: ["truth_ready_for_ceilidh", "finale_truth_revealed"],
    description:
      "You exposed the truth at the most public possible moment. Skerrybrae will recover, but it will never quite return to the version that kept quiet.",
  },
  {
    id: "silence-kept-peace",
    ambition: "Expose a Secret",
    title: "Silence Kept the Peace",
    priority: 55,
    requiredFlags: ["protected_family_secret"],
    description:
      "You learned every truth has shrapnel. This time you kept quiet, and the peace you preserved may yet demand payment.",
  },
  {
    id: "repair-family",
    ambition: "Repair Family Relationships",
    title: "The Long Way Back",
    priority: 85,
    requiredStats: { family: { min: 65 }, islandTrust: { min: 55 } },
    description:
      "Nothing is magically mended, but people who once avoided each other can now sit at the same table. On Skerrybrae, that is almost a miracle.",
  },
  {
    id: "start-over",
    ambition: "Start Over",
    title: "A Different Kind of Home",
    priority: 80,
    requiredFlags: ["personal_future_chosen"],
    requiredStats: { mood: { min: 55 } },
    description:
      "You arrived as a question mark and ended the season with a life that feels partly chosen. Skerrybrae is still nosy, but it is no longer only watching you from the outside.",
  },
  {
    id: "public-heartbreak",
    ambition: "Find Love",
    title: "Public Heartbreak",
    priority: 40,
    requiredStats: { romance: { max: 45 } },
    description:
      "Romance did not land softly. The island knows too much, but heartbreak here comes with people quietly leaving soup at your door.",
  },
  {
    id: "everyone-knows",
    title: "Everyone Knows Your Name",
    priority: 10,
    description:
      "Season one ends with you firmly woven into Skerrybrae's gossip, grudges, jokes, and loyalties. Whatever you do next, it will not be private.",
  },
];
