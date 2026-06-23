import { characters } from "../data/characters";
import { locations } from "../data/locations";
import { getStoryletById } from "../engine/storyletSelector";
import type { GameState, StoryletChoice } from "../types";
import { ChoiceCard } from "./ChoiceCard";
import { ConsequencePanel } from "./ConsequencePanel";
import { LocationBackdrop } from "./LocationBackdrop";
import { Portrait } from "./Portrait";

interface StoryletPlayerProps {
  state: GameState;
  onChoose: (storyletId: string, choice: StoryletChoice) => void;
  onBackToMap: () => void;
}

export function StoryletPlayer({ state, onChoose, onBackToMap }: StoryletPlayerProps) {
  const storylet = getStoryletById(state.activeStoryletId);
  const location = locations.find((item) => item.id === storylet?.locationId);

  if (!storylet) {
    return (
      <section className="episodeReader">
        <article className="paperPanel">
          <h1>No active scene</h1>
          <p>Choose a location on the map to find this week's available scenes.</p>
          <button className="primaryButton" type="button" onClick={onBackToMap}>
            Back to map
          </button>
        </article>
      </section>
    );
  }

  const involvedIds = [...new Set(storylet.dialogueLines.map((line) => line.characterId))];
  const involved = involvedIds.map((id) => characters.find((character) => character.id === id)).filter(Boolean);

  return (
    <section className="episodeReader">
      <article className="episodePanel scenePanel">
        <LocationBackdrop location={location} />
        <div className="sceneHeader">
          <div>
            <p className="eyebrow">
              Week {state.time.week} - {storylet.tone}
            </p>
            <h1>{storylet.title}</h1>
            <p className="sceneSubtitle">{location?.name}</p>
          </div>
          <button className="ghostButton" type="button" onClick={onBackToMap}>
            Map
          </button>
        </div>
        <section className="narrationCard">
          <p>{storylet.setupText}</p>
        </section>
        <div className="involvedGrid" aria-label="Involved characters">
          {involved.map((character) =>
            character ? (
              <div className="involvedCard" key={character.id}>
                <Portrait config={character.portraitConfig} name={`${character.firstName} ${character.lastName}`} size="small" familyId={character.familyId} mood={character.mood} />
                <span>{character.firstName}</span>
              </div>
            ) : null,
          )}
        </div>
        <div className="dialogueStack">
          {storylet.dialogueLines.map((line, index) => {
            const character = characters.find((item) => item.id === line.characterId);
            if (!character) return null;
            return (
              <div className="dialogueBubble" key={`${line.characterId}-${index}`}>
                <Portrait config={character.portraitConfig} name={`${character.firstName} ${character.lastName}`} size="small" familyId={character.familyId} mood={character.mood} />
                <div>
                  <strong>
                    {character.firstName} {character.lastName}
                    <span>{line.tone}</span>
                  </strong>
                  <p>{line.text}</p>
                </div>
              </div>
            );
          })}
        </div>
        {state.lastChoiceResult && <ConsequencePanel result={state.lastChoiceResult} />}
        <div className="choiceGrid">
          {storylet.choices.map((choice) => (
            <ChoiceCard
              key={choice.id}
              choice={{
                id: choice.id,
                label: choice.label,
                description: choice.hint,
                toneBadge: choice.toneBadge,
                hintedConsequence: choice.hint,
                immediateResponseText: choice.responseText,
                statChanges: choice.statChanges,
                relationshipChanges: choice.relationshipChanges,
                relationshipStateChanges: choice.relationshipStateChanges,
                flagsAdded: [],
                flagsRemoved: [],
                gossipUnlocked: choice.gossipUnlocked,
                hooksUnlocked: choice.hooksUnlocked,
                futureLocks: choice.futureLocks,
                recapLine: choice.recapLine,
              }}
              onSelect={() => onChoose(storylet.id, choice)}
            />
          ))}
        </div>
      </article>
    </section>
  );
}
