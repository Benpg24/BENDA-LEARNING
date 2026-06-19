import { useState } from 'react';
import { supabase } from './supabase.js';
import { C } from './shared.jsx';

// Staff sign-up is restricted to the company email domain.
const ALLOWED_DOMAIN = 'bendamoto.com.au';

const inp = {
  width: '100%', padding: '14px 16px', background: '#111', border: `1px solid ${C.border}`,
  borderRadius: 10, color: '#fafafa', fontSize: 16, fontFamily: "'Geist',sans-serif",
  outline: 'none', boxSizing: 'border-box',
};

export default function Login() {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  const isSignup = mode === 'signup';

  function switchMode() {
    setMode(isSignup ? 'signin' : 'signup');
    setError(''); setNotice('');
  }

  async function submit(e) {
    e.preventDefault();
    if (loading || !email.trim() || !password) return;
    if (isSignup && password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (isSignup && !email.trim().toLowerCase().endsWith('@' + ALLOWED_DOMAIN)) {
      setError(`Please use your @${ALLOWED_DOMAIN} work email.`);
      return;
    }
    setLoading(true); setError(''); setNotice('');

    if (isSignup) {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: name.trim() || email.trim().split('@')[0] } },
      });
      if (error) {
        setError(/already registered/i.test(error.message) ? 'That email already has an account — try signing in.' : error.message);
        setLoading(false);
        return;
      }
      if (!data.session) {
        // Email confirmation is switched on — ask them to confirm first.
        setNotice('Account created! Check your email to confirm, then sign in.');
        setMode('signin');
        setLoading(false);
        return;
      }
      // Session returned → the auth listener in App logs them straight in.
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) {
        setError('Wrong email or password. Please try again.');
        setLoading(false);
      }
    }
  }

  const disabled = loading || !email.trim() || !password || (isSignup && !name.trim());

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fafafa', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: "'Geist',sans-serif" }}>
      <img src="/images/BENDAlogo.png" alt="Benda" style={{ height: 54, objectFit: 'contain', filter: 'brightness(0) invert(1)', marginBottom: 10 }} />
      <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: C.t3, marginBottom: 36 }}>Staff Training</div>

      <form onSubmit={submit} style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {isSignup && (
          <input type="text" autoCapitalize="words" autoComplete="name" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} style={inp} />
        )}
        <input type="email" inputMode="email" autoCapitalize="none" autoCorrect="off" autoComplete="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={inp} />
        <input type="password" autoComplete={isSignup ? 'new-password' : 'current-password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={inp} />

        {error && <div style={{ fontSize: 13, color: C.noTxt, textAlign: 'center', lineHeight: 1.4 }}>{error}</div>}
        {notice && <div style={{ fontSize: 13, color: C.okTxt, textAlign: 'center', lineHeight: 1.4 }}>{notice}</div>}

        <button type="submit" disabled={disabled} style={{
          width: '100%', padding: '14px', marginTop: 4, border: 'none', borderRadius: 10,
          background: 'linear-gradient(180deg,#f4d27a 0%,#D4A24A 45%,#b8841f 100%)', color: '#1a1206',
          fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: 15, letterSpacing: 0.3,
          cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.5 : 1, transition: 'opacity .15s',
        }}>
          {loading ? 'Please wait…' : isSignup ? 'Create Account' : 'Sign In'}
        </button>
      </form>

      <button onClick={switchMode} style={{ background: 'none', border: 'none', color: C.t3, fontSize: 13, marginTop: 22, cursor: 'pointer', fontFamily: "'Geist',sans-serif" }}>
        {isSignup
          ? <>Already have an account? <span style={{ color: C.goldTxt, fontWeight: 600 }}>Sign in</span></>
          : <>New here? <span style={{ color: C.goldTxt, fontWeight: 600 }}>Create an account</span></>}
      </button>
    </div>
  );
}
