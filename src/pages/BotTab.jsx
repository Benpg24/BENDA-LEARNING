import { useState, useRef, useEffect } from 'react';
import { C, A } from '../shared.jsx';

const GOLD = C.gold, GT = C.goldTxt, BORDER = '#2a2a2a', CARD = '#0a0a0a';
const T1 = '#fafafa', T2 = '#b8b8b8', T3 = '#666';

const PERSONA_CARDS = [
  { name: 'Liam', age: 22, tag: 'LAMS & LICENCE', teaser: "Just got his Ls. Likes the look of the NB250 but worried he'll outgrow it fast.", difficulty: 'easy' },
  { name: 'Steph', age: 34, tag: 'DISCOVERY', teaser: "Quiet browser, full licence. Has a bike in mind but won't say which until you ask.", difficulty: 'medium', comingSoon: true },
  { name: 'Dave', age: 50, tag: 'BRAND OBJECTION', teaser: "20-year rider with a Harley. Openly skeptical about buying 'Chinese'.", difficulty: 'hard', comingSoon: true },
];

const DIFF_COLOR = { easy: '#22c55e', medium: '#f59e0b', hard: '#ef4444' };
const DIFF_LABEL = { easy: 'EASY', medium: 'MEDIUM', hard: 'HARD' };
const HINT_RE = /\n?\[HINT: ([^\]]+)\]/;

const SUGGESTIONS = [
  'Which bike suits a complete beginner?',
  "NB500 vs Chinchilla — what's the difference?",
  'Which bikes are LAMS approved?',
  'Tell me about the LFC 700',
];

const TOOLS = [
  {
    label: 'All Models Quiz',
    tag: 'QUIZ',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GT} strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    key: 'quiz',
  },
  {
    label: 'Scenarios',
    tag: 'SALES',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GT} strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    key: 'scenarios',
  },
  {
    label: 'Glossary',
    tag: 'REF',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GT} strokeWidth="1.8" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
    key: 'glossary',
  },
];

const SESSION_END_RE = /\n?\[SESSION_END:(bought|walked|ongoing)\]/;

function renderInline(text) {
  return text.split(/\*\*(.*?)\*\*/g).map((p, j) =>
    j % 2 === 1 ? <span key={j} style={{ fontWeight: 700, color: T1 }}>{p}</span> : p
  );
}

function renderText(text) {
  return text.split('\n').filter(l => l.trim()).map((line, i) => {
    const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('• ');
    const content = isBullet ? line.trim().slice(2) : line;
    const parts = content.split(/\*\*(.*?)\*\*/g).map((p, j) =>
      j % 2 === 1 ? <span key={j} style={{ fontWeight: 700, color: T1 }}>{p}</span> : p
    );
    return isBullet
      ? <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
          <span style={{ color: GT, flexShrink: 0, marginTop: 1 }}>›</span>
          <span>{parts}</span>
        </div>
      : <div key={i} style={{ marginBottom: 6 }}>{parts}</div>;
  });
}

