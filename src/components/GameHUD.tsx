import { statLabels } from "../data/options";
import type { GameState, StatKey } from "../types";

const hudStats: StatKey[] = ["mood", "reputation", "romance", "family", "stress", "islandTrust"];

export function GameHUD({ state }: { state: GameState }) {
  return (
    <section className="gameHud" aria-label="Player status">
      <div className="hudIdentity">
        <span className="hudAvatar">{state.player.firstName.slice(0, 1)}</span>
        <div>
          <strong>
            {state.player.firstName} {state.player.surname}
          </strong>
          <span>{state.player.ambition}</span>
        </div>
      </div>
      <div className="hudStats">
        {hudStats.map((key) => (
          <div className="hudStat" key={key}>
            <span>{statLabels[key]}</span>
            <strong>{state.stats[key]}</strong>
            <i style={{ width: `${state.stats[key]}%` }} />
          </div>
        ))}
      </div>
    </section>
  );
}
