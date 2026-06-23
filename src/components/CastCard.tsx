import { families } from "../data/families";
import { locations } from "../data/locations";
import type { Character, GameState } from "../types";
import { Portrait } from "./Portrait";

interface CastCardProps {
  character: Character;
  state: GameState;
  onOpenProfile: (characterId: string) => void;
}

export function CastCard({ character, state, onOpenProfile }: CastCardProps) {
  const relationship = state.relationships[character.id];
  const family = families.find((item) => item.id === character.familyId);
  const location = locations.find((item) => item.id === (character.lastSeenLocationId ?? character.locationId));
  const secretKnown = state.discoveredSecrets.includes(character.id);

  return (
    <button className="castCard" type="button" onClick={() => onOpenProfile(character.id)}>
      <Portrait config={character.portraitConfig} name={`${character.firstName} ${character.lastName}`} size="medium" familyId={character.familyId} mood={character.mood} />
      <div className="castCardBody">
        <div className="castNameLine">
          <h2>
            {character.firstName} {character.lastName}
          </h2>
          <span>{character.age}</span>
        </div>
        <p>{character.quote ?? character.publicDescription}</p>
        <div className="statusBadgeRow">
          <span className="statusBadge">{family?.name}</span>
          <span className="statusBadge">{relationship?.label ?? character.playerRelationship ?? "neighbour"}</span>
          <span className="statusBadge">Mood: {character.mood}</span>
          <span className="statusBadge">At {location?.name}</span>
          <span className={secretKnown ? "statusBadge secret" : "statusBadge muted"}>{secretKnown ? "Secret known" : "Secret hidden"}</span>
        </div>
      </div>
    </button>
  );
}
