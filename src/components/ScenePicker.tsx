import { characters } from "../data/characters";
import { getLocationStorylets } from "../engine/storyletSelector";
import type { GameState } from "../types";

interface ScenePickerProps {
  state: GameState;
  locationId: string;
  onStartStorylet: (storyletId: string, locationId: string) => void;
}

export function ScenePicker({ state, locationId, onStartStorylet }: ScenePickerProps) {
  const storylets = getLocationStorylets(state, locationId);

  if (storylets.length === 0) {
    return (
      <div className="scenePicker empty">
        <strong>No scene this week</strong>
        <span>This may change when the week advances.</span>
      </div>
    );
  }

  return (
    <div className="scenePicker">
      {storylets.map((storylet) => (
        <button className="storyletCard" type="button" key={storylet.id} onClick={() => onStartStorylet(storylet.id, locationId)}>
          <span className="toneBadge">{storylet.tone}</span>
          <strong>{storylet.title}</strong>
          <span>{storylet.setupText}</span>
          <small>
            POV: {povLabel(state.currentPOVCharacterId)} - Risk: {storylet.timeSensitive ? "Time-sensitive" : "Open"}
          </small>
        </button>
      ))}
    </div>
  );
}

function povLabel(characterId: string) {
  if (characterId === "newcomer") return "Newcomer";
  const character = characters.find((item) => item.id === characterId);
  return character ? character.firstName : characterId;
}
