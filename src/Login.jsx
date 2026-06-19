import { useState } from 'react';
import { supabase } from './supabase.js';
import { C } from './shared.jsx';

const inp = {
  width: '100%', padding: '14px 16px', background: '#111', border: `1px solid ${C.border}`,
  borderRadius: 10, color: '#fafafa', fontSize: 16, fontFamily: "'Geist',sans-serif",
  outline: 'none', boxSizing: 'border-box',
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!email.trim() || !password || loading) return;
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setError('Wrong email or password. Please try again.');
      setLoading(false);
    }
    // On success, the auth listener in App swaps to the app automatically.
  }

  const disabled = loading || !email.trim() || !password;

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fafafa', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: "'Geist',sans-serif" }}>
      <img src="/images/BENDAlogo.png" alt="Benda" style={{ height: 54, objectFit: 'contain', filter: 'brightness(0) invert(1)', marginBottom: 10 }} />
      <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: C.t3, marginBottom: 36 }}>Staff Training</div>

      <form onSubmit={submit} style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input type="email" inputMode="email" autoCapitalize="none" autoCorrect="off" autoComplete="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={inp} />
        <input type="password" autoComplete="current-password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={inp} />
        {error && <div style={{ fontSize: 13, color: C.noTxt, textAlign: 'center', lineHeight: 1.4 }}>{error}</div>}
        <button type="submit" disabled={disabled} style={{
          width: '100%', padding: '14px', marginTop: 4, border: 'none', borderRadius: 10,
          background: 'linear-gradient(180deg,#f4d27a 0%,#D4A24A 45%,#b8841f 100%)', color: '#1a1206',
          fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: 15, letterSpacing: 0.3,
          cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.5 : 1, transition: 'opacity .15s',
        }}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <div style={{ fontSize: 12, color: C.t4, marginTop: 26, textAlign: 'center', lineHeight: 1.6, maxWidth: 260 }}>
        No account yet? Ask your manager to set you up.
      </div>
    </div>
  );
}
