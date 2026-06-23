import { useMemo, useState } from "react";
import { locations } from "../data/locations";
import { getCurrentEpisode, getCurrentScene, getIslandPulse } from "../engine/gameEngine";
import type { GameState } from "../types";
import { CurrentObjective } from "./CurrentObjective";
import { GameHUD } from "./GameHUD";
import { LocationDetailPanel } from "./LocationDetailPanel";
import { MapLocationMarker } from "./MapLocationMarker";

interface SkerrybraeMapProps {
  state: GameState;
  onStartEpisode: () => void;
  onOpenProfile: (characterId: string) => void;
}

export function SkerrybraeMap({ state, onStartEpisode, onOpenProfile }: SkerrybraeMapProps) {
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
            Week {Math.min(state.currentEpisodeNumber, 10)} - {state.player.firstName} is pursuing{" "}
            <strong>{state.player.ambition}</strong>
          </p>
        </div>
        <button className="primaryButton" type="button" onClick={onStartEpisode} disabled={episode?.locked}>
          {episode?.locked ? "Coming soon" : scene ? `Continue: ${scene.sceneTitle}` : "Open episode"}
        </button>
      </div>

      <div className="mapHeroRow">
        <GameHUD state={state} />
        <CurrentObjective state={state} />
      </div>

      <div className="mapFocusGrid">
        <div className="mapColumn">
          <div className="skerryMap storybookMap" aria-label="Clickable illustrated map of Skerrybrae">
            <MapArtwork />
            {locations.map((location) => (
              <MapLocationMarker
                key={location.id}
                location={location}
                state={state}
                selected={selected.id === location.id}
                onSelect={setSelectedId}
              />
            ))}
          </div>
        </div>

        <aside className="mapMiniPanel">
          <LocationDetailPanel location={selected} state={state} onStartEpisode={onStartEpisode} onOpenProfile={onOpenProfile} />
        </aside>
      </div>

      <div className="mapTeaserRail">
        <details className="teaserCard" open>
          <summary>Island Pulse</summary>
          <p>{pulse[0]}</p>
        </details>
        <details className="teaserCard">
          <summary>Story Hooks ({state.activeHookIds.length})</summary>
          <p>{state.activeHookIds.slice(0, 2).map((hook) => hook.replace(/-/g, " ")).join(", ") || "No open hooks yet."}</p>
        </details>
        <details className="teaserCard">
          <summary>Latest Gossip</summary>
          <p>{state.gossipFeed[state.gossipFeed.length - 1]?.text ?? "No gossip unlocked yet."}</p>
        </details>
      </div>
    </section>
  );
}

function MapArtwork() {
  return (
    <svg className="islandShape illustratedIsland" viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <linearGradient id="seaGradient" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#7eb1bf" />
          <stop offset="100%" stopColor="#d8e8df" />
        </linearGradient>
        <linearGradient id="landGradient" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#edf0c9" />
          <stop offset="52%" stopColor="#bdd7a3" />
          <stop offset="100%" stopColor="#7fa978" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#seaGradient)" />
      <g fill="none" stroke="#f2fbff" strokeWidth="0.7" opacity="0.75">
        <path d="M4 18 C12 14 18 14 27 18" />
        <path d="M70 12 C77 8 84 8 93 12" />
        <path d="M2 82 C11 78 20 78 29 82" />
        <path d="M72 88 C80 84 88 84 98 88" />
        <path d="M6 37 C15 33 22 33 31 37" />
      </g>
      <path
        d="M16 58 C10 43 16 24 34 15 C48 8 67 10 80 23 C92 35 92 54 82 70 C72 86 51 92 34 86 C22 82 17 71 16 58 Z"
        fill="url(#landGradient)"
        stroke="#315f68"
        strokeWidth="1.5"
      />
      <path d="M18 60 C33 58 43 53 55 43 C66 34 75 33 86 39" fill="none" stroke="#b88752" strokeWidth="1.2" strokeDasharray="2 2" />
      <path d="M39 66 C46 60 51 59 58 62" fill="none" stroke="#b88752" strokeWidth="1" />
      <path d="M29 64 L18 74" fill="none" stroke="#315f68" strokeWidth="2.4" />
      <path d="M26 58 L31 63 L28 67" fill="none" stroke="#315f68" strokeWidth="1.1" />
      <path d="M63 25 C70 21 78 21 85 28" fill="none" stroke="#6c9454" strokeWidth="3.2" />
      <path d="M66 30 C72 27 79 28 84 33" fill="none" stroke="#6c9454" strokeWidth="2.2" />
      <g fill="#fffaf0" stroke="#315f68" strokeWidth="0.4">
        <path d="M48 51 h4 v4 h-4z" />
        <path d="M53 49 h4 v5 h-4z" />
        <path d="M58 52 h4 v4 h-4z" />
        <path d="M44 55 h4 v4 h-4z" />
      </g>
      <g fill="#4f7d55">
        <circle cx="71" cy="50" r="1.3" />
        <circle cx="75" cy="48" r="1.1" />
        <circle cx="79" cy="52" r="1.3" />
        <circle cx="36" cy="25" r="1.2" />
        <circle cx="40" cy="22" r="1.1" />
        <circle cx="44" cy="24" r="1.3" />
      </g>
      <g fill="#fffaf0" stroke="#55785c" strokeWidth="0.3">
        <ellipse cx="70" cy="26" rx="1.5" ry="1" />
        <ellipse cx="74" cy="30" rx="1.4" ry="0.95" />
      </g>
      <path d="M3 54 C9 52 12 53 17 56" fill="none" stroke="#fffaf0" strokeWidth="1.1" strokeDasharray="3 2" />
      <path d="M4 48 C9 45 13 45 18 47" fill="none" stroke="#fffaf0" strokeWidth="0.7" />
      <path d="M2 61 C8 58 12 58 18 61" fill="none" stroke="#fffaf0" strokeWidth="0.7" />
      <path d="M8 51 l5 -2 l5 2 l-5 2z" fill="#f8ead0" stroke="#315f68" strokeWidth="0.5" />
    </svg>
  );
}
