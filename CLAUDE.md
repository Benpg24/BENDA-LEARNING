# CLAUDE.md — Benda Training App

## Project Overview
A staff training and product reference app for the Benda Motorcycles franchise, built for dealership staff. Staff must complete 100% of quizzes before selling on the floor. The app also runs on iPads in the showroom so customers can browse and compare bikes in the range.

---

## Connected Integrations

| Service | What It Does |
|---|---|
| Supabase (Sydney) | Central data — auth, quiz results, questions DB, admin panel. URL: `https://mkgtelifcumbsmqhavkc.supabase.co` |
| Resend (free tier) | **Planned — not yet built.** Will auto-email a certificate of completion to the head of HR when a staff member hits 100% quiz score. This is the trigger that authorises them to sell to customers. |
| Netlify (free tier) | Hosting — deployed via drag-and-drop of the Vite `dist` folder |
| GitHub | Source control — stores the codebase |

---

## Development Rules

**Rule 1: Always read first**
Before taking any action, always read `CLAUDE.md`. If it doesn't exist, create it before doing anything else.

**Rule 2: Define before you build**
Before writing any code:
- Understand what the app does and who uses it
- Know the tech stack, data models, and third-party services
- Know what "done" looks like for this task
- Ask if anything is unclear before starting

**Rule 3: Look before you create**
Always look at existing files before creating new ones. Don't start building until you understand what's being asked. If anything is unclear, ask before starting.

**Rule 4: Minimise context**
Always find ways to reduce context window usage. Remove ALL files that are redundant or unnecessary.

**Rule 5: Capture what works**
After any content session, check if the output revealed new patterns or preferences. Keep this a living document.

**Rule 6: Challenge the direction**
Think critically. If there's a faster or smarter path, say so. Don't just execute — push back when it matters.

**Rule 7: Quality gate**
No content gets shipped until it meets the quality bar. Rate honestly. If it's not ready, say what's wrong and fix it first.

**Core Rule**
Do exactly what is asked. Nothing more, nothing less. If something is unclear, ask before starting.

---

## Working Style
- One small change at a time — never rewrite whole sections
- Always edit existing files, never rebuild from scratch
- Tell the user what you're going to change before changing it
- Only touch files relevant to the ask
- Warn before touching structural code
- When doing large removals use Python rather than the Edit tool

---

## Testing
- Skip preview tools — they don't render correctly for this project
- Ask the user to check on their phone and wait for feedback
- Phone: `http://172.20.10.12:5173` (Mac hotspot)
- Laptop: `http://127.0.0.1:5173` in Chrome (not Safari)

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Vite + React 19 (JSX) |
| Styling | Inline styles |
| Fonts | Geist (body), Outfit, Rajdhani, Georgia (system) |
| Backend/Auth | Supabase (Sydney region) — client in `src/supabase.js` |
| Email | Resend (free tier) |
| Hosting | Netlify (free tier, drag-and-drop `dist` folder) |
| Source Control | GitHub |
| Dev Environment | Claude Code (terminal) |
| No TypeScript | |

---

## File Structure

```
benda-learning/
├── src/
│   ├── App.jsx           # Root component + screens not yet split
│   ├── shared.jsx        # Shared React constants + components (C, bd, crd, A, Ring, HoverCard etc.)
│   ├── supabase.js       # Supabase client
│   ├── index.css
│   ├── main.jsx
│   ├── data/
│   │   └── bikes.js      # All bike data + pure JS helpers (bm, om, bs, nb, compKey)
│   └── pages/
│       ├── HomeTab.jsx
│       ├── RangeTab.jsx
│       ├── TrainTab.jsx
│       ├── CompareTab.jsx
│       └── ProgressTab.jsx
├── public/
│   ├── images/           # All bike photos + UI icons
│   └── BendaBikeIcons/   # Bike icon PNGs
└── dist/                 # Built output — drag to Netlify
```

---

## App Features

- **Range** — Overview of all 5 bikes with key stats, LAMS status, price
- **Bike pages** — Individual pages per bike with Learn, Specs, and Quiz tabs
- **Flashcards** — Study tool per bike
- **Compare** — Side-by-side bike comparison
- **Progress tracking** — Per-user quiz completion
- **Admin panel** — Manage questions and view staff progress (Supabase)
- **Certificate** — *(Planned)* Auto-emailed to head of HR on 100% quiz completion (Resend) — authorises staff member to sell to customers

---

## The 5 Bikes

| Model | Price | LAMS Approved |
|---|---|---|
| Napoleonbob 250 | $8,990 | Yes |
| Napoleonbob 500 | $11,990 | Yes |
| Chinchilla 500 | $9,990 | Yes |
| Dark Flag 500 Commander | $12,990 | Yes |
| LFC 700 | $16,990 | No |

---

## Improvement Suggestions

Only suggest improvements if you spot something genuinely worth rethinking — a real UX problem, a broken pattern, or a missing feature that matters. Don't offer suggestions unprompted unless it's important. The user will ask when they want input.

---

## Secrets & Safety

- Never put API keys directly in code
- Never commit `.env` to GitHub
- Supabase URL is public-safe; keep the `service_role` key server-side only
- Ask before deleting or renaming any important files

---

## Dev Server

Run: `npm run dev` from `/Users/benpg/Documents/BENDA-LEARNING`

---

## Testing Checklist

Before marking any task done:
- [ ] `npm run build` completes without errors
- [ ] Feature works on mobile screen size (phone/iPad)
- [ ] No existing features broken
