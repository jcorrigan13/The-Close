import type { SceneChoice } from "../types";
import { riskLevel } from "./uiHelpers";

interface ChoiceCardProps {
  choice: SceneChoice;
  onSelect: () => void;
}

export function ChoiceCard({ choice, onSelect }: ChoiceCardProps) {
  const risk = riskLevel(choice.hintedConsequence, choice.toneBadge);
  return (
    <button className={`choiceCard narrativeChoice risk-${risk.toLowerCase()}`} type="button" onClick={onSelect}>
      <span className="choiceTopline">
        <span className="toneBadge">{choice.toneBadge}</span>
        <span className="riskMeter" aria-label={`Emotional risk ${risk}`}>
          <i />
          <i />
          <i />
          <b>{risk}</b>
        </span>
      </span>
      <strong>{choice.label}</strong>
      <span>{choice.description}</span>
      <small>{choice.hintedConsequence}</small>
    </button>
  );
}
