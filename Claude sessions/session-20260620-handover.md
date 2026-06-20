# Session Handover — 20 June 2026 (Evening)

## What was fixed this session

### Auth & name display
- Supabase grants were missing — ran them in SQL Editor (`grant usage`, `grant select on profiles`, `grant select/insert/update on progress`)
- RLS policies were also missing — ran full policy set (`read own profile`, `managers read all profiles`, etc.)
- Name still wasn't showing after both fixes — root cause: profile DB query was failing silently and `profile?.full_name` was null
- Fix: added `session?.user?.user_metadata?.full_name` as fallback in `App.jsx` — name now reads directly from the auth session (always available) rather than waiting on the DB query
- Added `creator` role alongside `manager`/`admin` as a role that unlocks Team Progress — Ben's role is set to `creator` in Supabase

### Sign out button
- Added a small "Sign out" button top-right of the home screen header in `HomeTab.jsx`
- Wired to `signOut()` in `App.jsx` — signs out via Supabase and returns to login screen

### UI tweaks
- Speedometer dial in Continue Training card shifted left (`justifyContent: flex-start`) to align under the text

### Dev server
- The preview tool cannot launch `netlify dev` (EPERM on the netlify CLI binary)
- **Correct way to start the bot server:** run `npx netlify dev` in the background from the project root
- This starts Vite on port 5173 (internal) and exposes everything including functions on **port 8888**
- Phone connects to `http://172.20.10.12:8888` (Mac hotspot only)
- Port 5173 is Vite only — no bot functions. Always use 8888.
- The `.claude/launch.json` is set back to `npm run dev` on 5173 for the preview tool (frontend-only tasks)

### AI bot fixes
- **"Something went wrong" on second message:** messages were stored with an extra `hint` field (`{role, content, hint}`). When passed back to the Anthropic API, the extra field caused a validation error. Fixed in `netlify/functions/chat.js` by stripping to `{role, content}` only before the API call
- **iOS keyboard layout glitch:** when typing in the bot, the keyboard pushed the layout and tabs disappeared. Fixed by adding `interactive-widget=resizes-content` to the viewport meta in `index.html`
- **Conversation lost on tab switch:** BotTab was unmounting every time the user switched tabs, wiping scenario state. Fixed in `App.jsx` by always keeping BotTab mounted and toggling `display: none/block` instead
- **Filler words:** customer persona was saying "oh yeah", "like", "you know?" etc. Added explicit rule in `buildCustomerSystem` to cut them out
- **Hint coaching:** first hint was telling users to ask about licence immediately. Updated to coach rapport-building first — acknowledge what the customer said, open questions, licence/specs after connection is established

---

## Current app state

### What's working
- Sign in / sign up with name display ✓
- Sign out button on home screen ✓
- Progress saves and persists across sessions ✓
- AI Coach (chat mode) — multi-turn conversation works ✓
- Customer Scenarios (Liam / Easy) — full scenario with hints, debrief ✓
- Scenario state survives tab switches ✓
- iOS keyboard no longer breaks layout ✓

### What's still locked / coming soon
- Steph and Dave scenarios are marked `comingSoon: true` in `PERSONA_CARDS` — they exist in the system but are hidden in the UI
- Team Progress (manager dashboard) — works but only accessible if role is `manager`, `admin`, or `creator`
- Completion certificate via Resend — not started

---

## Supabase state

### Tables
- `public.profiles` — id, email, full_name, role (default 'staff'), created_at
- `public.progress` — user_id, data (jsonb), updated_at

### Roles in use
- `staff` — default, standard access
- `creator` — same access as manager (unlocks Team Progress button)
- `manager` / `admin` — same as creator

### Current users
- Ben Pink-Gyett — role: `creator`, email: b.pink-gyett@bendamoto.com.au

### RLS policies (all confirmed live)
- `read own profile` — users can read their own profile row
- `managers read all profiles` — manager/admin role can read all profiles
- `read own progress` / `insert own progress` / `update own progress`
- `managers read all progress`

---

## Pending tasks (priority order)

### 1. Deploy to production (Netlify CLI)
AI bot still broken on the live Netlify site — drag-and-drop only deploys the frontend. Need to run:
```bash
cd /Users/benpg/Documents/BENDA-LEARNING
npx netlify deploy --prod
```
This deploys functions too. Do this before sharing with staff.

### 2. Unlock Steph + Dave scenarios
In `src/pages/BotTab.jsx`, `PERSONA_CARDS` — remove `comingSoon: true` from Steph and Dave when ready to enable them.

### 3. Team Progress — manager access for real managers
When real manager/staff accounts are created, set their role in Supabase `profiles` table.

### 4. Completion certificate (Phase 4)
When a staff member hits 100% overall, auto-email HR via Resend. Not started. Trigger point: `useProg` in `App.jsx` when overall score reaches 100 for the first time.

### 5. Test full staff onboarding flow
- Sign up as a new staff account
- Complete a quiz
- Verify progress saves on refresh
- Verify name shows correctly

---

## Key files
| File | Purpose |
|---|---|
| `src/App.jsx` | Root — auth, session, name fallback, BotTab persistence fix |
| `src/Login.jsx` | Sign in / sign up screen |
| `src/pages/HomeTab.jsx` | Home tab — sign out button, speedometer alignment |
| `src/pages/BotTab.jsx` | AI coach + scenarios — always mounted now |
| `src/pages/ManagerScreen.jsx` | Team progress dashboard |
| `netlify/functions/chat.js` | AI bot function — message sanitisation, persona prompts, hints |
| `index.html` | Viewport meta — interactive-widget fix |
| `supabase/schema.sql` | Full DB schema reference |

## Dev commands
```bash
# Local dev with bot (port 8888) — USE THIS for phone testing
npx netlify dev

# Local dev frontend only (port 5173) — no bot
npm run dev

# Deploy everything to production including functions
npx netlify deploy --prod
```

Phone: `http://172.20.10.12:8888` (Mac hotspot — must be on personal hotspot, not regular WiFi)
