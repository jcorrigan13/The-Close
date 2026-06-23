import { getEnding } from "../engine/gameEngine";
import type { GameState } from "../types";
import { StatBars } from "./StatBars";

interface FinaleScreenProps {
  state: GameState;
  onReset: () => void;
}

export function FinaleScreen({ state, onReset }: FinaleScreenProps) {
  const ending = getEnding(state);

  return (
    <section className="finaleScreen">
      <div className="screenHeader">
        <p className="eyebrow">Season finale</p>
        <h1>{ending.title}</h1>
        <p>{ending.description}</p>
      </div>
      <article className="panel">
        <h2>Season record</h2>
        <p>
          {state.player.firstName} {state.player.surname} pursued <strong>{state.player.ambition}</strong> across{" "}
          {state.recaps.length} episodes.
        </p>
        <StatBars stats={state.stats} />
      </article>
      <article className="panel">
        <h2>Final recap</h2>
        <ol className="recapList">
          {state.recaps.slice(-5).map((recap) => (
            <li key={`${recap.episodeNumber}-${recap.choiceLabel}`}>
              <strong>
                Episode {recap.episodeNumber}: {recap.title}
              </strong>
              <span>{recap.recapLine}</span>
            </li>
          ))}
        </ol>
      </article>
      <button className="secondaryButton" type="button" onClick={onReset}>
        Start again
      </button>
    </section>
  );
}
