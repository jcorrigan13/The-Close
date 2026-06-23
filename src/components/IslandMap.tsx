import { useMemo, useState } from "react";
import { characters } from "../data/characters";
import { families } from "../data/families";
import { locations } from "../data/locations";
import { getCurrentEpisode, getCurrentScene, getIslandPulse } from "../engine/gameEngine";
import type { GameState, Location } from "../types";
import { CurrentObjective } from "./CurrentObjective";
import { GossipFeed } from "./GossipFeed";
import { StoryHooksPanel } from "./StoryHooksPanel";

interface IslandMapProps {
  state: GameState;
  onStartEpisode: () => void;
  onOpenProfile: (characterId: string) => void;
}

export function IslandMap({ state, onStartEpisode, onOpenProfile }: IslandMapProps) {
  const episode = getCurrentEpisode(state);
  const scene = getCurrentScene(state);
  const [selectedId, setSelectedId] = useState(scene?.locationId ?? "harbour");
  const selected = useMemo(() => locations.find((location) => location.id === selectedId) ?? locations[0], [selectedId]);
  const pulse = getIslandPulse(state);

  return (
    <section className="mapScreen">
      <div className="screenHeader splitHeader">
        <div>
          <p className="eyebrow">Skerrybrae map</p>
          <h1>The island is alive</h1>
          <p>
            Week {Math.min(state.currentEpisodeNumber, 10)} · {state.player.firstName} is pursuing{" "}
            <strong>{state.player.ambition}</strong>
          </p>
        </div>
        <button className="primaryButton" type="button" onClick={onStartEpisode} disabled={episode?.locked}>
          {episode?.locked ? "Coming soon" : scene ? `Continue: ${scene.sceneTitle}` : "Open episode"}
        </button>
      </div>

      <div className="mapGrid">
        <div className="mapColumn">
          <CurrentObjective state={state} />
          <div className="skerryMap" aria-label="Clickable map of Skerrybrae">
            <svg className="islandShape" viewBox="0 0 100 100" aria-hidden="true">
              <path
                d="M19 56 C12 38 21 19 43 13 C63 7 84 18 88 38 C93 62 74 84 50 88 C31 91 18 78 19 56 Z"
                fill="#d9e8d6"
                stroke="#3d6f76"
                strokeWidth="1.8"
              />
              <path d="M21 59 C33 57 45 53 57 43 C68 34 77 34 86 38" fill="none" stroke="#c69b63" strokeWidth="1.2" strokeDasharray="2 2" />
              <path d="M40 66 C45 61 50 59 56 61" fill="none" stroke="#c69b63" strokeWidth="1.1" />
              <path d="M28 64 L19 72" fill="none" stroke="#3d6f76" strokeWidth="2.2" />
              <path d="M66 27 C73 24 79 24 84 28" fill="none" stroke="#7aa06f" strokeWidth="3" />
            </svg>
            {locations.map((location) => (
              <button
                key={location.id}
                type="button"
                className={markerClass(location, state)}
                style={{ left: `${location.mapPosition.x}%`, top: `${location.mapPosition.y}%` }}
                onClick={() => setSelectedId(location.id)}
                aria-label={location.name}
              >
                <span className={`iconBadge icon-${location.icon}`} aria-hidden="true" />
                <span>{location.name}</span>
              </button>
            ))}
          </div>
        </div>

        <aside className="mapSide">
          <LocationPanel location={selected} state={state} onStartEpisode={onStartEpisode} onOpenProfile={onOpenProfile} />
          <article className="panel">
            <h2>Skerrybrae Today</h2>
            <ul className="pulseList">
              {pulse.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <StoryHooksPanel state={state} compact />
          <article className="panel">
            <h2>Group chat latest</h2>
            <GossipFeed state={state} limit={3} />
          </article>
        </aside>
      </div>
    </section>
  );
}

function LocationPanel({
  location,
  state,
  onStartEpisode,
  onOpenProfile,
}: {
  location: Location;
  state: GameState;
  onStartEpisode: () => void;
  onOpenProfile: (characterId: string) => void;
}) {
  const family = families.find((item) => item.id === location.associatedFamilyId);
  const people = characters.filter((character) => (character.lastSeenLocationId ?? character.locationId) === location.id);
  const scene = getCurrentScene(state);
  const sceneHere = scene?.locationId === location.id;

  return (
    <article className="panel locationPanel">
      <div className="locationTitle">
        <span className={`iconBadge icon-${location.icon}`} aria-hidden="true" />
        <div>
          <p className="eyebrow">{location.status}</p>
          <h2>{location.name}</h2>
        </div>
      </div>
      <p>{location.description}</p>
      <div className="tagRow">
        {location.badges.map((badge) => (
          <span className="tag" key={badge}>
            {badge}
          </span>
        ))}
      </div>
      <p>
        <strong>Drama:</strong> {location.activeDrama}
      </p>
      <p>
        <strong>Gossip:</strong> {location.gossip}
      </p>
      <p>
        <strong>Status:</strong> {location.socialStatus}
      </p>
      {family && (
        <p>
          <strong>Family/business:</strong> {family.name} · {family.business}
        </p>
      )}
      {people.length > 0 && (
        <div className="miniPeople">
          {people.map((person) => (
            <button key={person.id} type="button" onClick={() => onOpenProfile(person.id)}>
              {person.firstName}
            </button>
          ))}
        </div>
      )}
      {sceneHere && (
        <button className="primaryButton" type="button" onClick={onStartEpisode}>
          View scene here
        </button>
      )}
    </article>
  );
}

function markerClass(location: Location, state: GameState) {
  const drama =
    location.badges.includes("Drama") ||
    location.badges.includes("Teen Drama") ||
    location.storyArcTags.some((tag) => state.activeHookIds.some((hook) => hook.includes(tag.split("-")[0])));
  return drama ? "mapMarker drama" : "mapMarker";
}
