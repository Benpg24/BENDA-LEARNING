import { useState, useEffect } from 'react';
import { supabase } from '../supabase.js';
import { BIKES, om, bm } from '../data/bikes.js';
import { C } from '../shared.jsx';

const GOLD = C.gold, GT = C.goldTxt, BORDER = '#2a2a2a', CARD = '#0a0a0a';
const T1 = '#fafafa', T2 = '#b8b8b8', T3 = '#666';

export default function ManagerScreen({ onBack }) {
  const [rows, setRows] = useState(null); // null = loading
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      const [{ data: profiles, error: pe }, { data: progress, error: ge }] = await Promise.all([
        supabase.from('profiles').select('id,full_name,role'),
        supabase.from('progress').select('user_id,data'),
      ]);
      if (!active) return;
      if (pe || ge) {
        setError('Could not load staff. Make sure the manager database rules have been run.');
        setRows([]);
        return;
      }
      const byUser = Object.fromEntries((progress || []).map(r => [r.user_id, r.data]));
      const list = (profiles || []).map(pr => {
        const data = { bikeQuiz: {}, ...(byUser[pr.id] || {}) };
        const overall = om(data);
        const certCount = BIKES.filter(b => bm(data, b.id) === 100).length;
        return { id: pr.id, name: pr.full_name || '—', role: pr.role, overall, certCount };
      }).sort((a, b) => b.overall - a.overall || a.name.localeCompare(b.name));
      setRows(list);
    })();
    return () => { active = false; };
  }, []);

  const ready = (rows || []).filter(r => r.overall === 100).length;
  const total = (rows || []).length;

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#000', color: T1, fontFamily: "'Geist',sans-serif", display: 'flex', flexDirection: 'column' }}>

      {/* HEADER */}
      <div style={{ padding: '12px 20px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', flexShrink: 0, position: 'relative' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: T3, fontSize: 22, cursor: 'pointer', padding: '0 8px 0 0', lineHeight: 1 }}>←</button>
        <div style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', pointerEvents: 'none', fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 16, letterSpacing: 0.5, textTransform: 'uppercase' }}>Team Progress</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '16px 16px 90px' }}>

        {rows === null && (
          <div style={{ textAlign: 'center', color: T3, fontSize: 13, paddingTop: 60 }}>Loading team…</div>
        )}

        {error && (
          <div style={{ background: C.noBg, border: `1px solid ${C.noBdr}`, borderRadius: 10, padding: '14px 16px', fontSize: 13, color: C.noTxt, lineHeight: 1.5 }}>{error}</div>
        )}

        {rows && rows.length > 0 && (
          <>
            {/* SUMMARY */}
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '16px', marginBottom: 14, textAlign: 'center' }}>
              <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: 34, color: GT, lineHeight: 1 }}>{ready}<span style={{ fontSize: 18, color: T3 }}>/{total}</span></div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: T2, textTransform: 'uppercase', marginTop: 4 }}>Staff shop-floor ready</div>
            </div>

            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: T3, textTransform: 'uppercase', marginBottom: 10 }}>All staff · {total}</div>

            {/* STAFF LIST */}
            {rows.map(r => (
              <div key={r.id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '14px', marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 9 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</div>
                    {['manager', 'admin'].includes(r.role) && (
                      <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: 0.5, color: GT, background: C.goldBg, border: `1px solid ${GOLD}40`, borderRadius: 4, padding: '2px 6px', textTransform: 'uppercase', flexShrink: 0 }}>{r.role}</span>
                    )}
                  </div>
                  {r.overall === 100
                    ? <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 0.5, color: C.ok, textTransform: 'uppercase', flexShrink: 0 }}>✓ Ready</span>
                    : <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 700, color: GT, flexShrink: 0 }}>{r.overall}%</span>}
                </div>
                <div style={{ height: 4, background: '#222', borderRadius: 3, overflow: 'hidden', marginBottom: 6 }}>
                  <div style={{ width: `${r.overall}%`, height: '100%', background: r.overall === 100 ? C.ok : `linear-gradient(90deg,${GOLD},${GT})`, borderRadius: 3, transition: 'width .8s ease' }} />
                </div>
                <div style={{ fontSize: 10, color: T3, fontWeight: 600 }}>{r.certCount}/{BIKES.length} bikes certified</div>
              </div>
            ))}
          </>
        )}

        {rows && rows.length === 0 && !error && (
          <div style={{ textAlign: 'center', color: T3, fontSize: 13, paddingTop: 60 }}>No staff have signed up yet.</div>
        )}
      </div>
    </div>
  );
}
