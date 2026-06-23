import { characters } from "../data/characters";
import type { GameState, Location } from "../types";

interface MapLocationMarkerProps {
  location: Location;
  state: GameState;
  selected: boolean;
  onSelect: (locationId: string) => void;
}

export function MapLocationMarker({ location, state, selected, onSelect }: MapLocationMarkerProps) {
  const people = characters.filter((character) => (character.lastSeenLocationId ?? character.locationId) === location.id).slice(0, 3);
  const hasScene = location.id === state.currentSceneId || location.id === locationForScene(state.currentSceneId);
  const status = locationStatus(location, state);

  return (
    <button
      type="button"
      className={`storybookMarker ${selected ? "selected" : ""} ${status.isActive ? "active" : ""}`}
      style={{ left: `${location.mapPosition.x}%`, top: `${location.mapPosition.y}%` }}
      onClick={() => onSelect(location.id)}
      aria-label={`${location.name}, ${status.label}`}
    >
      <span className={`markerBuilding marker-${location.icon}`} aria-hidden="true">
        <i />
      </span>
      {hasScene && <span className="scenePulse" aria-hidden="true" />}
      <span className="markerLabel">{location.name}</span>
      <span className="markerBadges">
        {status.badges.slice(0, 2).map((badge) => (
          <b key={badge}>{badge}</b>
        ))}
      </span>
      {people.length > 0 && (
        <span className="markerPeople" aria-hidden="true">
          {people.map((person) => (
            <i key={person.id}>{person.firstName.slice(0, 1)}</i>
          ))}
        </span>
      )}
      <span className="markerTooltip">{status.tooltip}</span>
    </button>
  );
}

export function locationStatus(location: Location, state: GameState) {
  const badges = [...location.badges];
  let label = location.status;
  let tooltip = location.activeDrama;

  if (location.id === "rowan-house" && state.flags.includes("rowan_house_awkward")) {
    label = "Awkward";
    tooltip = "The Frasers are being polite in the dangerous way.";
    badges.unshift("Consequence");
  }
  if (location.id === "selkie-arms" && (state.flags.includes("jamie_route_open") || state.flags.includes("risky_jamie_flirt"))) {
    label = "Romance charged";
    tooltip = "Jamie is behind the bar. Isla is pretending not to notice you.";
    badges.unshift("Romance");
  }
  if (location.id === "school-bus-stop" && state.activeHookIds.includes("anonymous-group-chat")) {
    label = "Teen drama";
    tooltip = "A group of teenagers stop talking when adults get close.";
    badges.unshift("Teen Drama");
  }
  if (location.id === "wee-shop" && state.gossipFeed.length > 1) {
    label = "Gossip warm";
    tooltip = "Asha knows something. She is pretending she does not.";
    badges.unshift("Gossip");
  }

  return {
    label,
    tooltip,
    badges: [...new Set(badges)],
    isActive: badges.some((badge) => ["Drama", "Gossip", "Teen Drama", "Secret", "Consequence", "Romance"].includes(badge)),
  };
}

function locationForScene(sceneId: string) {
  if (sceneId.startsWith("e1-s1") || sceneId.startsWith("e1-s2") || sceneId.startsWith("e1-s7")) return "harbour";
  if (sceneId.startsWith("e1-s3")) return "buchanan-ferry";
  if (sceneId.startsWith("e1-s4")) return "wee-shop";
  if (sceneId.startsWith("e1-s5") || sceneId.startsWith("e2")) return "selkie-arms";
  if (sceneId.startsWith("e3-s1") || sceneId.startsWith("e3-s2")) return "school-bus-stop";
  if (sceneId.startsWith("e3-s4")) return "beach-path";
  return "";
}
