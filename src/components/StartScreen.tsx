interface StartScreenProps {
  hasSave: boolean;
  hasLegacySave?: boolean;
  onNewGame: () => void;
  onContinue: () => void;
}

export function StartScreen({ hasSave, hasLegacySave, onNewGame, onContinue }: StartScreenProps) {
  return (
    <main className="titleScreen">
      <section className="titleHero" aria-labelledby="game-title">
        <p className="eyebrow">A Scottish island soap-life game</p>
        <h1 id="game-title">The Close</h1>
        <p className="heroCopy">
          Live through one season on Skerrybrae, where every ferry delay, pub rumour, family secret, and village hall
          vote can change your future.
        </p>
        {hasLegacySave && !hasSave && (
          <p className="saveNotice">
            The story system has been upgraded. Older prototype saves are no longer compatible, so start a new season to use the scene-based version.
          </p>
        )}
        <div className="titleActions">
          <button type="button" className="primaryButton" onClick={onNewGame}>
            New Game
          </button>
          {hasSave && (
            <button type="button" className="secondaryButton" onClick={onContinue}>
              Continue
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
