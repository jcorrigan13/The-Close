import { characters } from "../data/characters";
import { families } from "../data/families";
import { locations } from "../data/locations";

export function FamilyScreen() {
  return (
    <section className="screenStack">
      <div className="screenHeader">
        <p className="eyebrow">Households and businesses</p>
        <h1>The families of Skerrybrae</h1>
        <p>Each family keeps its place in the island story even as loyalties shift.</p>
      </div>
      <div className="familyCards">
        {families.map((family) => {
          const location = locations.find((item) => item.id === family.locationId);
          const members = characters.filter((character) => character.familyId === family.id);
          return (
            <article className="panel familyPanel" key={family.id}>
              <div className="familyHeader">
                <span className={`iconBadge icon-${family.icon}`} aria-hidden="true" />
                <div>
                  <p className="eyebrow">{family.role}</p>
                  <h2>{family.name}</h2>
                </div>
              </div>
              <p>
                <strong>{family.business}</strong> at {location?.name}
              </p>
              <p>{family.vibe}</p>
              <div className="tagRow">
                {family.themes.map((theme) => (
                  <span className="tag" key={theme}>
                    {theme}
                  </span>
                ))}
              </div>
              <div className="memberLine">
                {members.map((member) => (
                  <span key={member.id}>
                    {member.firstName} {member.lastName}
                  </span>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
