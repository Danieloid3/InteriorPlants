# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page, static landing page (Spanish: *"El Poder de las Plantas"*) — an interactive infographic about interior plants: air purification, plant biology, and basic care. Pure vanilla **HTML/CSS/JS with no framework and no build step**. The three root files (`index.html`, `styles.css`, `script.js`) are the entire app.

## Commands

- `npm run dev` — local dev server (Vite). The only script that works.
- `npm test` is a placeholder that exits 1; there are no tests.
- **Deploy**: Netlify serves the repo root verbatim (`netlify.toml`: `publish = "."`, empty `command`). There is no compile/bundle step — whatever is in the root is what ships. Editing `index.html`/`styles.css`/`script.js` and pushing is the whole deploy workflow.

## Architecture

**`index.html`** holds all content and structure as one page of `<section>` elements: `#s-hero`, `#s-datos` (science stats), `#s-especies` (plant catalog), `#s-cuidados` (care carousel), plus the footer and a single shared modal (`#plantModal`).

**Plant catalog data lives in the HTML, not in JS.** Each plant is a `.friend-card` div carrying its full dataset as `data-*` attributes: `data-name`, `data-sub`, `data-img`, `data-color`, `data-desc`, `data-luz`, `data-agua`, `data-extra`, `data-diff`. To add or edit a plant, edit these attributes — `initPlantModals()` in `script.js` reads them on click and injects them into the shared modal. There is no separate data source to keep in sync.

**`script.js`** is plain (non-module) vanilla JS. One `DOMContentLoaded` handler calls a series of independent feature initializers: scroll-reveal via `IntersectionObserver` (`.pop-in`), animated progress bars, randomized floating animation on photos, arrow-key section navigation, the plant modal, and the care carousel dots. Comments are in Spanish.

**`styles.css`** drives a deliberate neo-brutalist / playful aesthetic via a `:root` design-token system: thick borders (`--border-width: 4px`), hard offset shadows (`--shadow-flat`/`--shadow-hover`/`--shadow-modal`, e.g. `4px 4px 0px`), a blob border-radius, and a bouncy `cubic-bezier` transition. Color tokens `--c-pink`/`--c-blue`/`--c-yellow`/`--c-purple` etc. are referenced **both** in CSS and inside HTML `data-color="var(--c-pink)"` attributes. Fonts (Fredoka body, Nunito titles) load via a Google Fonts `@import`. Preserve these tokens and the hard-shadow look when styling new elements.

## Conventions & gotchas

- **Content is Spanish** — keep new copy and UI strings in Spanish.
- **Plant/hero images are remote Wikimedia Commons URLs** referenced directly in `index.html`. The local `images/` folder PNGs are currently **not** wired up.
- Footer nav anchors and the arrow-key navigation both depend on section order/IDs; keyboard nav iterates `<section>` elements in document order, so reordering sections changes navigation behavior.
- `.agents/skills/` (frontend-design, github-manager) is bundled agent tooling, not application code.
