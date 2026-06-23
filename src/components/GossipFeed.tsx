import type { GameState } from "../types";

export function GossipFeed({ state, limit }: { state: GameState; limit?: number }) {
  const messages = [...state.gossipFeed].slice(-(limit ?? state.gossipFeed.length)).reverse();

  return (
    <div className="gossipFeed">
      {messages.length === 0 ? (
        <p>No gossip unlocked yet. Suspicious.</p>
      ) : (
        messages.map((message) => (
          <article className={`gossipMessage ${message.tone}`} key={message.id}>
            <strong>{message.author}</strong>
            <p>{message.text}</p>
          </article>
        ))
      )}
    </div>
  );
}
