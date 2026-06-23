import { characters } from "../data/characters";
import { storyHooks } from "../data/storyHooks";
import type { GameState } from "../types";
import { GossipFeed } from "./GossipFeed";

interface JournalScreenProps {
  state: GameState;
}

export function JournalScreen({ state }: JournalScreenProps) {
  const knownSecrets = state.discoveredSecrets
    .map((id) => characters.find((character) => character.id === id))
    .filter(Boolean);
  const hooks = storyHooks.filter((hook) => state.activeHookIds.includes(hook.id));
  const relationshipChanges = Object.values(state.relationships)
    .filter((relationship) => relationship.lastChanged)
    .slice(-8)
    .reverse();
  const opinionated = Object.values(state.relationships)
    .filter((relationship) => relationship.score <= 32 || relationship.score >= 58 || relationship.states.length > 1)
    .sort((a, b) => Math.abs(b.score - 40) - Math.abs(a.score - 40))
    .slice(0, 8);
  const teenFlags = state.flags.filter((flag) => flag.includes("teen") || flag.includes("nina") || flag.includes("cam") || flag.includes("brodie"));

  return (
    <section className="screenStack journalNotebook">
      <div className="screenHeader">
        <p className="eyebrow">Recap and journal</p>
        <h1>Your season so far</h1>
        <p>Ambition: {state.player.ambition}</p>
      </div>

      <div className="journalGrid">
        <details className="panel journalSection" open>
          <summary>Previously</summary>
          {state.recaps.length > 0 ? <p>{state.recaps[state.recaps.length - 1].recapLine}</p> : <p>The ferry has not docked yet.</p>}
        </details>
        <details className="panel journalSection" open>
          <summary>Drama still brewing</summary>
          <ul className="plainList">
            {hooks.map((hook) => (
              <li key={hook.id}>{hook.title}</li>
            ))}
            {state.futureLocks.map((lock) => (
              <li key={lock}>Future consequence: {lock.replace(/_/g, " ")}</li>
            ))}
          </ul>
        </details>

        <details className="panel journalSection">
          <summary>Major choices</summary>
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
        </details>
        <details className="panel journalSection">
          <summary>Story hooks</summary>
          {hooks.length === 0 ? (
            <p>No open hooks yet.</p>
          ) : (
            <ul className="plainList">
              {hooks.map((hook) => (
                <li key={hook.id}>
                  <strong>{hook.title}:</strong> {hook.clueText}
                </li>
              ))}
            </ul>
          )}
        </details>

        <details className="panel journalSection">
          <summary>Secrets discovered</summary>
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
        </details>
        <details className="panel journalSection">
          <summary>Gossip feed</summary>
          <GossipFeed state={state} limit={5} />
        </details>

        <details className="panel journalSection">
          <summary>Relationship shifts</summary>
          {relationshipChanges.length === 0 ? (
            <p>No major relationship changes yet.</p>
          ) : (
            <ul className="plainList">
              {relationshipChanges.map((relationship) => {
                const character = characters.find((item) => item.id === relationship.characterId);
                return (
                  <li key={relationship.characterId}>
                    <strong>{character?.firstName ?? relationship.characterId}:</strong> {relationship.label} ({relationship.score}) -{" "}
                    {relationship.lastChanged}
                  </li>
                );
              })}
            </ul>
          )}
        </details>
        <details className="panel journalSection">
          <summary>People with opinions</summary>
          <ul className="plainList">
            {opinionated.map((relationship) => {
              const character = characters.find((item) => item.id === relationship.characterId);
              return (
                <li key={relationship.characterId}>
                  <strong>{character?.firstName ?? relationship.characterId}:</strong> {relationship.label}, {relationship.score}
                </li>
              );
            })}
          </ul>
        </details>

        <details className="panel journalSection">
          <summary>Romance and family</summary>
          <p>Romance score: {state.stats.romance}</p>
          <p>Family score: {state.stats.family}</p>
          <p>Parenthood route: {state.parenthood.route}</p>
          <div className="tagRow">
            {state.flags
              .filter((flag) => flag.includes("jamie") || flag.includes("isla") || flag.includes("poppy") || flag.includes("family"))
              .map((flag) => (
                <span className="tag muted" key={flag}>
                  {flag}
                </span>
              ))}
          </div>
        </details>
        <details className="panel journalSection">
          <summary>Teen drama</summary>
          {teenFlags.length === 0 ? <p>No teen drama flags yet.</p> : null}
          <div className="tagRow">
            {teenFlags.map((flag) => (
              <span className="tag muted" key={flag}>
                {flag}
              </span>
            ))}
          </div>
        </details>

      <details className="panel journalSection">
        <summary>Co-parenting / parenthood</summary>
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
      </details>

      <details className="panel journalSection">
        <summary>Ambition progress</summary>
        <p>
          {state.player.ambition} is being shaped by your reputation ({state.stats.reputation}), island trust ({state.stats.islandTrust}),
          romance ({state.stats.romance}), and family ({state.stats.family}).
        </p>
      </details>
      </div>
    </section>
  );
}
