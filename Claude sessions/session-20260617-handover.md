# Session Handover — 2026-06-17

## Start with this prompt

We're building the Benda Motorcycles staff training app. Read CLAUDE.md first, then continue.

The AI scenario bot is now working end-to-end. The critical bug from this session was fixed: when a user replied to the customer, the Anthropic API was rejecting the request because the messages array started with `role: 'assistant'` (the customer's opening line). Fixed in `netlify/functions/chat.js` by prepending a dummy user message when the array starts with assistant.

Also fixed: `netlify.toml` now has a `[dev]` block locking port to 8888 and targetPort 5173 — no more random ports on restart.

## Local dev
Run from project directory:
```
lsof -ti:8888,5173,5174,5175 | xargs kill -9 2>/dev/null; cd /Users/benpg/Documents/BENDA-LEARNING && npx netlify dev
```
Phone URL: `http://172.20.10.12:8888`

## Current state of the scenario bot
- 3 personas: Liam (easy), Steph (medium), Dave (hard)
- Two-pass architecture: Customer chat (Pass 1) + Coach debrief (Pass 2) — both working
- Easy mode shows [HINT] tips after each customer reply
- Medium mode has a "Check In" button mid-session
- Session ends with SOLD / WALKED / TIME UP outcome
- Voice input working
- Bug fix pushed to GitHub main

## Priority list for next session (in order)

1. **Supabase auth + progress saving** — nothing gets saved between sessions right now. Staff need to log in and have their quiz scores persist. This is blocking launch.
2. **Personal dashboards** — staff see their own completion stats with their name
3. **Manager/HR view** — see all staff completion at a glance
4. **Certificate popup + Resend email** — triggers at 100% quiz completion, goes to staff + HR. This is the launch authorisation trigger.
5. **Quiz quality overhaul** — restructure difficulty tiers, fix bad questions

## Launch target
Next week — ~20-30 staff members onboarding.

## What was built this session
- Fixed scenario bot reply bug (Anthropic API messages order)
- Locked netlify dev to port 8888 via netlify.toml
- All pushed to GitHub main