function renderDebrief(text) {
  const lines = text.split('\n').filter(l => l.trim());
  const elements = [];
  let inScorecard = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('**OUTCOME:**')) {
      inScorecard = false;
      const content = line.replace('**OUTCOME:**', '').trim();
      const upper = content.toUpperCase();
      const outcome = upper.includes('SOLD') ? 'sold' : upper.includes('WALKED') ? 'walked' : 'incomplete';
      const color = outcome === 'sold' ? '#22c55e' : outcome === 'walked' ? '#ef4444' : '#f59e0b';
      const label = outcome === 'sold' ? 'SOLD' : outcome === 'walked' ? 'WALKED' : 'INCOMPLETE';
      elements.push(
        <div key={i} style={{ background: `${color}18`, border: `1px solid ${color}50`, borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.5, color, textTransform: 'uppercase', marginBottom: 6 }}>OUTCOME</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontWeight: 800, fontSize: 18, color }}>{label}</div>
            <div style={{ fontSize: 13, color: T2, lineHeight: 1.5 }}>{content.replace(/^(SOLD|WALKED|INCOMPLETE)\s*[—–-]\s*/i, '').replace(/\*\*/g, '')}</div>
          </div>
        </div>
      );
      continue;
    }

    if (line.startsWith('**SCORECARD:**')) {
      inScorecard = true;
      elements.push(
        <div key={i} style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.5, color: T3, textTransform: 'uppercase', marginBottom: 10, marginTop: 4 }}>SCORECARD</div>
      );
      continue;
    }

    if (inScorecard && line.match(/^- .+: \d\/5/)) {
      const match = line.match(/^- (.+): (\d)\/5/);
      if (match) {
        const [, label, scoreStr] = match;
        const s = parseInt(scoreStr);
        const color = s >= 4 ? '#22c55e' : s >= 3 ? '#f59e0b' : '#ef4444';
        elements.push(
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ fontSize: 13, color: T2, flex: 1, paddingRight: 12 }}>{label}</div>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              {[1,2,3,4,5].map(n => (
                <div key={n} style={{ width: 8, height: 8, borderRadius: '50%', background: n <= s ? color : '#222', border: n <= s ? 'none' : `1px solid #333` }} />
              ))}
              <div style={{ fontSize: 12, fontWeight: 700, color, marginLeft: 6, minWidth: 24 }}>{s}/5</div>
            </div>
          </div>
        );
        continue;
      }
    }

    if (line.startsWith('**KEY MOMENTS:**')) {
      inScorecard = false;
      elements.push(
        <div key={i} style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.5, color: T3, textTransform: 'uppercase', marginTop: 18, marginBottom: 10 }}>KEY MOMENTS</div>
      );
      continue;
    }

    if (line.startsWith('**ONE THING TO FIX:**')) {
      inScorecard = false;
      const content = line.replace('**ONE THING TO FIX:**', '').trim().replace(/\*\*/g, '');
      elements.push(
        <div key={i} style={{ background: '#140e00', border: `1px solid ${GOLD}50`, borderRadius: 10, padding: '12px 14px', marginTop: 18 }}>
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.5, color: GT, textTransform: 'uppercase', marginBottom: 6 }}>ONE THING TO FIX</div>
          <div style={{ fontSize: 14, color: T1, fontWeight: 600, lineHeight: 1.5 }}>{content || renderInline(lines[i + 1] || '')}</div>
        </div>
      );
      continue;
    }

    // numbered key moment lines
    if (line.match(/^\d+\. /)) {
      inScorecard = false;
      elements.push(
        <div key={i} style={{ fontSize: 13, color: T2, lineHeight: 1.65, marginBottom: 10, paddingLeft: 10, borderLeft: `2px solid #333` }}>
          {renderInline(line)}
        </div>
      );
      continue;
    }

    // skip empty heading-only lines
    if (line.match(/^\*\*[^*]+\*\*:?\s*$/)) continue;

    elements.push(
      <div key={i} style={{ fontSize: 13, color: T2, lineHeight: 1.65, marginBottom: 6 }}>
        {renderInline(line)}
      </div>
    );
  }

  return elements;
}

