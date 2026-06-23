export const familyAccents: Record<string, string> = {
  macrae: "#5f8b4c",
  campbell: "#c47a2c",
  buchanan: "#34788a",
  fraser: "#9a6fae",
  patel: "#d18a3b",
  murray: "#6b7180",
};

export function familyAccent(familyId?: string) {
  return familyId ? familyAccents[familyId] ?? "#2f6270" : "#2f6270";
}

export function riskLevel(hint: string, tone: string) {
  const text = `${hint} ${tone}`.toLowerCase();
  if (text.includes("risk") || text.includes("retaliate") || text.includes("hostile") || text.includes("awkward")) return "High";
  if (text.includes("may") || text.includes("later") || text.includes("trust")) return "Medium";
  return "Low";
}

export function cleanId(value: string) {
  return value.replace(/[_-]/g, " ");
}
