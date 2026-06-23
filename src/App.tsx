import { useEffect, useMemo, useState } from "react";
import { CharacterDirectory } from "./components/CharacterDirectory";
import { CharacterProfile } from "./components/CharacterProfile";
import { CharacterCreation } from "./components/CharacterCreation";
import { EpisodeScreen } from "./components/EpisodeScreen";
import { FamilyScreen } from "./components/FamilyScreen";
import { FinaleScreen } from "./components/FinaleScreen";
import { GossipScreen } from "./components/GossipScreen";
import { JournalScreen } from "./components/JournalScreen";
import { Navigation } from "./components/Navigation";
import { RelationshipScreen } from "./components/RelationshipScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import { SkerrybraeMap } from "./components/SkerrybraeMap";
import { StartScreen } from "./components/StartScreen";
import { StoryletPlayer } from "./components/StoryletPlayer";
import { ToastNotification } from "./components/ToastNotification";
import { characters } from "./data/characters";
import {
  advanceWeek,
  applySceneChoice,
  applyStoryletChoice,
  createNewGame,
  setPOVCharacter,
  startStorylet,
} from "./engine/gameEngine";
import { clearSave, hasLegacySave, hasSave, loadGame, saveGame } from "./storage/saveGame";
import type { GameState, Player, SceneChoice, Screen, StoryletChoice } from "./types";

function App() {
  const [screen, setScreen] = useState<Screen>("start");
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [saveAvailable, setSaveAvailable] = useState(false);
  const [legacySaveAvailable, setLegacySaveAvailable] = useState(false);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);

  useEffect(() => {
    setSaveAvailable(hasSave());
    setLegacySaveAvailable(hasLegacySave());
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
      setScreen(save.endingId ? "finale" : "map");
    }
  };

  const createGame = (player: Player) => {
    const nextState = createNewGame(player);
    setGameState(nextState);
    saveGame(nextState);
    setSaveAvailable(true);
    setScreen("map");
  };

  const chooseEpisodeOption = (episodeId: string, sceneId: string, choice: SceneChoice) => {
    if (!gameState) return;
    const nextState = applySceneChoice(gameState, episodeId, sceneId, choice);
    setGameState(nextState);
    saveGame(nextState);
    setSaveAvailable(true);
    setScreen(nextState.endingId ? "finale" : "episode");
  };

  const startDynamicStorylet = (storyletId: string, locationId: string) => {
    if (!gameState) return;
    const nextState = startStorylet(gameState, storyletId, locationId);
    setGameState(nextState);
    saveGame(nextState);
    setSaveAvailable(true);
    setScreen("episode");
  };

  const chooseStoryletOption = (storyletId: string, choice: StoryletChoice) => {
    if (!gameState) return;
    const nextState = applyStoryletChoice(gameState, storyletId, choice);
    setGameState(nextState);
    saveGame(nextState);
    setSaveAvailable(true);
    setScreen("map");
  };

  const selectPOV = (characterId: string) => {
    if (!gameState) return;
    const nextState = setPOVCharacter(gameState, characterId);
    setGameState(nextState);
    saveGame(nextState);
    setSaveAvailable(true);
  };

  const advanceIslandWeek = () => {
    if (!gameState) return;
    const nextState = advanceWeek(gameState);
    setGameState(nextState);
    saveGame(nextState);
    setSaveAvailable(true);
    setScreen("map");
  };

  const resetSave = () => {
    const shouldReset = window.confirm("Reset your saved game and return to the title screen?");
    if (!shouldReset) return;
    clearSave();
    setGameState(null);
    setSaveAvailable(false);
    setLegacySaveAvailable(false);
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

    return <StartScreen hasSave={saveAvailable} hasLegacySave={legacySaveAvailable} onNewGame={startNewGame} onContinue={continueGame} />;
  }

  return (
    <div className="appShell">
      <Navigation activeScreen={screen} onNavigate={setScreen} hasEnding={Boolean(gameState.endingId)} />
      <main className="mainPanel">
        {screen === "map" && (
          <SkerrybraeMap
            state={gameState}
            onStartEpisode={() => setScreen("episode")}
            onStartStorylet={startDynamicStorylet}
            onSelectPOV={selectPOV}
            onAdvanceWeek={advanceIslandWeek}
            onOpenProfile={openProfile}
          />
        )}
        {screen === "episode" &&
          (gameState.activeStoryletId ? (
            <StoryletPlayer state={gameState} onChoose={chooseStoryletOption} onBackToMap={() => setScreen("map")} />
          ) : (
            <EpisodeScreen state={gameState} onChoose={chooseEpisodeOption} />
          ))}
        {screen === "directory" && <CharacterDirectory state={gameState} onOpenProfile={openProfile} />}
        {screen === "profile" && (
          <CharacterProfile character={selectedCharacter} state={gameState} onBack={() => setScreen("directory")} />
        )}
        {screen === "families" && <FamilyScreen />}
        {screen === "relationships" && <RelationshipScreen state={gameState} onOpenProfile={openProfile} />}
        {screen === "journal" && <JournalScreen state={gameState} />}
        {screen === "gossip" && <GossipScreen state={gameState} />}
        {screen === "settings" && <SettingsScreen state={gameState} onReset={resetSave} />}
        {screen === "finale" && <FinaleScreen state={gameState} onReset={resetSave} />}
      </main>
      <ToastNotification result={gameState.lastChoiceResult} />
      <button className="ghostButton resetButton" type="button" onClick={resetSave}>
        Reset save
      </button>
    </div>
  );
}

export default App;
