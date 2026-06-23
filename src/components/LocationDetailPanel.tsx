import { characters } from "../data/characters";
import { families } from "../data/families";
import { getCurrentScene } from "../engine/gameEngine";
import type { GameState, Location } from "../types";
import { LocationBackdrop } from "./LocationBackdrop";
import { Portrait } from "./Portrait";
import { locationStatus } from "./MapLocationMarker";

interface LocationDetailPanelProps {
  location: Location;
  state: GameState;
  onStartEpisode: () => void;
  onOpenProfile: (characterId: string) => void;
}

export function LocationDetailPanel({ location, state, onStartEpisode, onOpenProfile }: LocationDetailPanelProps) {
  const family = families.find((item) => item.id === location.associatedFamilyId);
  const people = characters.filter((character) => (character.lastSeenLocationId ?? character.locationId) === location.id);
  const scene = getCurrentScene(state);
  const sceneHere = scene?.locationId === location.id;
  const status = locationStatus(location, state);

  return (
    <article className="locationSheet">
      <LocationBackdrop location={location} compact />
      <div className="locationSheetBody">
        <div className="locationSheetHeader">
          <div>
            <p className="eyebrow">{status.label}</p>
            <h2>{location.name}</h2>
          </div>
          <span className={`iconBadge icon-${location.icon}`} aria-hidden="true" />
        </div>
        <p className="locationAtmosphere">{location.description}</p>
        <div className="statusBadgeRow">
          {status.badges.slice(0, 3).map((badge) => (
            <span className="statusBadge" key={badge}>
              {badge}
            </span>
          ))}
        </div>
        <p className="locationOneLine">{status.tooltip}</p>
        {people.length > 0 && (
          <div className="locationCastStrip">
            {people.map((person) => (
              <button type="button" key={person.id} onClick={() => onOpenProfile(person.id)}>
                <Portrait config={person.portraitConfig} name={`${person.firstName} ${person.lastName}`} size="small" familyId={person.familyId} mood={person.mood} />
                <span>{person.firstName}</span>
              </button>
            ))}
          </div>
        )}
        <div className="locationActions">
          <button className="primaryButton" type="button" onClick={onStartEpisode} disabled={!sceneHere}>
            {sceneHere ? "Go here" : "No scene here yet"}
          </button>
          {people[0] && (
            <button className="secondaryButton" type="button" onClick={() => onOpenProfile(people[0].id)}>
              Talk to someone
            </button>
          )}
          <button className="ghostButton" type="button">
            Read gossip
          </button>
        </div>
        <details className="softDetails">
          <summary>More details</summary>
          <div className="locationNotes">
            <p>
              <strong>Gossip</strong>
              {location.gossip}
            </p>
            {family && (
              <p>
                <strong>Family anchor</strong>
                {family.name} - {family.business}
              </p>
            )}
            <p>
              <strong>Social status</strong>
              {location.socialStatus}
            </p>
          </div>
        </details>
      </div>
    </article>
  );
}
