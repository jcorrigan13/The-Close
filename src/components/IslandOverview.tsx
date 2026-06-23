import { characters } from "../data/characters";
import { families } from "../data/families";
import { locations } from "../data/locations";
import { getCurrentEpisode } from "../engine/gameEngine";
import type { GameState } from "../types";
import { Portrait } from "./Portrait";
import { StatBars } from "./StatBars";

interface IslandOverviewProps {
  state: GameState;
  onStartEpisode: () => void;
  onOpenProfile: (characterId: string) => void;
}

export function IslandOverview({ state, onStartEpisode, onOpenProfile }: IslandOverviewProps) {
  const episode = getCurrentEpisode(state);
  const featured = characters.slice(0, 4);

  return (
    <section className="screenStack">
      <div className="screenHeader splitHeader">
        <div>
          <p className="eyebrow">Skerrybrae</p>
          <h1>Week {Math.min(state.currentEpisodeNumber, 12)} on the island</h1>
          <p>
            {state.player.firstName} {state.player.surname} is chasing <strong>{state.player.ambition}</strong> while
            the island watches, helps, and interferes.
          </p>
        </div>
        <button className="primaryButton" type="button" onClick={onStartEpisode}>
          {episode ? `Play episode ${episode.episodeNumber}` : "View finale"}
        </button>
      </div>

      <StatBars stats={state.stats} />

      <div className="sectionGrid twoColumns">
        <article className="panel">
          <h2>Permanent places</h2>
          <div className="locationGrid">
            {locations.map((location) => (
              <div className="miniCard" key={location.id}>
                <span className={`iconBadge icon-${location.icon}`} aria-hidden="true" />
                <div>
                  <h3>{location.name}</h3>
                  <p>{location.description}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
        <article className="panel">
          <h2>Main families</h2>
          <div className="familyList">
            {families.map((family) => (
              <div className="compactRow" key={family.id}>
                <span className={`iconBadge icon-${family.icon}`} aria-hidden="true" />
                <div>
                  <strong>{family.name}</strong>
                  <span>{family.business}</span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>

      <article className="panel">
        <h2>Faces around the close</h2>
        <div className="characterStrip">
          {featured.map((character) => (
            <button className="characterChip" key={character.id} type="button" onClick={() => onOpenProfile(character.id)}>
              <Portrait config={character.portraitConfig} name={`${character.firstName} ${character.lastName}`} size="small" />
              <span>{character.firstName}</span>
            </button>
          ))}
        </div>
      </article>
    </section>
  );
}
