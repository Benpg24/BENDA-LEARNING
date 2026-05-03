# Session Handover

## Session ID
20260503-1200-component-split

## Date
3 May 2026

## Session Title
Component Split — Pages & Shared Layer

## Goal
Split App.jsx into individual page components, following the same pattern as the data split.

## Files Created
- `src/shared.jsx` — shared exports: C, bd, crd, sec, btnA, btnG, BIKE_COLOURS, A, Ring, HoverCard
- `src/pages/RangeTab.jsx` — Range page
- `src/pages/TrainTab.jsx` — Train page
- `src/pages/ProgressTab.jsx` — Progress page
- `src/pages/CompareTab.jsx` — Compare page
- `src/pages/HomeTab.jsx` — Home page (includes SpeedoDial and HomeSLabel privately)

## Files Modified
- `src/data/bikes.js` — added exports: bm, om, bs, nb, compKey
- `src/App.jsx` — imports from shared.jsx + pages/, removed all moved code

## What Remains in App.jsx
- CSS string constant
- BikeCarousel component
- useProg hook (storage logic)
- getTier function
- Icons object
- TabBar component
- Hdr component
- QE (quiz engine)
- Res (results screen)
- HoverBtn, GlossaryItem
- LearnTab, SpecsTab, FlashTab, QuizTab, BikeScreen
- GQScreen, ScScreen (general quiz + scenarios)
- GlossaryTab
- App (root component)

## Not Split Yet (future sessions)
These are the drill-down screens and shared sub-components still in App.jsx.
Candidates for future splits if desired:
- BikeScreen + LearnTab + SpecsTab + FlashTab + QuizTab → src/pages/BikeScreen.jsx
- GQScreen → src/pages/GQScreen.jsx
- ScScreen → src/pages/ScScreen.jsx
- GlossaryTab → src/pages/GlossaryTab.jsx
- TabBar, Hdr, BikeCarousel → src/shared.jsx (already imported there by pages)

## Architecture Pattern
- `src/data/bikes.js` — all data + pure JS helpers (bm, om, bs, nb, compKey)
- `src/shared.jsx` — shared React constants + components (C, bd, crd, A, Ring, HoverCard etc.)
- `src/pages/*.jsx` — one file per tab/screen, imports from shared + data
- `src/App.jsx` — root + remaining screens not yet split

## Build Status
Clean ✓ — 23 modules, 317kb

## Future Claude Instructions
- **One small change at a time** — never rewrite whole sections
- **Always edit existing code**, never rebuild from scratch
- **Tell the user what you're going to change before changing it**
- **Only touch files relevant to the ask**
- **Keep all existing functionality intact** unless explicitly told otherwise
- **Warn before touching structural code**
- The app is **phone-first** — desktop layout is not a priority
- Dev server runs via `npm run dev` from `/Users/benpg/Documents/BENDA-LEARNING`
- Phone testing: use Mac hotspot, phone connects to `http://172.20.10.12:5173`
- Laptop testing: use `http://127.0.0.1:5173` in Chrome (not Safari)
- Gold is reserved for: RESUME button, SpeedoDial, featured garage border, section rule lines
- Quick access items array has `filter` and `sz` per item — always set both when adding/changing icons
- Data lives in `src/data/bikes.js` — edit bike data there, not in App.jsx
- Shared constants/components live in `src/shared.jsx`
- Page components live in `src/pages/`
- When doing large removals use Python rather than Edit tool
