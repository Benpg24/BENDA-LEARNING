# Session Handover — 20 June 2026

## What was built this session

This session was a continuation that was summarised from a previous context window. The key work done across the full arc was:

### Phase 2 — Supabase auth + per-user progress
- Built `src/Login.jsx` — sign-in / create-account form with gold focus highlight, confirm password, fade-in transition
- Rewrote `useProg(userId)` in `App.jsx` — replaces broken `window.storage` with real Supabase-backed persistence (debounced 600ms writes to `public.progress`)
- Auth gate in `App.jsx` — loads session on mount, shows Login screen if no session, 0.55s fade-in animation when app opens
- Profile loading — reads `full_name` + `role` from `public.profiles`, passes `firstName` to HomeTab

### Phase 3 — Manager dashboard
- Created `src/pages/ManagerScreen.jsx` — reads all staff profiles + progress, shows X/total shop-floor ready summary, per-staff progress bar + bike cert count
- Gold "Team Progress" button in ProgressTab (visible only to manager/admin role)
- `is_manager()` security-definer function in Supabase to avoid RLS recursion

### Other fixes
- `src/ErrorBoundary.jsx` — React error boundary wrapping the whole app
- Dark Flag homepage image fixed (missing `.png` extension)
- `src/pages/TrainTab.jsx` deleted (dead code)
- AI bot (`netlify/functions/chat.js`) hardened with input validation + proper error responses
- Medium/Hard AI scenarios locked as "Coming Soon" in BotTab
- Login screen polish: logo 120px, spacing, gold focus ring, confirm password field

---

## Current state of Supabase

### Tables
- `public.profiles` — id, email (NOT NULL), full_name, role (default 'staff'), created_at
- `public.progress` — user_id, data (jsonb), updated_at

### Triggers + functions
- `handle_new_user()` trigger — auto-creates profile on signup, inserts id + email + full_name
- `is_manager()` function — returns true if current user's role is 'manager' or 'admin'

### SQL that MUST have been run (confirm in Supabase if unsure)
```sql
grant usage on schema public to anon, authenticated;
grant select on public.profiles to authenticated;
grant select, insert, update on public.progress to authenticated;
```
Plus all RLS policies in `supabase/schema.sql`.

**If "Welcome back, there" is still showing** → the grants above haven't been run yet. Run them in Supabase SQL Editor.

---

## Pending tasks (priority order)

### 1. URGENT — Verify grants are live
Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/mkgtelifcumbsmqhavkc/sql/new), paste and run the grants SQL above, then refresh the app. Should see "Welcome back, Ben" and progress should persist on refresh.

### 2. Set Ben's role to manager
In Supabase Table Editor → `profiles` → find Ben's row → set `role` to `manager`. This unlocks the "Team Progress" button in the app.

### 3. Deploy functions to production
The AI bot is still broken on the live Netlify site because Netlify drag-and-drop only deploys the frontend — functions don't go with it. Fix:
```bash
cd /Users/benpg/Documents/BENDA-LEARNING
netlify deploy --prod
```
This deploys everything including `netlify/functions/chat.js`.

### 4. Full test checklist
- [ ] Sign up a new account → check name appears on home screen
- [ ] Complete a quiz → refresh app → progress should stick
- [ ] Team Progress view loads for manager account
- [ ] AI bot (Easy scenario) works end-to-end on live site after function deploy

### 5. Phase 4 — Completion certificate (future)
When a staff member hits 100% overall score, auto-email HR using Resend. Not yet started. Integration: Resend free tier. Trigger: in `useProg` when overall reaches 100 for the first time.

---

## Key file locations
| File | Purpose |
|---|---|
| `src/App.jsx` | Root — auth state, session, profile, useProg hook |
| `src/Login.jsx` | Sign-in / create-account screen |
| `src/pages/ManagerScreen.jsx` | Team progress dashboard |
| `src/pages/ProgressTab.jsx` | Per-user progress + sign out + team button |
| `src/pages/HomeTab.jsx` | Home tab — receives `name` prop |
| `netlify/functions/chat.js` | AI scenario bot (Anthropic claude-haiku) |
| `supabase/schema.sql` | Full DB schema reference |

## Dev commands
```bash
# Local dev (frontend only, no bot)
npm run dev

# Local dev with bot (port 8888)
netlify dev

# Deploy everything to production
netlify deploy --prod
```

Phone testing: `http://172.20.10.12:8888` (Mac hotspot, must be on personal hotspot not regular WiFi)
