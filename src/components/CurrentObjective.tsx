import { getCurrentEpisode, getCurrentScene } from "../engine/gameEngine";
import type { GameState } from "../types";

export function CurrentObjective({ state }: { state: GameState }) {
  const episode = getCurrentEpisode(state);
  const scene = getCurrentScene(state);

  return (
    <article className="objectiveCard">
      <p className="eyebrow">Current objective</p>
      <h2>{episode?.objectiveText ?? "Skerrybrae is between chapters."}</h2>
      <div className="objectiveMeta">
        <span>Episode {state.currentEpisodeNumber}</span>
        <span>{scene ? scene.sceneTitle : episode?.locked ? "Coming soon" : "Finale ready"}</span>
        <span>{state.player.ambition}</span>
      </div>
    </article>
  );
}
