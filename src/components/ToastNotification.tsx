import type { ChoiceResult } from "../types";
import { cleanId } from "./uiHelpers";

export function ToastNotification({ result }: { result?: ChoiceResult }) {
  if (!result) return null;

  const toasts = [
    ...result.hooksUnlocked.map((hook) => `New Hook: ${cleanId(hook)}`),
    ...result.gossipUnlocked.map(() => "Gossip Added"),
    ...Object.keys(result.relationshipStateChanges).map(() => "Relationship Shift"),
    ...result.futureLocks.map(() => "Someone Will Remember That"),
  ].slice(0, 4);

  if (toasts.length === 0) return null;

  return (
    <div className="toastStack" aria-live="polite">
      {toasts.map((toast, index) => (
        <div className="toastNotice" key={`${toast}-${index}`}>
          <span />
          {toast}
        </div>
      ))}
    </div>
  );
}
