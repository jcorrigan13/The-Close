import { characters } from "../data/characters";
import { getCurrentEpisode, getEpisodeByNumber } from "../engine/gameEngine";
import type { Choice, GameState } from "../types";
import { Portrait } from "./Portrait";

interface EpisodeScreenProps {
  state: GameState;
  onChoose: (episodeId: string, choice: Choice) => void;
}

export function EpisodeScreen({ state, onChoose }: EpisodeScreenProps) {
  const episode = getCurrentEpisode(state);
  const previousEpisode = getEpisodeByNumber(state.currentEpisodeNumber - 1);

  if (!episode) {
    return (
      <section className="screenStack">
        <div className="screenHeader">
          <p className="eyebrow">Season complete</p>
          <h1>The ceilidh fallout begins</h1>
          <p>Your season finale is ready in the Finale tab.</p>
        </div>
      </section>
    );
  }

  const involved = episode.involvedCharacterIds
    .map((id) => characters.find((character) => character.id === id))
    .filter(Boolean);

  return (
    <section className="episodeLayout">
      <aside className="recapPanel">
        <p className="eyebrow">Previously on The Close...</p>
        {state.recaps.length === 0 ? (
          <p>The ferry has not even docked yet, and Skerrybrae is already preparing an opinion.</p>
        ) : (
          <p>{state.recaps[state.recaps.length - 1].recapLine}</p>
        )}
        {previousEpisode && <small>Last week: {previousEpisode.title}</small>}
      </aside>

      <article className="episodePanel">
        <p className="eyebrow">Episode {episode.episodeNumber}</p>
        <h1>{episode.title}</h1>
        <p className="storyText">{episode.setupText}</p>

        <div className="involvedGrid" aria-label="Involved characters">
          {involved.map((character) =>
            character ? (
              <div className="involvedCard" key={character.id}>
                <Portrait config={character.portraitConfig} name={`${character.firstName} ${character.lastName}`} size="small" />
                <span>
                  {character.firstName} {character.lastName}
                </span>
              </div>
            ) : null,
          )}
        </div>

        <div className="choiceGrid">
          {episode.choices.map((choice) => (
            <button className="choiceCard" key={choice.id} type="button" onClick={() => onChoose(episode.id, choice)}>
              <strong>{choice.label}</strong>
              <span>{choice.description}</span>
            </button>
          ))}
        </div>
        <p className="cliffhanger">
          <strong>Next time...</strong> {episode.cliffhangerText}
        </p>
      </article>
    </section>
  );
}
