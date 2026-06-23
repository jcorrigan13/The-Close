interface StartScreenProps {
  hasSave: boolean;
  onNewGame: () => void;
  onContinue: () => void;
}

export function StartScreen({ hasSave, onNewGame, onContinue }: StartScreenProps) {
  return (
    <main className="titleScreen">
      <section className="titleHero" aria-labelledby="game-title">
        <p className="eyebrow">A Scottish island soap-life game</p>
        <h1 id="game-title">The Close</h1>
        <p className="heroCopy">
          Live through one season on Skerrybrae, where every ferry delay, pub rumour, family secret, and village hall
          vote can change your future.
        </p>
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
