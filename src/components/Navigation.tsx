import type { Screen } from "../types";

const items: { screen: Screen; label: string }[] = [
  { screen: "map", label: "Map" },
  { screen: "episode", label: "Episode" },
  { screen: "directory", label: "Cast" },
  { screen: "relationships", label: "Relationships" },
  { screen: "journal", label: "Journal" },
  { screen: "gossip", label: "Gossip" },
  { screen: "settings", label: "Settings" },
];

interface NavigationProps {
  activeScreen: Screen;
  hasEnding: boolean;
  onNavigate: (screen: Screen) => void;
}

export function Navigation({ activeScreen, hasEnding, onNavigate }: NavigationProps) {
  return (
    <header className="topBar">
      <button className="brandButton" type="button" onClick={() => onNavigate("map")}>
        <span className="brandMark">TC</span>
        <span>The Close</span>
      </button>
      <nav className="navTabs" aria-label="Game screens">
        {items.map((item) => (
          <button
            key={item.screen}
            type="button"
            className={activeScreen === item.screen ? "navTab active" : "navTab"}
            onClick={() => onNavigate(item.screen)}
          >
            {item.label}
          </button>
        ))}
        {hasEnding && (
          <button
            type="button"
            className={activeScreen === "finale" ? "navTab active" : "navTab"}
            onClick={() => onNavigate("finale")}
          >
            Finale
          </button>
        )}
      </nav>
    </header>
  );
}
