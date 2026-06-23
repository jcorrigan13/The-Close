import type { GameState } from "../types";

interface TimePanelProps {
  state: GameState;
  onAdvanceWeek: () => void;
}

export function TimePanel({ state, onAdvanceWeek }: TimePanelProps) {
  const urgent = [
    state.teenDrama.active && state.teenDrama.weeksIgnored > 0 ? `Teen drama ignored ${state.teenDrama.weeksIgnored} week(s)` : "",
    ...state.pregnancies
      .filter((pregnancy) => pregnancy.knownByCharacters.includes(state.currentPOVCharacterId) || pregnancy.knownPublicly)
      .map((pregnancy) => `Pregnancy week ${pregnancy.weeksPregnant}`),
    ...state.coParenting
      .filter((route) => route.publicGossipLevel > 45)
      .map(() => "Co-parenting gossip rising"),
  ].filter(Boolean);

  return (
    <article className="timePanel paperPanel">
      <p className="eyebrow">Island calendar</p>
      <h2>
        Week {state.time.week}, {state.time.season} {state.time.year}
      </h2>
      <div className="timeChips">
        <span>{state.time.weatherMood}</span>
        <span>{state.time.schoolTerm}</span>
        <span>{state.time.publicEvent}</span>
      </div>
      {urgent.length > 0 && (
        <div className="timeWarnings">
          {urgent.slice(0, 2).map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      )}
      <button className="secondaryButton" type="button" onClick={onAdvanceWeek}>
        Advance week
      </button>
    </article>
  );
}
