import { characters } from "../data/characters";
import { families } from "../data/families";
import type { GameState } from "../types";
import { Portrait } from "./Portrait";

interface CharacterDirectoryProps {
  state: GameState;
  onOpenProfile: (characterId: string) => void;
}

export function CharacterDirectory({ state, onOpenProfile }: CharacterDirectoryProps) {
  return (
    <section className="screenStack">
      <div className="screenHeader">
        <p className="eyebrow">Character directory</p>
        <h1>People who know too much</h1>
        <p>Known secrets appear after choices uncover them.</p>
      </div>
      <div className="cardGrid">
        {characters.map((character) => {
          const relationship = state.relationships[character.id];
          const family = families.find((item) => item.id === character.familyId);
          return (
            <button className="characterCard" key={character.id} type="button" onClick={() => onOpenProfile(character.id)}>
              <Portrait config={character.portraitConfig} name={`${character.firstName} ${character.lastName}`} />
              <div>
                <h2>
                  {character.firstName} {character.lastName}
                </h2>
                <p>{character.occupation}</p>
                <span className="tag">{family?.name}</span>
                <span className="tag muted">{relationship?.label ?? "neighbour"}: {relationship?.score ?? 40}</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
