import { characters } from "../data/characters";
import type { GameState } from "../types";
import { Portrait } from "./Portrait";

interface RelationshipScreenProps {
  state: GameState;
  onOpenProfile: (characterId: string) => void;
}

export function RelationshipScreen({ state, onOpenProfile }: RelationshipScreenProps) {
  const relationships = Object.values(state.relationships).sort((a, b) => b.score - a.score);

  return (
    <section className="screenStack">
      <div className="screenHeader">
        <p className="eyebrow">Relationships</p>
        <h1>Where you stand</h1>
        <p>Scores move as choices build trust, tension, romance, rivalry, and family bonds.</p>
      </div>
      <div className="relationshipList">
        {relationships.map((relationship) => {
          const character = characters.find((item) => item.id === relationship.characterId);
          if (!character) return null;
          return (
            <button
              className="relationshipRow"
              key={relationship.characterId}
              type="button"
              onClick={() => onOpenProfile(character.id)}
            >
              <Portrait config={character.portraitConfig} name={`${character.firstName} ${character.lastName}`} size="small" />
              <div className="relationshipInfo">
                <strong>
                  {character.firstName} {character.lastName}
                </strong>
                <span>{relationship.label}</span>
              </div>
              <div className="relationshipMeter" aria-label={`Relationship score ${relationship.score}`}>
                <span style={{ width: `${relationship.score}%` }} />
              </div>
              <strong>{relationship.score}</strong>
            </button>
          );
        })}
      </div>
    </section>
  );
}
