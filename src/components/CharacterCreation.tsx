import { useState } from "react";
import { ageBrackets, ambitions, backgrounds, personalityTraits } from "../data/options";
import type { AgeBracket, Ambition, Background, PersonalityTrait, Player } from "../types";

interface CharacterCreationProps {
  onCreate: (player: Player) => void;
  onBack: () => void;
}

export function CharacterCreation({ onCreate, onBack }: CharacterCreationProps) {
  const [firstName, setFirstName] = useState("Jess");
  const [surname, setSurname] = useState("Kerr");
  const [ageBracket, setAgeBracket] = useState<AgeBracket>("25-34");
  const [background, setBackground] = useState<Background>("returning");
  const [trait, setTrait] = useState<PersonalityTrait>("loyal");
  const [ambition, setAmbition] = useState<Ambition>("Start Over");

  const canCreate = firstName.trim().length > 0 && surname.trim().length > 0;

  return (
    <main className="creationScreen">
      <section className="screenHeader">
        <p className="eyebrow">Character creation</p>
        <h1>Who arrives on Skerrybrae?</h1>
        <p>Choose the background and ambition that will colour your first season.</p>
      </section>

      <form
        className="creationForm"
        onSubmit={(event) => {
          event.preventDefault();
          if (!canCreate) return;
          onCreate({
            firstName: firstName.trim(),
            surname: surname.trim(),
            ageBracket,
            background,
            trait,
            ambition,
          });
        }}
      >
        <div className="formGrid">
          <label>
            First name
            <input value={firstName} onChange={(event) => setFirstName(event.target.value)} />
          </label>
          <label>
            Surname
            <input value={surname} onChange={(event) => setSurname(event.target.value)} />
          </label>
          <label>
            Age bracket
            <select value={ageBracket} onChange={(event) => setAgeBracket(event.target.value as AgeBracket)}>
              {ageBrackets.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <label>
            Background
            <select value={background} onChange={(event) => setBackground(event.target.value as Background)}>
              {backgrounds.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Personality
            <select value={trait} onChange={(event) => setTrait(event.target.value as PersonalityTrait)}>
              {personalityTraits.map((option) => (
                <option key={option}>{titleCase(option)}</option>
              ))}
            </select>
          </label>
          <label>
            Main ambition
            <select value={ambition} onChange={(event) => setAmbition(event.target.value as Ambition)}>
              {ambitions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="buttonRow">
          <button type="submit" className="primaryButton" disabled={!canCreate}>
            Begin season
          </button>
          <button type="button" className="ghostButton" onClick={onBack}>
            Back
          </button>
        </div>
      </form>
    </main>
  );
}

function titleCase(value: string) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}
