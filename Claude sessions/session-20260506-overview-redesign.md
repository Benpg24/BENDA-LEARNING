# Session Handover

## Session ID
20260506-overview-redesign

## Date
6 May 2026

## Session Title
Bike Overview Redesign — All Models

---

## Changes Made

### src/App.jsx
- **Replaced `LearnTab` entirely** with a new `BikeLearnTab` component that applies to all 5 bikes
- New overview layout (matches screenshot mockup):
  1. **Hero** — bike image right, name/price/type text overlaid left with gradient fade
  2. **Attribute badges** — 3 icon pills (type / feel / licence) using `b.badges[]`
  3. **TYPE / FEEL / WHO rows** — full-text anchor data returned from anchors.type/feel/who, displayed as label+text rows in a bordered card
  4. **Quick Pitch** — mic icon, `b.sellingPoints[0].text`
  5. **Why Customers Love It** — heart icon, 2×2 bullet grid from `b.love[]`
  6. **Key Highlights** — horizontal scroll row, 5 stats (4 from `b.stats` + fuel from `b.specs[0].rows[5][1]`), gold icons + gold values
  7. **Sales Playbook** — 2×2 grid from `b.sellingPoints`, white icons
  8. **Continue Training** — gold button → navigates to Quiz tab
- `LearnTab` is now a one-liner wrapper: `return <BikeLearnTab bike={b} onQuiz={onQuiz}/>;`
- Old `LearnSLabel` component removed
- `BikeLearnTab` uses dynamic font sizing for stat values: `vSz=v=>v.length<=4?22:v.length<=5?18:v.length<=9?14:11`
- Colour constants: `GT` = gold (price, KEY HIGHLIGHTS), `WI` = `rgba(255,255,255,0.8)` (all other icons), white for headings
- BikeScreen now passes `onQuiz={()=>sT("quiz")}` to LearnTab

### src/data/bikes.js
Added to all 5 bikes after `anchors`:
- `badges:[str, str, str]` — 3 short strings for the icon badge pills
- `love:[str, str, str, str]` — 4 bullet points for "Why Customers Love It"

**Per bike:**
| Bike | badges | love |
|---|---|---|
| nb250 | Retro bobber / Light & easy / LAMS approved | Easy to ride and manoeuvre / Real head-turning bobber style / LAMS approved and road-ready / Premium quality at an amazing value |
| nb500 | Mid bobber / Belt drive / LAMS approved | Lower seat than the NB250 / Smoother belt drive / Same V-twin as Chinchilla / LAMS approved and road-ready |
| ch500 | City cruiser / USD forks / LAMS approved | Classic cruiser stance / Twin exhausts for that sound / USD forks — sportsbike tech / LAMS approved and road-ready |
| df500 | V4 tech cruiser / Air suspension / LAMS approved | V4 engine — rare at this price / Electronic air suspension / Cruise control as standard / Adjustable seat height |
| lfc700 | Inline-4 world first / Brembo brakes / Full licence | World's first inline-4 cruiser / Brembo MotoGP-grade brakes / Widest rear tyre in production / KYB premium suspension |

---

## Colour Rules (Overview Tab)
- **Gold** (`GT`/`GOLD`): price, KEY HIGHLIGHTS heading, KEY HIGHLIGHTS stat values, KEY HIGHLIGHTS icons (strokeWidth 2)
- **White** (`#fafafa` / `WI`): all other headings, labels, icons (strokeWidth 1.5), badge text, type label in hero
- **Dimmed white** `rgba(255,255,255,0.5)`: TYPE / FEEL / WHO row labels
- **Body text** (`C.t2`): description paragraphs, bullet points

---

## Not Done / Left Open
- **Homepage progress bar alignment** — user asked to align the rev counter progress bar to the centre of the text above it on the Continue Training card (HomeTab). Was mentioned but not actioned this session.
- **Badge removal decision** — user is still deciding whether to remove the 3 icon badges now that TYPE/FEEL/WHO rows are back. Leave until they give feedback from phone.

---

## Files Modified
- `src/App.jsx`
- `src/data/bikes.js`

## Build Status
No build run — all changes are layout/styling only, no logic changes

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
- Gold reserved for: price, KEY HIGHLIGHTS section only (in overview), RESUME button, SpeedoDial, featured garage border, section rule lines, Range tab prices
- Data in `src/data/bikes.js`, shared constants in `src/shared.jsx`, pages in `src/pages/`
- When doing large removals or multi-occurrence replacements, use Python via Bash rather than Edit tool
