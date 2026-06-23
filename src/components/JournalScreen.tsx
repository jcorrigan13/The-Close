import { characters } from "../data/characters";
import type { GameState } from "../types";

interface JournalScreenProps {
  state: GameState;
}

export function JournalScreen({ state }: JournalScreenProps) {
  const knownSecrets = state.discoveredSecrets
    .map((id) => characters.find((character) => character.id === id))
    .filter(Boolean);

  return (
    <section className="screenStack">
      <div className="screenHeader">
        <p className="eyebrow">Recap and journal</p>
        <h1>Your season so far</h1>
        <p>Ambition: {state.player.ambition}</p>
      </div>

      <div className="sectionGrid twoColumns">
        <article className="panel">
          <h2>Major choices</h2>
          {state.recaps.length === 0 ? (
            <p>No episodes completed yet.</p>
          ) : (
            <ol className="recapList">
              {state.recaps.map((recap) => (
                <li key={`${recap.episodeNumber}-${recap.choiceLabel}`}>
                  <strong>
                    Episode {recap.episodeNumber}: {recap.title}
                  </strong>
                  <span>{recap.recapLine}</span>
                  <small>Choice: {recap.choiceLabel}</small>
                </li>
              ))}
            </ol>
          )}
        </article>
        <article className="panel">
          <h2>Secrets and flags</h2>
          {knownSecrets.length === 0 ? (
            <p>No private secrets discovered yet.</p>
          ) : (
            <ul className="plainList">
              {knownSecrets.map((character) =>
                character ? (
                  <li key={character.id}>
                    <strong>
                      {character.firstName} {character.lastName}:
                    </strong>{" "}
                    {character.privateSecret}
                  </li>
                ) : null,
              )}
            </ul>
          )}
          <div className="tagRow">
            {state.flags.map((flag) => (
              <span className="tag muted" key={flag}>
                {flag}
              </span>
            ))}
          </div>
        </article>
      </div>

      <article className="panel">
        <h2>Parenthood route</h2>
        <p>Current route: {state.parenthood.route}</p>
        {state.parenthood.children.map((child) => (
          <div className="miniCard" key={child.name}>
            <div>
              <h3>
                {child.name}, age {child.age}
              </h3>
              <p>Bond: {child.bondWithPlayer}. Needs: {child.needs.join(", ")}.</p>
            </div>
          </div>
        ))}
      </article>
    </section>
  );
}
