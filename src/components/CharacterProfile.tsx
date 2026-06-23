import { families } from "../data/families";
import { locations } from "../data/locations";
import type { Character, GameState } from "../types";
import { Portrait } from "./Portrait";

interface CharacterProfileProps {
  character: Character;
  state: GameState;
  onBack: () => void;
}

export function CharacterProfile({ character, state, onBack }: CharacterProfileProps) {
  const family = families.find((item) => item.id === character.familyId);
  const location = locations.find((item) => item.id === character.locationId);
  const relationship = state.relationships[character.id];
  const secretKnown = state.discoveredSecrets.includes(character.id);

  return (
    <section className="profileLayout">
      <article className="profileHero">
        <Portrait config={character.portraitConfig} name={`${character.firstName} ${character.lastName}`} size="large" />
        <div>
          <p className="eyebrow">{family?.name}</p>
          <h1>
            {character.firstName} {character.lastName}
          </h1>
          <p>{character.publicDescription}</p>
          <div className="tagRow">
            <span className="tag">{character.age}</span>
            <span className="tag">{character.occupation}</span>
            <span className="tag">{location?.name}</span>
            {character.romanticStatus && <span className="tag muted">{character.romanticStatus}</span>}
            {character.isTeen && <span className="tag">Teen drama</span>}
            {character.isSingleParent && <span className="tag">Single parent</span>}
          </div>
        </div>
      </article>
      <div className="sectionGrid twoColumns">
        <article className="panel">
          <h2>Relationship</h2>
          <p className="largeMetric">{relationship?.score ?? 40}</p>
          <p>{relationship?.label ?? "neighbour"}</p>
          {relationship?.states && <p>States: {relationship.states.join(", ")}</p>}
          <p>Mood: {character.mood}</p>
        </article>
        <article className="panel">
          <h2>Known story</h2>
          {character.quote && <p>{character.quote}</p>}
          <p>
            <strong>Problem:</strong> {character.unresolvedProblem}
          </p>
          {character.familyTension && (
            <p>
              <strong>Family tension:</strong> {character.familyTension}
            </p>
          )}
          {character.privateWorry && (
            <p>
              <strong>Private worry:</strong> {character.privateWorry}
            </p>
          )}
          <p>
            <strong>Secret:</strong> {secretKnown ? character.privateSecret : "Not discovered yet."}
          </p>
        </article>
      </div>
      <button className="secondaryButton" type="button" onClick={onBack}>
        Back to directory
      </button>
    </section>
  );
}
