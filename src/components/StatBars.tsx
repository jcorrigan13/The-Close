import { statLabels } from "../data/options";
import type { Stats } from "../types";

interface StatBarsProps {
  stats: Stats;
}

export function StatBars({ stats }: StatBarsProps) {
  return (
    <div className="statGrid">
      {Object.entries(stats).map(([key, value]) => (
        <div className="statItem" key={key}>
          <div className="statHeader">
            <span>{statLabels[key as keyof Stats]}</span>
            <strong>{value}</strong>
          </div>
          <div className="statTrack" aria-hidden="true">
            <span className={key === "stress" ? "statFill stress" : "statFill"} style={{ width: `${value}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
