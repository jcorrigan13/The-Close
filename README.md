# The Close

The Close is a first playable React and TypeScript browser game about one dramatic season on Skerrybrae, a fictional Scottish island where family businesses, ferry delays, pub gossip, village hall politics, romance, secrets, and local loyalty collide.

## Features

- React + TypeScript + Vite single-page game
- Character creation with age bracket, background, personality trait, and main ambition
- LocalStorage save, continue, autosave after episode choices, and reset
- 18 original starting characters across six families
- Permanent locations and family/business screens
- Clickable SVG/CSS Skerrybrae map hub with live location states
- 3 rewritten long-form scene-based episodes, plus roadmap placeholders for episodes 4-10
- Dialogue scenes, choice result panels, visible consequences, hidden future locks, and cliffhangers
- Stats, relationship scores and states, hidden flags, discovered secrets, recaps, story hooks, gossip, and parenthood route state
- Island Pulse / Skerrybrae Today updates based on story state
- Island Group Chat / gossip feed with clues and comedy
- Multiple ambition-aware Season 1 endings
- CSS/SVG portrait system with configurable face, hair, outfit, accessory, and expression
- Mobile-friendly responsive layout

## Tech Stack

- React
- TypeScript
- Vite
- Plain CSS
- localStorage

No backend, paid APIs, external art assets, or AI APIs are used in this MVP.

## Run Locally

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

## Game Mechanics

Each episode represents roughly one week on Skerrybrae. The current version uses scene-based episodes: each chapter has multiple scenes, dialogue exchanges, involved character portraits, meaningful choices, immediate reaction text, visible stat/relationship changes, unlocked gossip, story hooks, hidden future locks, and a cliffhanger.

Visible stats are money, mood, reputation, family, romance, career, stress, and island trust. Most stats are better when higher, while high stress is usually risky.

## MVP Scope

This version focuses on a richer first playable slice. Episodes 1-3 are fully rewritten as substantial interactive chapters. Episodes 4-10 are present as locked roadmap placeholders so the season structure can expand without another engine rewrite.

The save format is versioned. Older prototype saves are intentionally not loaded because the episode state changed from short event cards to scene progression.

## Originality Note

The Close is an original fictional game, setting, cast, story, and UI. It is inspired by broad genres such as interactive drama, life progression, community simulation, and long-running soap storytelling, but it does not use existing game, show, character, branding, asset, wording, or storyline material.

## Screenshots

Screenshots can be added here after running the game locally.

## Roadmap

- Fully implement roadmap episodes 4-10
- More seasons and branching mid-season events
- Aging, births, departures, returns, and generational cast changes
- More household mechanics and business pressure events
- Better relationship labels and romance-specific scenes
- Optional accessibility settings for text size and contrast
- Export/import save files

## Future AI Ideas

Future versions could optionally explore dynamic recaps, generated flavour dialogue, new event card generation, character gossip summaries, and personalised ending text. These ideas are not implemented in the first version.
