# Session Handover

## Session ID
20260503-1300-homepage-range-polish

## Date
3 May 2026

## Session Title
Homepage & Range Tab Polish

## Changes Made

### HomeTab.jsx
- Added `zoom: 0.9` to outer div for slightly more compact view
- Removed Quick Access section (duplicated bottom nav — saved in memory for future restore)
- Removed Next Quiz CTA (tried a few versions, none felt right — less is more)
- Home screen flow is now: Continue Training → Your Garage → Training Snapshot → Recent Wins

### RangeTab.jsx
- Card background changed from `#000` to `C.s1` to match home page grey
- Redesigned card layout: bike image left, stacked text right (name / type / price)
- Price colour changed from green (`#4ade80`) to gold (`C.goldTxt`)
- Added warm amber radial glow under bike images
- Bike image size: `width:105, height:78`
- Name font size: 14px, Rajdhani, uppercase
- Type: 10px, grey, uppercase, letterSpacing 1.2
- Price: 13px, gold, Rajdhani
- Added `minWidth:0` to text container to keep arrow in place
- Text aligned left

## Other Changes
- Created `CLAUDE.md` in project root (was previously a folder, now a proper file)
- CLAUDE.md includes: project overview, integrations, dev rules, working style, file structure, bike list, testing checklist
- Removed Rule 4 (run npm build after every change)
- Improvement suggestions changed to only flag genuinely important issues
- Certificate marked as planned (not built yet)

## Files Modified
- `src/pages/HomeTab.jsx`
- `src/pages/RangeTab.jsx`
- `CLAUDE.md` (created)

## Build Status
Not explicitly tested — all changes are CSS/layout only, no logic changes

## Future Claude Instructions
- **One small change at a time** — never rewrite whole sections
- **Always edit existing files**, never rebuild from scratch
- **Tell the user what you're going to change before changing it**
- **Only touch files relevant to the ask**
- **Skip preview tools** — they never render correctly, just ask user to check on phone
- **Phone testing**: `http://172.20.10.12:5173` (Mac hotspot)
- **Laptop testing**: `http://127.0.0.1:5173` in Chrome
- **GitHub**: push via GitHub Desktop — user pushes manually after sessions
- Gold reserved for: RESUME button, SpeedoDial, featured garage border, section rule lines, prices in Range tab
- Data in `src/data/bikes.js`, shared in `src/shared.jsx`, pages in `src/pages/`
- When doing large removals use Python rather than Edit tool