export default function BotTab({ onQuiz, onScenarios, onGlossary }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('chat');
  const [listening, setListening] = useState(false);
  const [currentPersona, setCurrentPersona] = useState(null);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [sessionOutcome, setSessionOutcome] = useState(null);
  const [debriefContent, setDebriefContent] = useState('');
  const [loadingDebrief, setLoadingDebrief] = useState(false);
  const [showDebrief, setShowDebrief] = useState(false);
  const [checkinContent, setCheckinContent] = useState('');
  const [loadingCheckin, setLoadingCheckin] = useState(false);
  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);

  function toggleVoice() {
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert('Voice input requires HTTPS. Use the live app or test on localhost.');
      return;
    }
    const r = new SR();
    r.continuous = false;
    r.interimResults = true;
    r.lang = 'en-AU';
    recognitionRef.current = r;
    setListening(true);
    r.onresult = e => {
      const transcript = Array.from(e.results).map(res => res[0].transcript).join('');
      setInput(transcript);
    };
    r.onend = () => {
      setListening(false);
      setInput(prev => { if (prev.trim()) setTimeout(() => send(prev.trim()), 100); return prev; });
    };
    r.onerror = () => setListening(false);
    r.start();
  }

  const difficulty = currentPersona !== null ? PERSONA_CARDS[currentPersona].difficulty : null;

  async function checkIn() {
    setLoadingCheckin(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, mode: 'checkin', persona: currentPersona }),
      });
      const data = await res.json();
      setCheckinContent(data.content);
    } catch {
      setCheckinContent('Could not load check-in. Please try again.');
    }
    setLoadingCheckin(false);
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function startScenario(idx) {
    const p = idx ?? 0;
    setCurrentPersona(p);
    setMessages([]);
    setSessionEnded(false);
    setSessionOutcome(null);
    setDebriefContent('');
    setShowDebrief(false);
    setCheckinContent('');
    setMode('scenario');
    setLoading(true);
    const diff = PERSONA_CARDS[p].difficulty;
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Start the scenario. Walk in as the customer.' }],
          mode: 'scenario',
          persona: p,
          difficulty: diff,
        }),
      });
      const data = await res.json();
      const raw = data.content;
      const endMatch = raw.match(SESSION_END_RE);
      const hintMatch = raw.match(HINT_RE);
      const clean = raw.replace(SESSION_END_RE, '').replace(HINT_RE, '').trim();
      setMessages([{ role: 'assistant', content: clean, hint: hintMatch?.[1] || null }]);
      if (endMatch) {
        setSessionEnded(true);
        setSessionOutcome(endMatch[1]);
      }
    } catch {
      setMessages([{ role: 'assistant', content: 'Something went wrong. Please try again.' }]);
    }
    setLoading(false);
  }

  function handleTool(key) {
    if (key === 'quiz') onQuiz();
    else if (key === 'scenarios') { setMode('persona-select'); setMessages([]); }
    else if (key === 'glossary') onGlossary();
  }

  function exitScenario() {
    setMode('persona-select');
    setMessages([]);
    setCurrentPersona(null);
    setSessionEnded(false);
    setSessionOutcome(null);
    setDebriefContent('');
    setShowDebrief(false);
  }

  async function getDebrief() {
    setLoadingDebrief(true);
    setShowDebrief(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          mode: 'debrief',
          persona: currentPersona,
        }),
      });
      const data = await res.json();
      setDebriefContent(data.content);
    } catch {
      setDebriefContent('Could not load debrief. Please try again.');
    }
    setLoadingDebrief(false);
  }

  async function send(text) {
    const userText = text || input.trim();
    if (!userText || loading || sessionEnded) return;
    setInput('');

    const next = [...messages, { role: 'user', content: userText }];
    setMessages(next);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, mode, persona: currentPersona, difficulty }),
      });
      const data = await res.json();
      const raw = data.content;
      const endMatch = raw.match(SESSION_END_RE);
      const hintMatch = raw.match(HINT_RE);
      const clean = raw.replace(SESSION_END_RE, '').replace(HINT_RE, '').trim();
      setMessages([...next, { role: 'assistant', content: clean, hint: hintMatch?.[1] || null }]);
      if (endMatch) {
        setSessionEnded(true);
        setSessionOutcome(endMatch[1]);
      }
    } catch {
      setMessages([...next, { role: 'assistant', content: 'Something went wrong. Please try again.' }]);
    }
    setLoading(false);
  }

  const empty = messages.length === 0 && mode === 'chat';

  // Outcome colours
  const outcomeColor = sessionOutcome === 'bought' ? '#22c55e' : sessionOutcome === 'walked' ? '#ef4444' : '#f59e0b';
  const outcomeLabel = sessionOutcome === 'bought' ? 'SOLD' : sessionOutcome === 'walked' ? 'WALKED' : 'TIME UP';

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000', color: T1, fontFamily: "'Geist',sans-serif", display: 'flex', flexDirection: 'column' }}>

      {/* HEADER */}
      <div style={{ padding: '14px 20px 10px', borderBottom: `1px solid ${BORDER}`, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {mode === 'scenario' || mode === 'persona-select'
          ? <button onClick={() => { setMode('chat'); setMessages([]); setCurrentPersona(null); setSessionEnded(false); setSessionOutcome(null); setDebriefContent(''); setShowDebrief(false); }} className="tp" style={{ position: 'absolute', left: 16, background: 'none', border: 'none', color: GT, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Geist',sans-serif" }}>✕ EXIT</button>
          : <img src="/images/BENDAlogo.png" alt="Benda" style={{ height: 40, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)', position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)' }} />
        }
        <A><div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 20, letterSpacing: 0.5, textTransform: 'uppercase', color: T1 }}>
          {mode === 'scenario' ? (showDebrief ? 'DEBRIEF' : 'CUSTOMER SCENARIO') : mode === 'persona-select' ? 'SCENARIOS' : 'TRAINING'}
        </div></A>
        {mode === 'scenario' && sessionEnded && !showDebrief && (
          <div style={{ position: 'absolute', right: 16, fontSize: 10, fontWeight: 800, letterSpacing: 1, color: outcomeColor, textTransform: 'uppercase' }}>{outcomeLabel}</div>
        )}
        {mode === 'scenario' && !sessionEnded && difficulty === 'medium' && messages.length >= 2 && (
          <button onClick={checkIn} disabled={loadingCheckin} className="tp" style={{ position: 'absolute', right: 16, background: 'none', border: `1px solid #333`, borderRadius: 8, color: loadingCheckin ? T3 : T2, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: "'Geist',sans-serif", padding: '4px 10px' }}>
            {loadingCheckin ? '...' : 'Check In'}
          </button>
        )}
      </div>

      {/* TRAINING TOOLS — only in chat mode */}
      {mode === 'chat' && (
        <div style={{ display: 'flex', gap: 8, padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          {TOOLS.map(t => (
            <button key={t.key} onClick={() => handleTool(t.key)} className="tp" style={{
              flex: 1, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12,
              padding: '10px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
              cursor: 'pointer',
            }}>
              {t.icon}
              <div style={{ fontSize: 10, fontWeight: 700, color: T2, textAlign: 'center', lineHeight: 1.2 }}>{t.label}</div>
            </button>
          ))}
        </div>
      )}

      {/* PERSONA PICKER */}
      {mode === 'persona-select' && (
        <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '16px 16px 100px' }}>
          <A>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: T3, textTransform: 'uppercase', marginBottom: 14 }}>CHOOSE YOUR CUSTOMER</div>
            {PERSONA_CARDS.map((c, i) => {
              const locked = c.comingSoon;
              return (
              <div
                key={c.name}
                onClick={locked ? undefined : () => startScenario(i)}
                className={locked ? undefined : "tp"}
                style={{ display: 'flex', alignItems: 'center', gap: 14, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '16px 16px', marginBottom: 10, cursor: locked ? 'default' : 'pointer', opacity: locked ? 0.5 : 1 }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#111', border: `1px solid #2a2a2a`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: 18, color: GT }}>
                  {c.name[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 15, color: T1 }}>{c.name}, {c.age}</div>
                    <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: 1, color: DIFF_COLOR[c.difficulty], background: `${DIFF_COLOR[c.difficulty]}15`, border: `1px solid ${DIFF_COLOR[c.difficulty]}40`, borderRadius: 4, padding: '2px 7px', flexShrink: 0 }}>{DIFF_LABEL[c.difficulty]}</div>
                  </div>
                  <div style={{ fontSize: 12, color: T3, lineHeight: 1.5 }}>{c.teaser}</div>
                </div>
                {locked
                  ? <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: 1, color: T3, border: `1px solid ${BORDER}`, borderRadius: 4, padding: '3px 7px', flexShrink: 0, textTransform: 'uppercase' }}>Coming Soon</div>
                  : <div style={{ color: GT, fontSize: 22, flexShrink: 0 }}>›</div>}
              </div>
              );
            })}
          </A>
        </div>
      )}

      {/* DEBRIEF VIEW */}
      {showDebrief && (
        <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '16px 16px 100px' }}>
          {loadingDebrief ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 60, gap: 14 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: GT, animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                ))}
              </div>
              <div style={{ fontSize: 13, color: T3 }}>Analysing your session...</div>
            </div>
          ) : (
            <A>
              <div style={{ paddingBottom: 20 }}>
                {renderDebrief(debriefContent)}
              </div>
              <button
                onClick={exitScenario}
                style={{ width: '100%', padding: '14px', background: `linear-gradient(180deg,#f4d27a 0%,${GOLD} 45%,#b8841f 100%)`, border: 'none', borderRadius: 12, color: '#1a1206', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: "'Geist',sans-serif", letterSpacing: 0.3, marginTop: 8 }}
              >
                Choose Another Customer
              </button>
            </A>
          )}
          <div ref={bottomRef} style={{ height: 8 }} />
        </div>
      )}

      {/* CHAT / SCENARIO MESSAGES */}
      {!showDebrief && mode !== 'persona-select' && (
        <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '16px 16px 0' }}>

          {empty && (
            <A>
              <div style={{ textAlign: 'center', paddingTop: 20, paddingBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `linear-gradient(180deg,#f4d27a 0%,${GOLD} 45%,#b8841f 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1206" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M12 11V7"/><circle cx="12" cy="5" r="2"/><line x1="8" y1="15" x2="8" y2="18"/><line x1="16" y1="15" x2="16" y2="18"/>
                  </svg>
                </div>
                <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: 16, marginBottom: 4 }}>AI Coach</div>
                <div style={{ fontSize: 13, color: T3, lineHeight: 1.6, maxWidth: 240, margin: '0 auto 18px' }}>Ask me anything — bikes, specs, sales tips, or anything else.</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {SUGGESTIONS.map(s => (
                    <button key={s} onClick={() => send(s)} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '11px 14px', color: T2, fontSize: 13, textAlign: 'left', cursor: 'pointer', fontFamily: "'Geist',sans-serif" }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </A>
          )}

          {messages.map((m, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: m.hint ? 4 : 10, alignItems: 'flex-end', gap: 8 }}>
                {m.role === 'assistant' && mode === 'scenario' && (
                  <img src="/images/customer scenarios bg remove.png" alt="Customer" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', flexShrink: 0, border: `1px solid ${BORDER}` }} />
                )}
                <div style={{
                  maxWidth: '80%',
                  padding: '10px 14px',
                  borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: m.role === 'user' ? `linear-gradient(180deg,#f4d27a 0%,${GOLD} 45%,#b8841f 100%)` : CARD,
                  border: m.role === 'user' ? 'none' : `1px solid ${BORDER}`,
                  color: m.role === 'user' ? '#1a1206' : T2,
                  fontSize: 14,
                  lineHeight: 1.65,
                  fontWeight: m.role === 'user' ? 600 : 400,
                }}>
                  {m.role === 'user' ? m.content : renderText(m.content)}
                </div>
              </div>
              {m.hint && difficulty === 'easy' && (
                <div style={{ paddingLeft: 48, marginBottom: 10 }}>
                  <div style={{ fontSize: 11, color: '#22c55e99', fontStyle: 'italic', lineHeight: 1.4 }}>💡 {m.hint}</div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 10, alignItems: 'flex-end', gap: 8 }}>
              {mode === 'scenario' && (
                <img src="/images/customer scenarios bg remove.png" alt="Customer" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', flexShrink: 0, border: `1px solid ${BORDER}` }} />
              )}
              <div style={{ padding: '12px 16px', borderRadius: '14px 14px 14px 4px', background: CARD, border: `1px solid ${BORDER}`, display: 'flex', gap: 5, alignItems: 'center' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: T3, animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} style={{ height: 8 }} />
        </div>
      )}

      {/* CHECK-IN RESULT — medium mode */}
      {checkinContent && !sessionEnded && !showDebrief && (
        <div style={{ padding: '0 16px 10px', flexShrink: 0, background: '#000' }}>
          <div style={{ background: '#0a0f0a', border: `1px solid #22c55e40`, borderLeft: `3px solid #22c55e`, borderRadius: 10, padding: '12px 14px', position: 'relative' }}>
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.5, color: '#22c55e', textTransform: 'uppercase', marginBottom: 6 }}>COACH CHECK-IN</div>
            <div style={{ fontSize: 13, color: T2, lineHeight: 1.6 }}>{checkinContent}</div>
            <button onClick={() => setCheckinContent('')} style={{ position: 'absolute', top: 10, right: 12, background: 'none', border: 'none', color: T3, fontSize: 14, cursor: 'pointer', lineHeight: 1 }}>✕</button>
          </div>
        </div>
      )}

      {/* SESSION ENDED — debrief prompt */}
      {!showDebrief && sessionEnded && (
        <div style={{ padding: '12px 16px', borderTop: `1px solid ${BORDER}`, flexShrink: 0, paddingBottom: 'calc(70px + env(safe-area-inset-bottom))', background: '#000' }}>
          <div style={{ background: `${outcomeColor}12`, border: `1px solid ${outcomeColor}40`, borderRadius: 10, padding: '12px 14px', marginBottom: 10, textAlign: 'center' }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, color: outcomeColor, textTransform: 'uppercase', marginBottom: 4 }}>
              {sessionOutcome === 'bought' ? 'You closed the sale' : sessionOutcome === 'walked' ? 'Customer walked' : 'Session time up'}
            </div>
            <div style={{ fontSize: 12, color: T3 }}>How did you do? Get your coaching debrief.</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={getDebrief}
              style={{ flex: 1, padding: '13px', background: `linear-gradient(180deg,#f4d27a 0%,${GOLD} 45%,#b8841f 100%)`, border: 'none', borderRadius: 12, color: '#1a1206', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: "'Geist',sans-serif", letterSpacing: 0.3 }}
            >
              Get Debrief
            </button>
            <button
              onClick={() => startScenario(currentPersona)}
              style={{ padding: '13px 16px', background: '#111', border: `1px solid ${BORDER}`, borderRadius: 12, color: T2, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: "'Geist',sans-serif" }}
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* INPUT — chat mode or active scenario */}
      {!showDebrief && !sessionEnded && mode !== 'persona-select' && (
        <div style={{ padding: '10px 16px', paddingBottom: 'calc(70px + env(safe-area-inset-bottom))', borderTop: `1px solid ${BORDER}`, flexShrink: 0, display: 'flex', gap: 8, alignItems: 'flex-end', background: '#000' }}>
          <button onClick={toggleVoice} style={{
            width: 42, height: 42, borderRadius: 12, flexShrink: 0, border: 'none', cursor: 'pointer',
            background: listening ? '#3a0a0a' : '#111',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            outline: listening ? `1px solid #ef4444` : 'none',
            transition: 'all 0.15s',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={listening ? '#ef4444' : T3} strokeWidth="2" strokeLinecap="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          </button>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={listening ? 'Listening...' : mode === 'scenario' ? 'Reply to the customer...' : 'Ask anything...'}
            rows={1}
            style={{
              flex: 1, background: '#111', border: `1px solid ${listening ? '#ef4444' : BORDER}`, borderRadius: 12,
              padding: '10px 14px', color: T1, fontSize: 15, fontFamily: "'Geist',sans-serif",
              resize: 'none', outline: 'none', lineHeight: 1.5, transition: 'border 0.15s',
            }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            style={{
              width: 42, height: 42, borderRadius: 12, flexShrink: 0,
              background: input.trim() && !loading ? `linear-gradient(180deg,#f4d27a 0%,${GOLD} 45%,#b8841f 100%)` : '#1a1a1a',
              border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={input.trim() && !loading ? '#1a1206' : T3} strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
            </svg>
          </button>
        </div>
      )}

      <style>{`@keyframes pulse{0%,100%{opacity:0.3;transform:scale(0.8)}50%{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );
}
