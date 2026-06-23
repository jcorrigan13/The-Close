import { characters } from "../data/characters";
import { locations } from "../data/locations";
import { storyArcs } from "../data/storyArcs";
import { getCurrentEpisode, getCurrentScene, getEpisodeByNumber } from "../engine/gameEngine";
import type { GameState, SceneChoice } from "../types";
import { ChoiceCard } from "./ChoiceCard";
import { ConsequencePanel } from "./ConsequencePanel";
import { CurrentObjective } from "./CurrentObjective";
import { LocationBackdrop } from "./LocationBackdrop";
import { Portrait } from "./Portrait";
import { StoryHooksPanel } from "./StoryHooksPanel";

interface EpisodeScreenProps {
  state: GameState;
  onChoose: (episodeId: string, sceneId: string, choice: SceneChoice) => void;
}

export function EpisodeScreen({ state, onChoose }: EpisodeScreenProps) {
  const episode = getCurrentEpisode(state);
  const scene = getCurrentScene(state);
  const previousEpisode = getEpisodeByNumber(state.currentEpisodeNumber - 1);
  const location = locations.find((item) => item.id === scene?.locationId);

  if (!episode || state.endingId) {
    return (
      <section className="screenStack">
        <div className="screenHeader">
          <p className="eyebrow">Season complete</p>
          <h1>The ceilidh fallout begins</h1>
          <p>Your season finale is ready in the Finale tab.</p>
        </div>
      </section>
    );
  }

  if (episode.locked) {
    return (
      <section className="screenStack">
        <div className="screenHeader">
          <p className="eyebrow">Coming soon</p>
          <h1>{episode.title}</h1>
          <p>{episode.subtitle}</p>
        </div>
        <article className="panel">
          <h2>Roadmap chapter</h2>
          <p>{episode.objectiveText}</p>
          <p>Replay episodes 1-3 to change hooks, gossip, relationship states, and future locks before this chapter is fully implemented.</p>
        </article>
      </section>
    );
  }

  if (!scene) {
    return null;
  }

  const involved = scene.involvedCharacterIds
    .map((id) => characters.find((character) => character.id === id))
    .filter(Boolean);

  return (
    <section className="episodeSceneLayout">
      <aside className="episodeSidebar">
        <CurrentObjective state={state} />
        <article className="recapPanel">
          <p className="eyebrow">Previously on The Close...</p>
          <p>{state.recaps.length === 0 ? episode.previouslyText : state.recaps[state.recaps.length - 1].recapLine}</p>
          {previousEpisode && <small>Last episode: {previousEpisode.title}</small>}
        </article>
        <article className="panel">
          <h2>Active arcs</h2>
          <div className="tagRow">
            {episode.storyArcTags.map((tag) => (
              <span className="tag muted" title={storyArcs[tag]} key={tag}>
                {tag.replace(/-/g, " ")}
              </span>
            ))}
          </div>
        </article>
        <StoryHooksPanel state={state} compact />
      </aside>

      <article className="episodePanel scenePanel">
        <LocationBackdrop location={location} />
        <div className="sceneHeader">
          <div>
            <p className="eyebrow">Episode {episode.episodeNumber}</p>
            <h1>{episode.title}</h1>
            <p className="sceneSubtitle">{episode.subtitle}</p>
          </div>
          {location && (
            <span className="locationBadge">
              <span className={`iconBadge icon-${location.icon}`} aria-hidden="true" />
              {location.name}
            </span>
          )}
        </div>

        <div className="sceneProgress">
          Scene {episode.scenes.findIndex((item) => item.id === scene.id) + 1} of {episode.scenes.length}
        </div>

        <section className="narrationCard">
          <p className="eyebrow">{scene.mood}</p>
          <h2>{scene.sceneTitle}</h2>
          <p>{scene.narration}</p>
        </section>

        <div className="involvedGrid" aria-label="Involved characters">
          {involved.map((character) =>
            character ? (
              <div className="involvedCard" key={character.id}>
                <Portrait config={character.portraitConfig} name={`${character.firstName} ${character.lastName}`} size="small" familyId={character.familyId} mood={character.mood} />
                <span>
                  {character.firstName} {character.lastName}
                </span>
              </div>
            ) : null,
          )}
        </div>

        <div className="dialogueStack">
          {scene.dialogueLines.map((line, index) => {
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
          {scene.choices.map((choice) => (
            <ChoiceCard key={choice.id} choice={choice} onSelect={() => onChoose(episode.id, scene.id, choice)} />
          ))}
        </div>
        {!scene.defaultNextSceneId && (
          <p className="cliffhanger">
            <strong>Next time...</strong> {episode.cliffhanger}
          </p>
        )}
      </article>
    </section>
  );
}
