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

      <div className="sectionGrid twoColumns">
        <article className="panel">
          <h2>Previously...</h2>
          {state.recaps.length > 0 ? <p>{state.recaps[state.recaps.length - 1].recapLine}</p> : <p>The ferry has not docked yet.</p>}
        </article>
        <article className="panel">
          <h2>Drama still brewing</h2>
          <ul className="plainList">
            {hooks.map((hook) => (
              <li key={hook.id}>{hook.title}</li>
            ))}
            {state.futureLocks.map((lock) => (
              <li key={lock}>Future consequence: {lock.replace(/_/g, " ")}</li>
            ))}
          </ul>
        </article>
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
          <h2>Story hooks</h2>
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
        </article>
      </div>

      <div className="sectionGrid twoColumns">
        <article className="panel">
          <h2>Secrets discovered</h2>
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
        </article>
        <article className="panel">
          <h2>Gossip feed history</h2>
          <GossipFeed state={state} limit={5} />
        </article>
      </div>

      <div className="sectionGrid twoColumns">
        <article className="panel">
          <h2>Relationship changes</h2>
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
        </article>
        <article className="panel">
          <h2>People with opinions</h2>
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
        </article>
      </div>

      <div className="sectionGrid twoColumns">
        <article className="panel">
          <h2>Romance and family status</h2>
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
        </article>
        <article className="panel">
          <h2>Teen drama</h2>
          {teenFlags.length === 0 ? <p>No teen drama flags yet.</p> : null}
          <div className="tagRow">
            {teenFlags.map((flag) => (
              <span className="tag muted" key={flag}>
                {flag}
              </span>
            ))}
          </div>
        </article>
      </div>

      <article className="panel">
        <h2>Co-parenting / parenthood route</h2>
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

      <article className="panel">
        <h2>Ambition progress</h2>
        <p>
          {state.player.ambition} is being shaped by your reputation ({state.stats.reputation}), island trust ({state.stats.islandTrust}),
          romance ({state.stats.romance}), and family ({state.stats.family}).
        </p>
      </article>
    </section>
  );
}
