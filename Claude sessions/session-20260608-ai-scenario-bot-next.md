# Session Handover — 2026-06-08

## Start with this prompt

We're building the Benda Motorcycles staff training app. Read CLAUDE.md first, then continue.

The priority for this session is rebuilding the AI scenario training system using a two-pass architecture:

**Pass 1 — Customer (live chat):** 5 personas (Liam the nervous first-timer, Dave the know-it-all, Mark the value skeptic, Steph the quiet browser, Jase the experienced rider). Each has a hidden buy checklist — staff must qualify them, handle objections, push for a test ride, and close. Max 4-5 exchanges. Customer stays in character the whole time, no coaching mid-conversation. If the salesperson makes a factual error the customer nudges them naturally. Session ends when they buy, walk, or the trainee closes.

**Pass 2 — Coach (separate API call after session ends):** Sees the full transcript + customer persona + buy checklist. Gives a structured debrief: outcome, scorecard (discovery, bike match, brand handling, objection handling, factual accuracy, the close — each rated 1-5), 3-5 key moments with exact quotes and better alternatives, nudge recovery, and one thing to fix next time.

The full prompt framework was shared by the user in the previous session. The spec block (bikes, prices, warranty, servicing) is already in `netlify/functions/chat.js`. The current scenario system is basic and needs to be replaced entirely with this two-pass system.

After the scenario bot, the next priorities are:
1. Supabase auth + progress saving (nothing gets lost between sessions)
2. Personal dashboards (staff see their own stats with their name)
3. Manager/HR view (see all staff completion at a glance)
4. Certificate popup + Resend email (triggers at 100% completion, goes to staff + HR)
5. Quiz quality overhaul (easy/medium restructure, fix bad questions)

Launch target: next week. Local dev: `npx netlify dev` from /Users/benpg/Documents/BENDA-LEARNING

## What was built this session
- AI Training tab (replaces old Train tab)
- General chat with full bike data + warranty/servicing context
- Basic scenario mode (AI plays customer — needs full two-pass rebuild)
- Voice to text input
- Warranty/servicing data from official owner's manual added to system prompts
- Compare tab restored to nav bar
- All pushed to GitHub main branch
