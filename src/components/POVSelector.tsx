import { characters } from "../data/characters";
import type { GameState } from "../types";
import { Portrait } from "./Portrait";

interface POVSelectorProps {
  state: GameState;
  onSelectPOV: (characterId: string) => void;
}

export function POVSelector({ state, onSelectPOV }: POVSelectorProps) {
  const entries = Object.values(state.characterSim)
    .filter((sim) => sim.playableStatus !== "hidden" && sim.playableStatus !== "child")
    .sort((a, b) => playableRank(a.playableStatus) - playableRank(b.playableStatus))
    .slice(0, 10);

  return (
    <details className="povDrawer paperPanel">
      <summary>Current POV: {labelFor(state.currentPOVCharacterId, state)}</summary>
      <div className="povGrid">
        {entries.map((sim) => {
          const character = characters.find((item) => item.id === sim.characterId);
          const locked = sim.playableStatus !== "playable" && sim.playableStatus !== "unlockable";
          const active = sim.characterId === state.currentPOVCharacterId;
          return (
            <button
              type="button"
              className={active ? "povCard active" : "povCard"}
              key={sim.characterId}
              disabled={locked}
              onClick={() => onSelectPOV(sim.characterId)}
            >
              {character ? (
                <Portrait config={character.portraitConfig} name={`${character.firstName} ${character.lastName}`} size="small" familyId={character.familyId} mood={character.mood} />
              ) : (
                <span className="hudAvatar">N</span>
              )}
              <strong>{labelFor(sim.characterId, state)}</strong>
              <span>{sim.playableStatus}</span>
              <small>{sim.unlockReason}</small>
            </button>
          );
        })}
      </div>
    </details>
  );
}

function labelFor(characterId: string, state: GameState) {
  if (characterId === "newcomer") return state.player.firstName;
  const character = characters.find((item) => item.id === characterId);
  return character ? character.firstName : characterId;
}

function playableRank(status: string) {
  if (status === "playable") return 0;
  if (status === "unlockable") return 1;
  if (status === "teen") return 2;
  return 3;
}
