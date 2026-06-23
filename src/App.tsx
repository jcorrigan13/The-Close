import { useEffect, useMemo, useState } from "react";
import { CharacterDirectory } from "./components/CharacterDirectory";
import { CharacterProfile } from "./components/CharacterProfile";
import { CharacterCreation } from "./components/CharacterCreation";
import { EpisodeScreen } from "./components/EpisodeScreen";
import { FamilyScreen } from "./components/FamilyScreen";
import { FinaleScreen } from "./components/FinaleScreen";
import { IslandOverview } from "./components/IslandOverview";
import { JournalScreen } from "./components/JournalScreen";
import { Navigation } from "./components/Navigation";
import { RelationshipScreen } from "./components/RelationshipScreen";
import { StartScreen } from "./components/StartScreen";
import { characters } from "./data/characters";
import { applyChoice, createNewGame } from "./engine/gameEngine";
import { clearSave, hasSave, loadGame, saveGame } from "./storage/saveGame";
import type { Choice, GameState, Player, Screen } from "./types";

function App() {
  const [screen, setScreen] = useState<Screen>("start");
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [saveAvailable, setSaveAvailable] = useState(false);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);

  useEffect(() => {
    setSaveAvailable(hasSave());
  }, []);

  const selectedCharacter = useMemo(
    () => characters.find((character) => character.id === selectedCharacterId) ?? characters[0],
    [selectedCharacterId],
  );

  const startNewGame = () => {
    setScreen("create");
  };

  const continueGame = () => {
    const save = loadGame();
    if (save) {
      setGameState(save);
      setScreen(save.endingId ? "finale" : "overview");
    }
  };

  const createGame = (player: Player) => {
    const nextState = createNewGame(player);
    setGameState(nextState);
    saveGame(nextState);
    setSaveAvailable(true);
    setScreen("overview");
  };

  const chooseEpisodeOption = (episodeId: string, choice: Choice) => {
    if (!gameState) return;
    const nextState = applyChoice(gameState, episodeId, choice);
    setGameState(nextState);
    saveGame(nextState);
    setSaveAvailable(true);
    setScreen(nextState.endingId ? "finale" : "episode");
  };

  const resetSave = () => {
    const shouldReset = window.confirm("Reset your saved game and return to the title screen?");
    if (!shouldReset) return;
    clearSave();
    setGameState(null);
    setSaveAvailable(false);
    setSelectedCharacterId(null);
    setScreen("start");
  };

  const openProfile = (characterId: string) => {
    setSelectedCharacterId(characterId);
    setScreen("profile");
  };

  if (!gameState) {
    if (screen === "create") {
      return <CharacterCreation onCreate={createGame} onBack={() => setScreen("start")} />;
    }

    return <StartScreen hasSave={saveAvailable} onNewGame={startNewGame} onContinue={continueGame} />;
  }

  return (
    <div className="appShell">
      <Navigation activeScreen={screen} onNavigate={setScreen} hasEnding={Boolean(gameState.endingId)} />
      <main className="mainPanel">
        {screen === "overview" && (
          <IslandOverview state={gameState} onStartEpisode={() => setScreen("episode")} onOpenProfile={openProfile} />
        )}
        {screen === "episode" && <EpisodeScreen state={gameState} onChoose={chooseEpisodeOption} />}
        {screen === "directory" && <CharacterDirectory state={gameState} onOpenProfile={openProfile} />}
        {screen === "profile" && (
          <CharacterProfile character={selectedCharacter} state={gameState} onBack={() => setScreen("directory")} />
        )}
        {screen === "families" && <FamilyScreen />}
        {screen === "relationships" && <RelationshipScreen state={gameState} onOpenProfile={openProfile} />}
        {screen === "journal" && <JournalScreen state={gameState} />}
        {screen === "finale" && <FinaleScreen state={gameState} onReset={resetSave} />}
      </main>
      <button className="ghostButton resetButton" type="button" onClick={resetSave}>
        Reset save
      </button>
    </div>
  );
}

export default App;
