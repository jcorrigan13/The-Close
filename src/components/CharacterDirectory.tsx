import { useMemo, useState } from "react";
import { characters } from "../data/characters";
import { families } from "../data/families";
import { locations } from "../data/locations";
import type { GameState } from "../types";
import { CastCard } from "./CastCard";

interface CharacterDirectoryProps {
  state: GameState;
  onOpenProfile: (characterId: string) => void;
}

export function CharacterDirectory({ state, onOpenProfile }: CharacterDirectoryProps) {
  const [query, setQuery] = useState("");
  const [familyFilter, setFamilyFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return characters.filter((character) => {
      const relationship = state.relationships[character.id];
      const locationId = character.lastSeenLocationId ?? character.locationId;
      const matchesQuery = `${character.firstName} ${character.lastName} ${character.quote ?? ""} ${character.occupation}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesFamily = familyFilter === "all" || character.familyId === familyFilter;
      const matchesLocation = locationFilter === "all" || locationId === locationFilter;
      const matchesStatus = statusFilter === "all" || relationship?.label === statusFilter || relationship?.states.includes(statusFilter as never);
      return matchesQuery && matchesFamily && matchesLocation && matchesStatus;
    });
  }, [familyFilter, locationFilter, query, state.relationships, statusFilter]);

  const grouped = families
    .map((family) => ({
      family,
      members: filtered.filter((character) => character.familyId === family.id),
    }))
    .filter((group) => group.members.length > 0);

  return (
    <section className="screenStack">
      <div className="screenHeader">
        <p className="eyebrow">Cast board</p>
        <h1>People who know too much</h1>
        <p>Filter by family, location, or relationship state. Known secrets appear after choices uncover them.</p>
      </div>
      <div className="castFilters paperPanel">
        <label>
          Search
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, role, quote..." />
        </label>
        <label>
          Family
          <select value={familyFilter} onChange={(event) => setFamilyFilter(event.target.value)}>
            <option value="all">All families</option>
            {families.map((family) => (
              <option value={family.id} key={family.id}>
                {family.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Location
          <select value={locationFilter} onChange={(event) => setLocationFilter(event.target.value)}>
            <option value="all">All locations</option>
            {locations.map((location) => (
              <option value={location.id} key={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Relationship
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">All statuses</option>
            {["trusted", "suspicious", "romantic tension", "jealous", "hurt", "rival", "neighbour"].map((status) => (
              <option value={status} key={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="castBoard">
        {grouped.map((group) => (
          <section className="castFamilyGroup" key={group.family.id}>
            <div className="castGroupHeader">
              <span className={`iconBadge icon-${group.family.icon}`} aria-hidden="true" />
              <div>
                <p className="eyebrow">{group.family.business}</p>
                <h2>{group.family.name}</h2>
              </div>
            </div>
            <div className="castGrid">
              {group.members.map((character) => (
                <CastCard key={character.id} character={character} state={state} onOpenProfile={onOpenProfile} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
