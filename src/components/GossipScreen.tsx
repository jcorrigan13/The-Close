import type { GameState } from "../types";
import { GossipFeed } from "./GossipFeed";

export function GossipScreen({ state }: { state: GameState }) {
  return (
    <section className="screenStack">
      <div className="screenHeader">
        <p className="eyebrow">Island group chat</p>
        <h1>Gossip, clues, and plausible deniability</h1>
        <p>Unlocked messages mix jokes, social fallout, and clues. People will deny writing them until the ferry stops running.</p>
      </div>
      <article className="panel">
        <GossipFeed state={state} />
      </article>
    </section>
  );
}
