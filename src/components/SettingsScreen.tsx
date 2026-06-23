import type { GameState } from "../types";

interface SettingsScreenProps {
  state: GameState;
  onReset: () => void;
}

export function SettingsScreen({ state, onReset }: SettingsScreenProps) {
  return (
    <section className="screenStack">
      <div className="screenHeader">
        <p className="eyebrow">Settings</p>
        <h1>Game options</h1>
        <p>Save data is stored locally in this browser. The current save format is version {state.saveVersion}.</p>
      </div>
      <article className="paperPanel settingsPanel">
        <h2>Save</h2>
        <p>Resetting clears your current Skerrybrae season and returns to the title screen.</p>
        <button className="secondaryButton" type="button" onClick={onReset}>
          Reset save
        </button>
      </article>
    </section>
  );
}
