import { characters } from "../data/characters";
import { locations } from "../data/locations";
import { storyHooks } from "../data/storyHooks";
import type { GameState } from "../types";

export function StoryHooksPanel({ state, compact = false }: { state: GameState; compact?: boolean }) {
  const hooks = storyHooks.filter((hook) => state.activeHookIds.includes(hook.id));

  return (
    <article className="panel">
      <h2>Story hooks</h2>
      {hooks.length === 0 ? (
        <p>No open hooks yet.</p>
      ) : (
        <div className={compact ? "hookList compact" : "hookList"}>
          {hooks.map((hook) => {
            const location = locations.find((item) => item.id === hook.relatedLocation);
            const names = hook.relatedCharacters
              .map((id) => characters.find((character) => character.id === id)?.firstName)
              .filter(Boolean)
              .join(", ");
            return (
              <div className="hookCard" key={hook.id}>
                <strong>{hook.title}</strong>
                <span>{hook.clueText}</span>
                <small>
                  {location?.name} - {names}
                </small>
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
}
