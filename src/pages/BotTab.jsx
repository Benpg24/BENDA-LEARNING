import { useState, useRef, useEffect } from 'react';
import { C, A } from '../shared.jsx';

const GOLD = C.gold, GT = C.goldTxt, BORDER = '#2a2a2a', CARD = '#0a0a0a';
const T1 = '#fafafa', T2 = '#b8b8b8', T3 = '#666';

const SUGGESTIONS = [
  'Which bike suits a complete beginner?',
  'NB500 vs Chinchilla — what\'s the difference?',
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

export default function BotTab({ onQuiz, onScenarios, onGlossary }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('chat');
  const [listening, setListening] = useState(false);
  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);

  const hasVoice = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  function toggleVoice() {
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function startScenario() {
    setMessages([]);
    setMode('scenario');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: 'Start the scenario. Introduce yourself as the customer.' }], mode: 'scenario' }),
      });
      const data = await res.json();
      setMessages([{ role: 'assistant', content: data.content }]);
    } catch {
      setMessages([{ role: 'assistant', content: 'Something went wrong. Please try again.' }]);
    }
    setLoading(false);
  }

  function handleTool(key) {
    if (key === 'quiz') onQuiz();
    else if (key === 'scenarios') startScenario();
    else if (key === 'glossary') onGlossary();
  }

  function exitScenario() {
    setMode('chat');
    setMessages([]);
  }

  async function send(text) {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput('');

    const next = [...messages, { role: 'user', content: userText }];
    setMessages(next);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, mode }),
      });
      const data = await res.json();
      setMessages([...next, { role: 'assistant', content: data.content }]);
    } catch {
      setMessages([...next, { role: 'assistant', content: 'Something went wrong. Please try again.' }]);
    }
    setLoading(false);
  }

  const empty = messages.length === 0 && mode === 'chat';

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000', color: T1, fontFamily: "'Geist',sans-serif", display: 'flex', flexDirection: 'column' }}>

      {/* HEADER */}
      <div style={{ padding: '14px 20px 10px', borderBottom: `1px solid ${BORDER}`, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {mode === 'scenario'
          ? <button onClick={exitScenario} className="tp" style={{ position: 'absolute', left: 16, background: 'none', border: 'none', color: GT, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Geist',sans-serif" }}>✕ EXIT</button>
          : <img src="/images/BENDAlogo.png" alt="Benda" style={{ height: 40, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)', position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)' }} />
        }
        <A><div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 20, letterSpacing: 0.5, textTransform: 'uppercase', color: T1 }}>
          {mode === 'scenario' ? 'CUSTOMER SCENARIO' : 'TRAINING'}
        </div></A>
      </div>

      {/* TRAINING TOOLS */}
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

      {/* MESSAGES */}
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
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 10, alignItems: 'flex-end', gap: 8 }}>
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
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 10 }}>
            <div style={{ padding: '12px 16px', borderRadius: '14px 14px 14px 4px', background: CARD, border: `1px solid ${BORDER}`, display: 'flex', gap: 5, alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: T3, animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} style={{ height: 8 }} />
      </div>

      {/* INPUT */}
      <div style={{ padding: '10px 16px', paddingBottom: 'calc(70px + env(safe-area-inset-bottom))', borderTop: `1px solid ${BORDER}`, flexShrink: 0, display: 'flex', gap: 8, alignItems: 'flex-end', background: '#000' }}>
        {hasVoice && (
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
        )}
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder={listening ? 'Listening...' : 'Ask anything...'}
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

      <style>{`@keyframes pulse{0%,100%{opacity:0.3;transform:scale(0.8)}50%{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );
}
