import { characters } from "../data/characters";
import { statLabels } from "../data/options";
import type { ChoiceResult, StatKey } from "../types";
import { cleanId } from "./uiHelpers";

export function ConsequencePanel({ result }: { result: ChoiceResult }) {
  const statEntries = Object.entries(result.statChanges).filter(([, value]) => value);
  const relationshipEntries = Object.entries(result.relationshipChanges).filter(([, value]) => value);
  const stateEntries = Object.entries(result.relationshipStateChanges);

  return (
    <aside className="consequencePanel">
      <div className="consequenceHeader">
        <p className="eyebrow">Choice fallout</p>
        <h2>{result.choiceLabel}</h2>
      </div>
      <p>{result.immediateResponseText}</p>
      <div className="consequenceChips">
        {statEntries.map(([key, value]) => (
          <span className={value && value > 0 ? "chip positive" : "chip negative"} key={key}>
            {statLabels[key as StatKey]} {value && value > 0 ? "+" : ""}
            {value}
          </span>
        ))}
        {relationshipEntries.map(([id, value]) => {
          const character = characters.find((item) => item.id === id);
          return (
            <span className={value > 0 ? "chip positive" : "chip negative"} key={id}>
              {character?.firstName ?? cleanId(id)} {value > 0 ? "+" : ""}
              {value}
            </span>
          );
        })}
        {stateEntries.flatMap(([id, states]) => {
          const character = characters.find((item) => item.id === id);
          return states.map((state) => (
            <span className="chip relationship" key={`${id}-${state}`}>
              {character?.firstName ?? cleanId(id)}: {state}
            </span>
          ));
        })}
        {result.gossipUnlocked.map((id) => (
          <span className="chip gossip" key={id}>
            Gossip added
          </span>
        ))}
        {result.hooksUnlocked.map((id) => (
          <span className="chip hook" key={id}>
            New hook: {cleanId(id)}
          </span>
        ))}
        {result.futureLocks.map((lock) => (
          <span className="chip warning" key={lock}>
            Someone will remember that
          </span>
        ))}
      </div>
    </aside>
  );
}
