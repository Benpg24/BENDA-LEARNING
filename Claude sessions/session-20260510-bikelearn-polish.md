# Session Handover

## Session ID
20260510-bikelearn-polish

## Date
10 May 2026

## Session Title
BikeLearnTabV2 Polish — Overview / Sales / Specs / Header

---

## Changes Made

### src/App.jsx

#### Header (BikeScreen)
- Replaced `<Hdr title={b.name}/>` with a custom sticky header in `BikeScreen`
- Custom header: back arrow (left) + Benda logo absolutely centred using `position:'absolute',left:0,right:0,display:'flex',justifyContent:'center'`
- Logo: `/images/BENDAlogo.png`, height 42, `filter:'brightness(0) invert(1)'` to make it white

#### Tab bar
- Removed `objections` tab from `TABS` and `TLBL` — objections are gone completely

#### Overview tab
- Badge boxes: kept centered (icon + label)
- TYPE/FEEL/WHO label: `marginTop:-1` to raise label 1px into alignment with body text
- TYPE/FEEL/WHO body text: `textAlign:'left'` added
- Added **Key Facts** numbered section above "Why Customers Love It":
  - Pulls from `b.facts[]` (title + desc per item)
  - Gold number (Rajdhani 800 16px, paddingTop:3), bold title (12px T1), desc (12px T2)
  - Number and title left-aligned
- "Why Customers Love It" body text: `textAlign:'left'` added

#### Sales tab
- Removed the horizontal scrollable stat row from top of Sales
- "Sales Playbook" card title and body text: `textAlign:'left'` added
- `sp[3].title` (objection question) now used as the card title instead of hardcoded "Common Objection"

#### Specs tab
- Replaced 2×2 stat grid with a single horizontal flex row (4 cards, `flex:1` each)
- Stat value fontSize reduced from 28 → 16px
- Added "Key Stats" heading above the row

#### Stat chips row
- Removed entirely (was between hero and tab bar)

### src/data/bikes.js
- All em dashes (` — `) replaced with `, ` globally
- `nb500.sellingPoints[3].title` changed to `"Isn't this the same bike as the Chinchilla?"`
- `nb500.sellingPoints[3].text` rewritten to lead with: "Yes — same engine. The NB500 and Chinchilla 500 share an identical 475cc V-twin..."
- All 5 bikes' `anchors` text already updated in previous session (no em dashes)

---

## Current BikeLearnTabV2 Tab Structure

| Tab | Content |
|---|---|
| Overview | 3 badge boxes → TYPE/FEEL/WHO card → Key Facts (numbered) → Why Customers Love It |
| Specs | "Key Stats" heading → 4-stat horizontal row → spec tables by group |
| Sales | "Sales Playbook" heading → 4 sales cards (Opening Pitch, Ideal Customer, Objection question, Competitor Comparison) |
| Quiz | QuizTab inline |

---

## Colour / Font Rules (unchanged)
- Gold (`C.gold` / `C.goldTxt`): price, stat values, KEY FACTS numbers, KEY HIGHLIGHTS, tab underline
- T1 `#f5f5f5`: headings, badge labels
- T2 `#b8b8b8`: body text
- T3 `#666`: labels, dimmed text
- CARD `#141414`, BORDER `#282828`

---

## Not Done / Left Open
- Nothing explicitly left open — user called handover after "perfect"

---

## Files Modified
- `src/App.jsx`
- `src/data/bikes.js`

---

## Future Claude Instructions
- One small change at a time — never rewrite whole sections
- Always edit existing files, never rebuild from scratch
- Tell the user what you're going to change before changing it
- Only touch files relevant to the ask
- Skip preview tools — ask user to check on phone
- Phone: `http://172.20.10.12:5173` (Mac hotspot)
- Laptop: `http://127.0.0.1:5173` in Chrome
- GitHub: push via GitHub Desktop — user pushes manually
- When doing large removals or multi-occurrence replacements, use Python via Bash
- BikeLearnTabV2 applies to ALL 5 bikes (BikeScreen renders it directly — LearnTab wrapper still exists but only nb500 uses V2 via it; BikeScreen bypasses LearnTab entirely now)
- Tab bar sticky: `position:'sticky', top:54, zIndex:90` — top:54 accounts for the custom BikeScreen header height
