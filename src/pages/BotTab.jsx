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

export default function BotTab() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

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
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages([...next, { role: 'assistant', content: data.content }]);
    } catch {
      setMessages([...next, { role: 'assistant', content: 'Something went wrong. Please try again.' }]);
    }
    setLoading(false);
  }

  const empty = messages.length === 0;

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000', color: T1, fontFamily: "'Geist',sans-serif", display: 'flex', flexDirection: 'column' }}>

      {/* HEADER */}
      <div style={{ padding: '14px 20px 10px', borderBottom: `1px solid ${BORDER}`, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <img src="/images/BENDAlogo.png" alt="Benda" style={{ height: 40, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)', position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)' }} />
        <A><div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 20, letterSpacing: 0.5, textTransform: 'uppercase', color: T1 }}>AI COACH</div></A>
      </div>

      {/* MESSAGES */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '16px 16px 0' }}>

        {empty && (
          <A>
            <div style={{ textAlign: 'center', paddingTop: 24, paddingBottom: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: `linear-gradient(180deg,#f4d27a 0%,${GOLD} 45%,#b8841f 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1a1206" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M12 11V7"/><circle cx="12" cy="5" r="2"/><line x1="8" y1="15" x2="8" y2="18"/><line x1="16" y1="15" x2="16" y2="18"/>
                </svg>
              </div>
              <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: 17, marginBottom: 5 }}>Benda AI Coach</div>
              <div style={{ fontSize: 13, color: T3, lineHeight: 1.6, maxWidth: 250, margin: '0 auto 20px' }}>Ask me anything about the range — specs, comparisons, who each bike suits.</div>
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
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
            <div style={{
              maxWidth: '85%',
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

      {/* INPUT — sits above tab bar */}
      <div style={{ padding: '10px 16px', paddingBottom: 'calc(70px + env(safe-area-inset-bottom))', borderTop: `1px solid ${BORDER}`, flexShrink: 0, display: 'flex', gap: 10, alignItems: 'flex-end', background: '#000' }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Ask about any bike..."
          rows={1}
          style={{
            flex: 1, background: '#111', border: `1px solid ${BORDER}`, borderRadius: 12,
            padding: '10px 14px', color: T1, fontSize: 15, fontFamily: "'Geist',sans-serif",
            resize: 'none', outline: 'none', lineHeight: 1.5,
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
