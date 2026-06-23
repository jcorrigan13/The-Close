import type { Location } from "../types";

export function LocationBackdrop({ location, compact = false }: { location?: Location; compact?: boolean }) {
  const theme = location?.id ?? "harbour";
  return (
    <div className={`locationBackdrop backdrop-${theme} ${compact ? "compact" : ""}`} aria-hidden="true">
      <div className="backdropSky" />
      <div className="backdropHorizon" />
      {renderDetails(theme)}
    </div>
  );
}

function renderDetails(theme: string) {
  if (theme === "selkie-arms") {
    return (
      <>
        <span className="pubSign">Selkie</span>
        <span className="fairyLights" />
        <span className="barShelf shelfOne" />
        <span className="barShelf shelfTwo" />
      </>
    );
  }
  if (theme === "wee-shop") {
    return (
      <>
        <span className="shopAwning" />
        <span className="noticeBoard" />
        <span className="counterShape" />
      </>
    );
  }
  if (theme === "macrae-farm") {
    return (
      <>
        <span className="farmField fieldOne" />
        <span className="farmField fieldTwo" />
        <span className="farmFence" />
        <span className="sheep sheepOne" />
        <span className="sheep sheepTwo" />
      </>
    );
  }
  if (theme === "rowan-house") {
    return (
      <>
        <span className="guestHouse" />
        <span className="vacancySign">Vacancies</span>
        <span className="gardenDots" />
      </>
    );
  }
  if (theme === "village-hall" || theme === "school-bus-stop") {
    return (
      <>
        <span className="hallShape" />
        <span className="bunting" />
        <span className="posterWall" />
      </>
    );
  }
  if (theme === "beach-path") {
    return (
      <>
        <span className="moonShape" />
        <span className="stoneWall" />
        <span className="windLine windOne" />
        <span className="windLine windTwo" />
      </>
    );
  }
  return (
    <>
      <span className="ferryBoat" />
      <span className="waveLine waveOne" />
      <span className="waveLine waveTwo" />
      <span className="gull gullOne" />
      <span className="gull gullTwo" />
      <span className="ropePost" />
    </>
  );
}
