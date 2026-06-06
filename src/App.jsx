import { useState, useEffect, useCallback, useRef } from 'react';
import { BIKES, SCENARIOS, COMP, COMPQ, GLOSSARY, bm, om, bs, nb } from './data/bikes.js';
import { C, bd, crd, sec, btnA, btnG, BIKE_COLOURS, A, Ring, HoverCard } from './shared.jsx';
import RangeTab from './pages/RangeTab.jsx';
import TrainTab from './pages/TrainTab.jsx';
import ProgressTab from './pages/ProgressTab.jsx';
import CompareTab from './pages/CompareTab.jsx';
import HomeTab from './pages/HomeTab.jsx';
import BotTab from './pages/BotTab.jsx';

// ── CSS ─────────────────────────────────────────────────────────────────────
const CSS=`@keyframes fu{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}} @keyframes fi{from{opacity:0}to{opacity:1}} @keyframes si{from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:translateX(0)}} @keyframes pg{from{width:0}} @keyframes cp{0%{transform:scale(1)}40%{transform:scale(1.012)}100%{transform:scale(1)}} @keyframes ws{0%,100%{transform:translateX(0)}25%,75%{transform:translateX(-3px)}50%{transform:translateX(3px)}} @keyframes tr{from{opacity:0;transform:scale(0.85)}to{opacity:1;transform:scale(1)}} @keyframes fc{from{transform:rotateX(80deg);opacity:0}to{transform:rotateX(0);opacity:1}} .au{animation:fu .38s ease both}.ai{animation:fi .3s ease both}.as{animation:si .35s ease both} .ac{animation:cp .35s ease}.aw{animation:ws .35s ease}.at{animation:tr .5s cubic-bezier(.34,1.56,.64,1) both} .af{animation:fc .25s ease both} .tp{transition:all .15s ease;cursor:pointer}.tp:active{transform:scale(.97);opacity:.85} select{-webkit-appearance:none;appearance:none} *{-webkit-tap-highlight-color:transparent;box-sizing:border-box} body{margin:0;padding:0}::-webkit-scrollbar{width:0;height:0}`;



// ── BIKE CAROUSEL ─────────────────────────────────────────────────────────────
function BikeCarousel({images,name}){
  const [idx,setIdx]=useState(0);
  const touchX=useRef(null);
  function onTouchStart(e){touchX.current=e.targetTouches[0].clientX;}
  function onTouchEnd(e){
    if(touchX.current===null)return;
    const diff=touchX.current-e.changedTouches[0].clientX;
    if(Math.abs(diff)>40){if(diff>0)setIdx(i=>Math.min(i+1,images.length-1));else setIdx(i=>Math.max(i-1,0));}
    touchX.current=null;
  }
  if(!images||!images.length)return <div style={{width:"100%",paddingBottom:"100%",background:C.s2,borderRadius:6,border:`1px solid ${C.border}`,position:"relative",marginBottom:8}}><div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:12,color:C.t4,letterSpacing:1}}>NO PHOTO YET</span></div></div>;
  return <div style={{marginBottom:8}}>
    <div style={{width:"100%",position:"relative",paddingBottom:"62%",background:C.s2,borderRadius:6,border:`1px solid ${C.border}`,overflow:"hidden"}} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div style={{position:"absolute",inset:0}}>
        <img src={images[idx]} alt={`${name} ${idx+1}`} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center"}}/>
      </div>
      {images.length>1&&idx>0&&<button onClick={()=>setIdx(i=>i-1)} style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,0.65)",border:"none",color:"#fff",fontSize:22,width:36,height:36,borderRadius:"50%",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10,lineHeight:1}}>‹</button>}
      {images.length>1&&idx<images.length-1&&<button onClick={()=>setIdx(i=>i+1)} style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,0.65)",border:"none",color:"#fff",fontSize:22,width:36,height:36,borderRadius:"50%",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10,lineHeight:1}}>›</button>}
      {images.length>1&&<div style={{position:"absolute",bottom:10,left:0,right:0,display:"flex",justifyContent:"center",gap:6,zIndex:10}}>
        {images.map((_,i)=><div key={i} onClick={()=>setIdx(i)} style={{width:i===idx?20:7,height:7,borderRadius:i===idx?4:50,background:i===idx?"#fff":"rgba(255,255,255,0.35)",transition:"all .25s ease",cursor:"pointer"}}/>)}
      </div>}
      <div style={{position:"absolute",top:10,right:10,background:"rgba(0,0,0,0.6)",borderRadius:3,padding:"3px 7px",fontSize:11,color:"rgba(255,255,255,0.75)",letterSpacing:1,zIndex:10}}>{idx+1}/{images.length}</div>
    </div>
  </div>;
}


// ── GLOSSARY ────────────────────────────────────────────────────────────────


// ── STORAGE ─────────────────────────────────────────────────────────────────
const SK = "benda-v4";
const defProg = () => ({ bikeQuiz: {}, generalQuiz: { best: 0, total: 0, attempts: 0 }, scenarios: { completed: 0, correct: 0, attempts: 0 } });
function useProg() {
const [p, sP] = useState(defProg);
const ld = useRef(false);
useEffect(() => { (async () => { try { const r = await window.storage.get(SK); if (r?.value) sP(JSON.parse(r.value)); } catch {} ld.current = true; })(); }, []);
const up = useCallback((fn) => { sP(prev => { const n = fn(JSON.parse(JSON.stringify(prev))); if (ld.current)(async()=>{try{await window.storage.set(SK,JSON.stringify(n))}catch{}})(); return n; }); }, []);
const rst = useCallback(async () => { const d = defProg(); sP(d); try { await window.storage.set(SK, JSON.stringify(d)); } catch {} }, []);
return { p, up, rst };
}


function getTier(pct) {
if (pct === 100) return { label: "PERFECT", color: "#22c55e", msg: "Flawless. That's how it's done.", icon: "◆" };
if (pct >= 75) return { label: "STRONG", color: C.goldTxt, msg: "Solid knowledge. Close a couple of gaps and you're there.", icon: "▲" };
if (pct >= 50) return { label: "DEVELOPING", color: "#f59e0b", msg: "Getting there. Review what you missed and go again.", icon: "●" };
return { label: "NEEDS WORK", color: "#ef4444", msg: "Spend time on the Learn tab before your next attempt.", icon: "○" };
}

// ── BIKES ────────────────────────────────────────────────────────────────────

// ── NAV ICONS ───────────────────────────────────────────────────────────────
const Icons={
  home:()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11L12 3l9 8"/><path d="M5 10v10h14V10"/></svg>,
  range:()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
  train:()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  compare:()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  progress:()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>,
  glossary:()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  bot:()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M12 11V7"/><circle cx="12" cy="5" r="2"/><line x1="8" y1="15" x2="8" y2="18"/><line x1="16" y1="15" x2="16" y2="18"/></svg>,
};

// ── BOTTOM TAB BAR ──────────────────────────────────────────────────────────
function TabBar({active,onChange}){
  const tabs=[
    {id:"home",label:"Home",icon:Icons.home},
    {id:"range",label:"Range",icon:Icons.range},
    {id:"train",label:"Train",icon:Icons.train},
    {id:"bot",label:"AI Coach",icon:Icons.bot},
    {id:"progress",label:"Progress",icon:Icons.progress},
  ];
  return <div style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(0,0,0,0.95)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderTop:`1px solid #1a1a1a`,display:"flex",zIndex:200,paddingBottom:"env(safe-area-inset-bottom)"}}>
    {tabs.map(t=>{
      const isActive=active===t.id;
      return <button key={t.id} className="tp" onClick={()=>onChange(t.id)} style={{flex:1,padding:"10px 0 8px",background:"none",border:"none",color:isActive?C.goldTxt:C.t3,display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer",transition:"color .2s",position:"relative"}}>
        {isActive&&<div style={{position:"absolute",top:0,width:20,height:2,background:C.gold,borderRadius:2}}/>}
        <t.icon/><span style={{fontSize:9,letterSpacing:1,fontWeight:isActive?700:400,fontFamily:"'Inter',sans-serif",textTransform:"uppercase"}}>{t.label}</span>
      </button>;
    })}
  </div>;
}

// ── HEADER ───────────────────────────────────────────────────────────────────
function Hdr({onBack,right}){
  return <div style={{background:"#000",borderBottom:"1px solid #2a2a2a",padding:"12px 20px",display:"flex",alignItems:"center",position:"sticky",top:0,zIndex:100,flexShrink:0}}>
    {onBack&&<button className="tp" style={{background:"none",border:"none",color:"#666",fontSize:22,cursor:"pointer",padding:"0 8px 0 0",lineHeight:1,flexShrink:0}} onClick={onBack}>←</button>}
    <div style={{position:"absolute",left:0,right:0,display:"flex",justifyContent:"center",pointerEvents:"none"}}>
      <img src="/images/BENDAlogo.png" alt="Benda" style={{height:40,objectFit:"contain",filter:"brightness(0) invert(1)"}}/>
    </div>
    {right&&<div style={{marginLeft:"auto"}}>{right}</div>}
  </div>
}



// ── QUIZ ENGINE ─────────────────────────────────────────────────────────────
function QE({questions:qs,badge,onFinish}){
  const [idx,sI]=useState(0);
  const [sc,sS]=useState(0);
  const [ch,sC]=useState(null);
  const [sh]=useState(()=>qs.map(q=>[...q.opts].sort(()=>Math.random()-.5)));
  const [an,sA]=useState("");
  function pick(o){if(ch!==null)return;const ok=o===qs[idx].a;if(ok)sS(s=>s+1);sC(o);sA(ok?"ac":"aw");setTimeout(()=>sA(""),400)}
  function next(){if(idx+1>=qs.length){onFinish(sc);return}sI(i=>i+1);sC(null)}

  const q=qs[idx];const os=sh[idx];const tot=qs.length;const pct=((idx+(ch!==null?1:0))/tot)*100;
  const correct=ch!==null&&ch===q.a;
  return <div style={{...bd,display:'flex',flexDirection:'column',minHeight:'calc(100dvh - 115px)'}}>
    <div style={{flexShrink:0}}>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.t2,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>
        <span>Question {idx+1} of {tot}</span>
        <span style={{color:C.accent}}>{sc} correct</span>
      </div>
      <div style={{height:3,background:C.border,borderRadius:3,marginBottom:20,overflow:"hidden"}}>
        <div style={{height:"100%",background:C.accent,borderRadius:3,width:pct+"%",transition:"width .5s ease"}}/>
      </div>
      {badge&&(()=>{const bt=badge(q);const bc=bt.includes("easy")?"#22c55e":bt.includes("medium")?"#f59e0b":bt.includes("hard")?"#ef4444":C.t2;return <div style={{display:"inline-block",fontSize:10,letterSpacing:0.5,textTransform:"uppercase",color:bc,border:`1px solid ${bc}`,padding:"4px 10px",borderRadius:3,marginBottom:12}}>{bt}</div>})()}
      <A t="as" key={idx}><div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:20,lineHeight:1.3,marginBottom:16,letterSpacing:.5}}>{q.q}</div></A>
    </div>
    <div style={{flex:1,display:'flex',flexDirection:'column',gap:8}} className={an}>
      {ch===null
        ? os.map(o=><HoverBtn key={o} onClick={()=>pick(o)} disabled={false} style={{width:"100%",padding:"14px 16px",background:C.s1,border:`1px solid ${C.border}`,borderRadius:6,color:C.text,fontSize:15,textAlign:"left",cursor:"pointer",lineHeight:1.4,transition:"all .15s"}}>{o}</HoverBtn>)
        : <div style={{display:'flex',flexDirection:'column',flex:1}}>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              {os.map(o=>{
                let bg=C.s1,br=C.border,cl=C.t4;
                if(o===q.a){bg=C.okBg;br=C.okBdr;cl=C.okTxt}
                else if(o===ch){bg=C.noBg;br=C.noBdr;cl=C.noTxt}
                return <div key={o} style={{padding:"10px 14px",background:bg,border:`1px solid ${br}`,borderRadius:6,color:cl,fontSize:14,lineHeight:1.4}}>{o}</div>
              })}
            </div>
            <div style={{padding:"10px 14px",borderLeft:`3px solid ${correct?C.ok:C.no}`,fontSize:13,lineHeight:1.55,color:C.t2,marginTop:10}}>{correct?"Correct. ":`The answer was ${q.a}. `}{q.fact}
              {!correct&&q.tab&&<div style={{marginTop:5,fontSize:12}}><span style={{color:C.accent}}>→ </span>Find this in the <span style={{color:C.accent,fontWeight:600}}>{q.tab} tab</span>{q.section?` under "${q.section}"`:""}</div>}
            </div>
            <button className="tp" style={{width:"100%",padding:14,background:C.s2,border:`1px solid ${C.border}`,borderRadius:6,fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:14,letterSpacing:0.5,textTransform:"uppercase",color:C.text,cursor:"pointer",flexShrink:0,marginTop:10}} onClick={next}>{idx+1<tot?"Next Question":"See Results"}</button>
          </div>
      }
    </div>
  </div>;
}

// ── RESULTS ─────────────────────────────────────────────────────────────────
function Res({score,total,actions}){
  const pct=Math.round(score/total*100);const tier=getTier(pct);
  return <div style={{padding:"32px 20px 24px"}}>
    <A><div style={{textAlign:"center",marginBottom:28}}>
      <div style={{fontFamily:"'Inter',sans-serif",fontWeight:900,fontSize:80,lineHeight:1,letterSpacing:-2,color:tier.color}}>{score}<span style={{fontSize:40,color:"#2a2a2a"}}>/{total}</span></div>
      <div style={{fontSize:11,letterSpacing:3,textTransform:"uppercase",color:C.t3,marginTop:4}}>{pct}% correct</div>
    </div></A>
    <A d={150}><div style={{background:"#111",border:`1px solid #2a2a2a`,borderLeft:`3px solid ${tier.color}`,borderRadius:8,padding:"14px 16px",marginBottom:20,display:"flex",alignItems:"center",gap:12}}>
      <span style={{fontSize:22,color:tier.color}}>{tier.icon}</span>
      <div>
        <div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:13,letterSpacing:1.5,textTransform:"uppercase",color:tier.color}}>{tier.label}</div>
        <div style={{fontSize:13,color:C.t2,marginTop:3,lineHeight:1.5}}>{tier.msg}</div>
      </div>
    </div></A>
    <A d={300}><div style={{display:"flex",flexDirection:"column",gap:10}}>{actions}</div></A>
  </div>
}

// ── GLOSSARY ITEM ────────────────────────────────────────────────────────────
// ── HOVER BUTTON ────────────────────────────────────────────────────────────
function HoverBtn({onClick,disabled,style,children}){
  const [hovered,sH]=useState(false);
  return <button
    onMouseEnter={()=>!disabled&&sH(true)}
    onMouseLeave={()=>sH(false)}
    onClick={onClick}
    disabled={disabled}
    style={{...style,border:`1px solid ${hovered&&!disabled?"rgba(255,255,255,0.5)":style.border?.includes("1px solid")?style.border.split("solid ")[1].replace(")","").trim():"transparent"}`,boxShadow:hovered&&!disabled?`0 0 0 1px rgba(255,255,255,0.1)`:"none",transition:"border .15s ease, box-shadow .15s ease"}}
  >{children}</button>
}

function GlossaryItem({term,def,isLast}){
  const [open,sO]=useState(false);
  return <div style={{background:"#141414",borderBottom:isLast?"none":"1px solid #2a2a2a",overflow:"hidden"}}>
    <div className="tp" onClick={()=>sO(!open)} style={{padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"flex-start",cursor:"pointer"}}>
      <div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:14,color:"#fafafa"}}>{term}</div>
      <div style={{color:"#666",fontSize:18,transition:"transform .2s",transform:open?"rotate(45deg)":"rotate(0deg)",flexShrink:0,marginLeft:12,marginTop:"-1px"}}>+</div>
    </div>
    {open&&<div style={{padding:"0 16px 14px",fontSize:13,color:"#b8b8b8",lineHeight:1.7,borderTop:"1px solid #2a2a2a"}}><div style={{paddingTop:12}}>{def}</div></div>}
  </div>
}

// ── NB250 OVERVIEW ────────────────────────────────────────────────────────────
function BikeLearnTab({bike:b,onQuiz}){
  const GT=C.goldTxt,GOLD=C.gold,WI="rgba(255,255,255,0.8)";
  const vSz=v=>v.length<=4?22:v.length<=5?18:v.length<=9?14:11;
  const siIcons=[
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>,
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2"><path d="M6 18v-2"/><path d="M10 18v-7"/><path d="M14 18v-4"/><path d="M18 18v-2"/><path d="M3 20h18"/></svg>,
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2"><line x1="12" y1="2" x2="12" y2="15"/><path d="M5 15h14"/><path d="M5 19h14"/></svg>,
  ];
  const fuelIcon=<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2"><path d="M3 22V6l9-4v16"/><path d="M3 10h9"/><path d="M17 14h1a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2"/><path d="M19 4l2 2-2 2"/></svg>;
  const fuel=b.specs[0].rows[5][1];
  const hl=[
    ...b.stats.map((s,i)=>({v:s.val,l:s.key.toUpperCase(),fs:vSz(s.val),icon:siIcons[i]})),
    {v:fuel,l:"FUEL USE",fs:vSz(fuel),icon:fuelIcon},
  ];
  const pbIcons=[
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={WI} strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={WI} strokeWidth="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={WI} strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={WI} strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
  ];
  return <div style={{paddingBottom:80}}>
    {/* HERO */}
    <div style={{position:"relative",background:"#0d0d0d",overflow:"hidden",minHeight:210}}>
      <img src={b.images[0]} alt={b.name} style={{position:"absolute",right:0,top:0,width:"65%",height:"100%",objectFit:"cover",objectPosition:"left center"}}/>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(to right,#0d0d0d 30%,rgba(13,13,13,0.82) 52%,rgba(13,13,13,0.15) 100%)"}}/>
      <div style={{position:"relative",zIndex:2,padding:"28px 20px 24px",maxWidth:"58%"}}>
        <div style={{fontFamily:"'Inter',sans-serif",fontWeight:900,fontSize:33,textTransform:"uppercase",lineHeight:.9,letterSpacing:-0.5,marginBottom:10}}>{b.name}</div>
        <div style={{fontFamily:"'Inter',sans-serif",fontSize:22,fontWeight:700,color:GT,marginBottom:6}}>{b.price}</div>
        <div style={{fontSize:10,letterSpacing:0.5,color:"rgba(255,255,255,0.75)",textTransform:"uppercase",fontWeight:600}}>{b.type}</div>
      </div>
    </div>
    {/* CONTENT */}
    <div style={{padding:"14px 14px 0"}}>
      {/* ATTRIBUTE BADGES */}
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        {[
          {icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1l-2 8h12l-2-8z"/><path d="M5.5 14L10 6"/></svg>,label:b.badges[0]},
          {icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>,label:b.badges[1]},
          {icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,label:b.badges[2]},
        ].map(({icon,label})=>(
          <div key={label} style={{flex:1,background:"#fff",border:"1px solid rgba(0,0,0,0.08)",borderRadius:10,padding:"12px 6px",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
            {icon}
            <div style={{fontSize:10,color:"#111",lineHeight:1.3,fontWeight:600,letterSpacing:.3}}>{label}</div>
          </div>
        ))}
      </div>
      {/* TYPE / FEEL / WHO */}
      <div style={{borderRadius:10,overflow:"hidden",border:`1px solid ${C.border}`,marginBottom:12}}>
        {[["TYPE",b.anchors.type],["FEEL",b.anchors.feel],["WHO",b.anchors.who]].map(([l,v],i,arr)=>(
          <div key={l} style={{display:"flex",gap:14,padding:"12px 14px",background:C.s1,borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none"}}>
            <div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:10,letterSpacing:0.5,color:"rgba(255,255,255,0.5)",width:30,flexShrink:0,paddingTop:2}}>{l}</div>
            <div style={{fontSize:13,color:"#fafafa",lineHeight:1.5,fontFamily:"'Geist',sans-serif"}}>{v}</div>
          </div>
        ))}
      </div>
      {/* QUICK PITCH */}
      <div style={{background:C.s1,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px",marginBottom:10,display:"flex",gap:12,alignItems:"flex-start"}}>
        <div style={{flexShrink:0,marginTop:2}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={WI} strokeWidth="1.5"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:12,letterSpacing:0.5,textTransform:"uppercase",color:"#fff",marginBottom:6}}>QUICK PITCH</div>
          <div style={{fontSize:13,color:C.t2,lineHeight:1.6}}>{b.sellingPoints[0].text}</div>
        </div>
      </div>
      {/* WHY CUSTOMERS LOVE IT */}
      <div style={{background:C.s1,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px",marginBottom:16,display:"flex",gap:12,alignItems:"flex-start"}}>
        <div style={{flexShrink:0,marginTop:2}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={WI} strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:12,letterSpacing:0.5,textTransform:"uppercase",color:"#fff",marginBottom:10}}>WHY CUSTOMERS LOVE IT</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px 12px"}}>
            {(b.love||[]).map(item=>(
              <div key={item} style={{display:"flex",alignItems:"flex-start",gap:6,fontSize:12,color:C.t2,lineHeight:1.4}}>
                <span style={{color:GOLD,flexShrink:0,marginTop:1}}>•</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* KEY HIGHLIGHTS */}
      <div style={{marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:0.5,color:GT,textTransform:"uppercase"}}>KEY HIGHLIGHTS</div>
          <div style={{fontSize:12,color:C.t3}}>See all ›</div>
        </div>
        <div style={{display:"flex",gap:8,overflowX:"auto",marginLeft:-14,marginRight:-14,paddingLeft:14,paddingRight:14,paddingBottom:4}}>
          {hl.map(h=>(
            <div key={h.l} style={{flexShrink:0,background:C.s1,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 10px",textAlign:"center",minWidth:80,display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
              {h.icon}
              <div style={{fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:h.fs,color:GT,lineHeight:1}}>{h.v}</div>
              <div style={{fontSize:8,color:C.t4,letterSpacing:.8,textTransform:"uppercase",lineHeight:1.3}}>{h.l}</div>
            </div>
          ))}
        </div>
      </div>
      {/* SALES PLAYBOOK */}
      <div style={{marginBottom:20}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:0.5,color:"#fafafa",textTransform:"uppercase",marginBottom:10}}>SALES PLAYBOOK</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {b.sellingPoints.map((sp,i)=>(
            <div key={i} style={{background:C.s1,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 12px",position:"relative"}}>
              <div style={{marginBottom:8}}>{pbIcons[i]}</div>
              <div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:11,letterSpacing:0.3,textTransform:"uppercase",color:"#fff",marginBottom:6,paddingRight:14,lineHeight:1.2}}>{sp.title}</div>
              <div style={{fontSize:11,color:C.t2,lineHeight:1.5}}>{sp.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>;
}

// ── BIKE LEARN TAB V2 ───────────────────────────────────────────────────────
function BikeLearnTabV2({bike:b,initialTab,onUp,onNext}){
  const [tab,setTab]=useState(initialTab||'overview');
  const [openCats,setOpenCats]=useState(()=>({[GLOSSARY[0]?.category]:true}));
  const toggleCat=cat=>setOpenCats(p=>({...p,[cat]:!p[cat]}));
  const GOLD=C.gold,GT=C.goldTxt;
  const CARD='#141414',BORDER='#282828';
  const T1='#f5f5f5',T2='#b8b8b8',T3='#666';
  const sp=b.sellingPoints;

  const TABS=['overview','specs','sales','glossary','quiz'];
  const TLBL={overview:'Overview',specs:'Specs',sales:'Sales',glossary:'Glossary',quiz:'Quiz'};

  const statIcons=[
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.8"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>,
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.8"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.8"><line x1="12" y1="2" x2="12" y2="15"/><path d="M5 15h14"/><path d="M5 19h14"/></svg>,
  ];

  const anchorIcons={
    TYPE:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.8"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><circle cx="7" cy="7" r="1.5" fill={GOLD} stroke="none"/></svg>,
    FEEL:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
    WHO:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  };

  const salesCards=[
    {icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,title:'Opening Pitch',text:sp[0].text},
    {icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,title:'Ideal Customer',text:sp[2].text},
    {icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,title:sp[3].title,text:sp[3].text},
    {icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,title:'Competitor Comparison',text:sp[1].text},
  ];

  const isCommander=b.name.includes('Commander');
  const nameParts=isCommander
    ?['Dark Flag','500','Commander']
    :[b.name.split(' ')[0],b.name.split(' ').slice(1).join(' ')];

  return <div style={{background:'#0a0a0a',color:T1,fontFamily:"'Geist',sans-serif",paddingBottom:40}}>

    {/* HERO */}
    {tab!=='quiz'&&<div style={{position:'relative',overflow:'hidden',padding:'20px 20px 14px',minHeight:170}}>
      <img src={b.img} alt={b.name} style={{position:'absolute',right:'-5px',top:'-10px',height:'115%',width:'58%',objectFit:'contain',opacity:0.92,filter:'brightness(1.1)',WebkitMaskImage:'linear-gradient(to right,transparent 0%,black 20%,black 80%,transparent 100%)',maskImage:'linear-gradient(to right,transparent 0%,black 20%,black 80%,transparent 100%)',pointerEvents:'none'}}/>
      <div style={{position:'relative',zIndex:1,textAlign:'left'}}>
        <div style={{fontFamily:"'Inter',sans-serif",fontWeight:900,textTransform:'uppercase',lineHeight:0.88,letterSpacing:-0.5,color:T1}}>
          <div style={{fontSize:28}}>{nameParts[0]}</div>
          <div style={{fontSize:42}}>{nameParts[1]}</div>
          {isCommander&&<div style={{fontSize:13,letterSpacing:3,fontWeight:600,marginTop:4,color:T3}}>{nameParts[2]}</div>}
        </div>
        <div style={{fontSize:10,color:T3,fontWeight:600,letterSpacing:2.5,textTransform:'uppercase',marginTop:8,marginBottom:8}}>{b.type}</div>
        <div style={{fontFamily:"'Inter',sans-serif",fontSize:26,fontWeight:800,color:GT,lineHeight:1}}>{b.price}</div>
      </div>
    </div>}

    {/* TAB BAR */}
    <div style={{display:'flex',overflowX:'auto',scrollbarWidth:'none',borderBottom:`1px solid ${BORDER}`,padding:'0 16px',WebkitOverflowScrolling:'touch',position:'sticky',top:0,zIndex:90,background:'#0a0a0a'}}>
      {TABS.map(t=>(
        <button key={t} onClick={()=>setTab(t)} className="tp" style={{
          flexShrink:0,padding:'10px 12px',background:'none',border:'none',
          borderBottom:tab===t?`2px solid ${GOLD}`:'2px solid transparent',
          color:tab===t?GT:T3,
          fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:11,letterSpacing:0.3,textTransform:'uppercase',cursor:'pointer',marginBottom:-1,whiteSpace:'nowrap'
        }}>{TLBL[t]}</button>
      ))}
    </div>

    {/* OVERVIEW */}
    {tab==='overview'&&<div style={{padding:'20px'}}>
      <div style={{display:'flex',gap:8,marginBottom:20}}>
        {[
          {icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 00-1-1h-4a1 1 0 00-1 1l-2 8h12l-2-8z"/><path d="M5.5 14L10 6"/></svg>,label:b.badges[0]},
          {icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5"><path d="M20.24 12.24a6 6 0 00-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>,label:b.badges[1]},
          {icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,label:b.badges[2]},
        ].map(({icon,label})=>(
          <div key={label} style={{flex:1,background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:'12px 6px',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
            {icon}
            <div style={{fontSize:10,color:T1,lineHeight:1.3,fontWeight:500}}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,overflow:'hidden',marginBottom:20}}>
        {[['TYPE',b.anchors.type,'TYPE'],['FEEL',b.anchors.feel,'FEEL'],['WHO',b.anchors.who,'WHO']].map(([l,v,k],i,arr)=>(
          <div key={l} style={{display:'flex',gap:0,padding:'12px 14px',borderBottom:i<arr.length-1?`1px solid ${BORDER}`:'none',alignItems:'flex-start'}}>
            <div style={{display:'flex',alignItems:'center',gap:8,width:80,flexShrink:0,paddingRight:14,borderRight:`1px solid ${BORDER}`,marginRight:14}}>
              <div style={{flexShrink:0}}>{anchorIcons[k]}</div>
              <div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:13,letterSpacing:0.5,color:T1}}>{l}</div>
            </div>
            <div style={{fontSize:12,color:T2,lineHeight:1.5,fontFamily:"'Geist',sans-serif",flex:1,textAlign:'left'}}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,overflow:'hidden',marginBottom:20}}>
        <div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:14,letterSpacing:0.5,textTransform:'uppercase',color:T1,padding:'14px 14px 10px',textAlign:'left'}}>Key Facts</div>
        {(b.facts||[]).map((f,i)=>(
          <div key={i} style={{display:'flex',gap:12,padding:'10px 14px',borderTop:`1px solid ${BORDER}`,alignItems:'flex-start'}}>
            <div style={{fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:16,color:GT,flexShrink:0,width:20,lineHeight:1,paddingTop:3}}>{i+1}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:12,fontWeight:600,color:T1,marginBottom:2,textAlign:'left'}}>{f.title}</div>
              <div style={{fontSize:12,color:T2,lineHeight:1.5,textAlign:'left'}}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:'14px'}}>
        <div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:14,letterSpacing:0.5,textTransform:'uppercase',color:T1,marginBottom:12,textAlign:'left'}}>Why Customers Love It</div>
        {(b.love||[]).map(item=>(
          <div key={item} style={{display:'flex',alignItems:'flex-start',gap:10,marginBottom:9}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,marginTop:2}}><polyline points="20 6 9 17 4 12"/></svg>
            <span style={{fontSize:13,color:T2,lineHeight:1.4}}>{item}</span>
          </div>
        ))}
      </div>
    </div>}

    {/* SPECS */}
    {tab==='specs'&&<div style={{padding:'20px'}}>
      <div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:14,letterSpacing:0.5,textTransform:'uppercase',color:T1,marginBottom:10}}>Key Stats</div>
      <div style={{display:'flex',gap:8,marginBottom:24}}>
        {b.stats.map((s,i)=>(
          <div key={s.key} style={{flex:1,background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:'12px 8px',display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
            {statIcons[i]}
            <div style={{fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:16,color:GT,lineHeight:1,marginTop:2}}>{s.val}</div>
            <div style={{fontSize:10,color:T3,fontWeight:600,letterSpacing:0.8,textTransform:'uppercase',textAlign:'center'}}>{s.key}</div>
          </div>
        ))}
      </div>
      {b.specs.map(g=>(
        <div key={g.group} style={{marginBottom:20}}>
          <div style={{fontSize:10,letterSpacing:0.5,textTransform:'uppercase',color:T3,paddingBottom:8,borderBottom:`1px solid ${BORDER}`,fontWeight:700}}>{g.group}</div>
          {g.rows.map(([k,v])=>(
            <div key={k} style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',padding:'10px 0',borderBottom:`1px solid ${BORDER}`,gap:16}}>
              <span style={{fontSize:13,color:T3}}>{k}</span>
              <span style={{fontSize:13,fontWeight:600,textAlign:'right',color:T1}}>{v}</span>
            </div>
          ))}
        </div>
      ))}
    </div>}

    {/* SALES */}
    {tab==='sales'&&<div style={{padding:'20px'}}>
      <div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:11,letterSpacing:0.5,textTransform:'uppercase',color:T1,marginBottom:12}}>Sales Playbook</div>
      {salesCards.map(({icon,title,text})=>(
        <div key={title} style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:'14px',marginBottom:10,display:'flex',gap:12,alignItems:'flex-start'}}>
          <div style={{flexShrink:0,marginTop:2}}>{icon}</div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:11,letterSpacing:0.5,textTransform:'uppercase',color:T1,marginBottom:6,textAlign:'left'}}>{title}</div>
            <div style={{fontSize:13,color:T2,lineHeight:1.55,textAlign:'left'}}>{text}</div>
          </div>
        </div>
      ))}
    </div>}

    {/* GLOSSARY */}
    {tab==='glossary'&&<div style={{padding:'20px'}}>
      <div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:14,letterSpacing:0.5,textTransform:'uppercase',color:T1,marginBottom:16}}>Glossary</div>
      {GLOSSARY.map((cat)=>(
        <div key={cat.category} style={{marginBottom:8}}>
          <div onClick={()=>toggleCat(cat.category)} style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:12,letterSpacing:0.5,textTransform:'uppercase',color:T2,padding:'10px 0',borderBottom:`1px solid ${BORDER}`,fontWeight:700,cursor:'pointer'}}>
            <span>{cat.category}</span>
            <span style={{fontSize:16,color:T3,transition:'transform .2s',transform:openCats[cat.category]?'rotate(45deg)':'rotate(0deg)',display:'inline-block'}}>+</span>
          </div>
          {openCats[cat.category]&&<div style={{display:'flex',flexDirection:'column'}}>
            {cat.terms.map(t=>(
              <div key={t.term} style={{borderBottom:`1px solid ${BORDER}`,padding:'10px 0'}}>
                <div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:12,color:T1,marginBottom:4}}>{t.term}</div>
                <div style={{fontSize:12,color:T2,lineHeight:1.5}}>{t.def}</div>
              </div>
            ))}
          </div>}
        </div>
      ))}
    </div>}

    {/* QUIZ */}
    {tab==='quiz'&&<QuizTab bike={b} onLearn={()=>setTab('overview')} onUp={onUp} onNext={onNext}/>}

  </div>;
}

// ── LEARN TAB ───────────────────────────────────────────────────────────────
function LearnTab({bike:b,onQuiz}){
  if(b.id==='nb500') return <BikeLearnTabV2 bike={b} onQuiz={onQuiz}/>;
  return <BikeLearnTab bike={b} onQuiz={onQuiz}/>;
}
// ── SPECS TAB ───────────────────────────────────────────────────────────────
function SpecsTab({bike:b}){
  return <div style={bd}>
    {b.specs.map((g,gi)=><A key={g.group} d={gi*80}><div style={{marginBottom:24}}>
      <div style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",color:C.accent,paddingBottom:10,borderBottom:`1px solid ${C.border}`,fontWeight:600}}>{g.group}</div>
      {g.rows.map(([k,v])=><div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",padding:"11px 0",borderBottom:`1px solid ${C.border}`,gap:16}}>
        <span style={{fontSize:13,color:C.t2}}>{k}</span>
        <span style={{fontSize:13,fontWeight:500,textAlign:"right"}}>{v}</span>
      </div>)}
    </div></A>)}
  </div>
}

// ── FLASHCARDS TAB ──────────────────────────────────────────────────────────
function FlashTab({bike:b}){
  const [idx,sI]=useState(0);
  const [flipped,sF]=useState(false);
  const [confident,sC]=useState(new Set());
  const [study,sS]=useState(new Set());
  const [mode,sM]=useState("all");
  const [flash,setFlash]=useState(null); // 'ok' | 'no' | null
  const cards=b.flashcards||[];
  const pool=mode==="study"?[...study]:[...Array(cards.length).keys()];
  const ri=pool[idx%pool.length]??0;
  const card=cards[ri];const tot=pool.length;

  if(!cards.length)return <div style={bd}><div style={{color:C.t3}}>No flashcards.</div></div>;

  function markOk(){
    setFlash('ok');
    sC(p=>new Set([...p,ri]));
    sS(p=>{const n=new Set(p);n.delete(ri);return n});
    setTimeout(()=>{setFlash(null);sF(false);sI(i=>(i+1)%Math.max(pool.length,1))},700);
  }
  function markStudy(){
    setFlash('no');
    sS(p=>new Set([...p,ri]));
    setTimeout(()=>{setFlash(null);sF(false);sI(i=>(i+1)%Math.max(pool.length,1))},500);
  }
  function adv(){sF(false);sI(i=>(i+1)%Math.max(pool.length,1))}

  const allDone=confident.size===cards.length;
  const bikeCol=BIKE_COLOURS[b.id]||"#a855f7";
  const cardBorder=flash==='ok'?"#22c55e":flash==='no'?"#ef4444":flash?C.border:flipped?bikeCol:C.border;
  return <div style={bd}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
      <div style={{fontSize:12,color:C.t2,letterSpacing:1}}>
        {mode==="study"?`Reviewing ${study.size}`:`${idx%cards.length+1} / ${cards.length}`}
      </div>
      <div style={{display:"flex",gap:12}}>
        {confident.size>0&&<span style={{fontSize:11,color:C.okTxt}}>✓ {confident.size}</span>}
        {study.size>0&&<span style={{fontSize:11,color:C.noTxt}}>✗ {study.size}</span>}
      </div>
    </div>
    {study.size>0&&mode==="all"&&<div className="tp" onClick={()=>{sM("study");sI(0);sF(false)}} style={{background:C.noBg,border:`1px solid ${C.noBdr}`,borderRadius:6,padding:"12px 14px",marginBottom:16,textAlign:"center"}}>
      <span style={{fontSize:13,color:C.noTxt,fontWeight:500}}>Focus on {study.size} card{study.size!==1?"s":""} to study</span>
    </div>}
    {mode==="study"&&<div className="tp" onClick={()=>{sM("all");sI(0);sF(false)}} style={{...crd,padding:"12px 14px",marginBottom:16,textAlign:"center"}}>
      <span style={{fontSize:13,color:C.t3}}>Back to all cards</span>
    </div>}
    <div style={{position:"relative",marginBottom:24}}>
      <div style={{position:"absolute",top:6,left:8,right:8,height:"100%",background:C.s2,borderRadius:8,border:`1px solid ${C.border}`,opacity:.3}}/>
      <div style={{position:"absolute",top:3,left:4,right:4,height:"100%",background:C.s2,borderRadius:8,border:`1px solid ${C.border}`,opacity:.5}}/>
      <div className="tp" onClick={()=>sF(!flipped)} style={{position:"relative",background:flipped?C.s2:C.s1,border:`1px solid ${cardBorder}`,borderRadius:8,overflow:"hidden",padding:"48px 28px 28px",minHeight:200,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",transition:"all .2s ease",boxShadow:flash==="ok"?`0 0 0 3px #22c55e,0 0 20px #22c55e66`:flash==="no"?`0 0 0 3px #ef4444,0 0 20px #ef444466`:flipped?`0 0 20px ${bikeCol}33`:"none"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:4,background:flash==="ok"?"#22c55e":flash==="no"?"#ef4444":bikeCol}}/>
        <div style={{position:"absolute",top:12,left:0,right:0,textAlign:"center",fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:11,letterSpacing:0.5,textTransform:"uppercase",color:flash==="ok"?"#22c55e":flash==="no"?"#ef4444":bikeCol,opacity:.8}}>{b.name}</div>
        <div style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",color:flash==="ok"?"#22c55e":flash==="no"?"#ef4444":flipped?bikeCol:C.t4,marginBottom:20,fontWeight:600}}>{flipped?"Answer":"Question"}</div>
        <div key={`${ri}-${flipped}`} className="af" style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:flipped?24:20,letterSpacing:.5,lineHeight:1.3,color:flipped?C.text:"#ccc"}}>
          {flipped?card.back:card.front}
        </div>
        {!flipped&&<div style={{fontSize:12,color:C.t4,marginTop:20}}>Tap to reveal</div>}
      </div>
    </div>
    {flipped?(
      <A><div style={{display:"flex",gap:10}}>
        <button className="tp" onClick={markStudy} style={{flex:1,padding:16,background:C.noBg,border:`1px solid ${C.noBdr}`,borderRadius:6,fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:13,letterSpacing:1,textTransform:"uppercase",color:C.noTxt,cursor:"pointer"}}>Not Quite</button>
        <button className="tp" onClick={markOk} style={{flex:1,padding:16,background:C.okBg,border:`1px solid ${C.okBdr}`,borderRadius:6,fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:13,letterSpacing:1,textTransform:"uppercase",color:C.okTxt,cursor:"pointer"}}>Got It</button>
      </div></A>
    ):(
      <div style={{display:"flex",gap:8}}>
        <button className="tp" style={{...btnG,flex:1,padding:14}} onClick={()=>{sF(false);sI(i=>(i-1+cards.length)%cards.length)}}>Prev</button>
        <button className="tp" style={{...btnG,flex:1,padding:14}} onClick={()=>{sF(false);sI(i=>(i+1)%cards.length)}}>Next</button>
      </div>
    )}
    {allDone&&<A d={200}><div style={{textAlign:"center",marginTop:20,padding:16,background:C.okBg,border:`1px solid ${C.okBdr}`,borderRadius:6}}>
      <div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:16,color:C.okTxt,textTransform:"uppercase",letterSpacing:1}}>All cards done!</div>
    </div></A>}
  </div>;
}

// ── QUIZ TAB ────────────────────────────────────────────────────────────────
function QuizTab({bike:b,onLearn,onUp,onNext}){
  const [phase,sP]=useState("start");
  const [diff,sD]=useState("easy");
  const [qs,sQ]=useState([]);
  const [sc,sS]=useState(0);
  const [wrong,sW]=useState([]);

  function start(){const q=[...b.questions[diff]].sort(()=>Math.random()-.5).slice(0,5);sQ(q);sS(0);sP("quiz")}
  function fin(s){sS(s);onUp(b.id,diff,s,qs.length);sP("results")}

  const nd=diff==="easy"?"medium":diff==="medium"?"hard":null;
  const nxt=nb(b.id);
  const pct=qs.length>0?Math.round(sc/qs.length*100):0;

  if(phase==="start")return <div style={bd}>
    <A><div style={sec}>{b.name} Quiz</div><div style={{fontSize:13,color:C.t2,lineHeight:1.6,marginBottom:24}}>Test your knowledge. All answers are in the Learn tab.</div></A>
    <A d={100}><div style={{display:"flex",gap:8,marginBottom:24}}>
      {[["easy","Easy","Key facts","#22c55e"],["medium","Medium","Specs & details","#f59e0b"],["hard","Hard","Sales scenarios","#ef4444"]].map(([d,l,desc,col])=>(
        <div key={d} className="tp" style={{flex:1,padding:"13px 8px",border:`1px solid ${diff===d?col:C.border}`,background:diff===d?`${col}18`:C.s1,borderRadius:6,textAlign:"center",transition:"all .2s"}} onClick={()=>sD(d)}>
          <div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:14,letterSpacing:1,textTransform:"uppercase",marginBottom:3,color:col}}>{l}</div>
          <div style={{fontSize:11,color:C.t2}}>{desc}</div>
        </div>
      ))}
    </div></A>
    <A d={200}><button className="tp" style={{...btnA,background:C.gold,color:'#1a1000'}} onClick={start}>Start Quiz</button></A>
  </div>;

  if(phase==="results")return <Res score={sc} total={qs.length} actions={<>
    {pct===100&&nd&&<button className="tp" style={{...btnA,background:C.gold,color:'#1a1000'}} onClick={()=>{sD(nd);sP("start")}}>Level Up to {nd[0].toUpperCase()+nd.slice(1)}</button>}
    {pct===100&&!nd&&nxt&&<button className="tp" style={{...btnA,background:C.gold,color:'#1a1000'}} onClick={()=>onNext(nxt)}>Next Bike: {nxt.name}</button>}
    {pct<100&&<button className="tp" style={{...btnA,background:C.gold,color:'#1a1000'}} onClick={()=>sP("start")}>Try {diff} Again</button>}
    <button className="tp" style={btnG} onClick={onLearn}>Review Learn Tab</button>
  </>}/>;

  return <QE questions={qs} badge={()=>diff} onFinish={fin}/>;
}

// ── BIKE SCREEN ─────────────────────────────────────────────────────────────
function BikeScreen({bike:b,initialTab,onBack,onUp,onChange}){
  return <div style={{position:'fixed',inset:0,overflow:'hidden',background:C.bg,display:'flex',flexDirection:'column'}}>
    <div style={{background:C.bg,borderBottom:`1px solid ${C.border}`,padding:'12px 20px',display:'flex',alignItems:'center',flexShrink:0,zIndex:100}}>
      <button className="tp" style={{background:'none',border:'none',color:C.t3,fontSize:22,cursor:'pointer',padding:'0 8px 0 0',lineHeight:1,flexShrink:0}} onClick={onBack}>←</button>
      <div style={{position:'absolute',left:0,right:0,display:'flex',justifyContent:'center',pointerEvents:'none'}}>
        <img src="/images/BENDAlogo.png" alt="Benda" style={{height:42,objectFit:'contain',filter:'brightness(0) invert(1)'}}/>
      </div>
    </div>
    <div style={{flex:1,overflowY:'auto',WebkitOverflowScrolling:'touch'}}>
      <BikeLearnTabV2 bike={b} initialTab={initialTab} onUp={onUp} onNext={onChange}/>
    </div>
  </div>;
}

// ── GENERAL QUIZ SCREEN ─────────────────────────────────────────────────────
function GQScreen({onBack,onFin}){
  const allQ=[...BIKES.flatMap(b=>Object.entries(b.questions).flatMap(([d,qs])=>qs.map(q=>({...q,bike:b.name,difficulty:d})))),...COMPQ];
  const [qs]=useState(()=>{
    const pool=[...allQ];
    // Double shuffle to ensure thorough mixing across bikes
    for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
    for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
    return pool.slice(0,12);
  });
  const [sc,sS]=useState(null);
  function fin(s){onFin(s,qs.length);sS(s)}
  return <div style={{position:'fixed',inset:0,overflow:'hidden',background:'#000',display:'flex',flexDirection:'column'}}>
    <Hdr title="All Models Quiz" onBack={onBack}/>
    <div style={{flex:1,overflowY:'auto',WebkitOverflowScrolling:'touch'}}>
      {sc!==null
        ?<Res score={sc} total={qs.length} actions={<button className="tp" style={btnG} onClick={onBack}>Back</button>}/>
        :<QE questions={qs} badge={q=>`${q.bike} · ${q.difficulty}`} onFinish={fin}/>
      }
    </div>
  </div>;
}

// ── SCENARIOS SCREEN ────────────────────────────────────────────────────────
function ScScreen({onBack,onFin}){
  const [scs]=useState(()=>[...SCENARIOS].sort(()=>Math.random()-.5).slice(0,6));
  const [idx,sI]=useState(0);
  const [ch,sC]=useState(null);
  const [sc,sS]=useState(0);
  const [phase,sP]=useState("active");
  const [an,sA]=useState("");
  function pick(id){if(ch!==null)return;const ok=id===scs[idx].answer;if(ok)sS(s=>s+1);sC(id);sA(ok?"ac":"aw");setTimeout(()=>sA(""),400)}
  function next(){if(idx+1>=scs.length){onFin(sc,scs.length);sP("results")}else{sI(i=>i+1);sC(null)}}

  if(phase==="results")return <div style={{position:'fixed',inset:0,overflow:'hidden',background:'#000',display:'flex',flexDirection:'column'}}><Hdr title="Scenarios" onBack={onBack}/><div style={{flex:1,overflowY:'auto',WebkitOverflowScrolling:'touch'}}><Res score={sc} total={scs.length} actions={<button className="tp" style={btnG} onClick={onBack}>Back</button>}/></div></div>;

  const s=scs[idx];const tot=scs.length;const pct=((idx+(ch!==null?1:0))/tot)*100;
  const cb=BIKES.find(b=>b.id===s.answer);

  return <div style={{position:'fixed',inset:0,overflow:'hidden',background:"#000",color:"#fafafa",fontFamily:"'Geist',sans-serif",display:'flex',flexDirection:'column'}}>
    <Hdr onBack={onBack}/>
    <div style={{flex:1,overflowY:'auto',WebkitOverflowScrolling:'touch'}}><div style={bd}>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#666",letterSpacing:0.5,textTransform:"uppercase",marginBottom:8,fontFamily:"'Inter',sans-serif",fontWeight:700}}>
        <span>Scenario {idx+1} of {tot}</span><span style={{color:C.goldTxt}}>{sc} correct</span>
      </div>
      <div style={{height:3,background:"#2a2a2a",borderRadius:3,marginBottom:24,overflow:"hidden"}}>
        <div style={{height:"100%",background:C.gold,borderRadius:3,width:pct+"%",transition:"width .5s ease"}}/>
      </div>
      <div style={{display:"inline-block",fontSize:10,letterSpacing:0.5,textTransform:"uppercase",color:"#666",border:"1px solid #2a2a2a",padding:"4px 10px",borderRadius:6,marginBottom:14,fontFamily:"'Inter',sans-serif",fontWeight:700}}>{s.difficulty}</div>
      <A t="as" key={idx}><div style={{background:"#141414",border:"1px solid #2a2a2a",borderRadius:14,padding:"16px 18px",marginBottom:20,position:"relative",overflow:"hidden"}}>
        <img src="/images/customer scenarios bg remove.png" alt="" style={{position:"absolute",right:-8,bottom:"-12%",height:"115%",width:"45%",objectFit:"contain",objectPosition:"right bottom",opacity:0.55,pointerEvents:"none"}}/>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{fontSize:10,letterSpacing:0.5,textTransform:"uppercase",color:C.goldTxt,fontWeight:700,fontFamily:"'Inter',sans-serif",marginBottom:10}}>Customer Walks In</div>
          <div style={{fontSize:14,lineHeight:1.6,color:"#e0e0e0",paddingRight:"38%"}}>{s.situation}</div>
        </div>
      </div></A>
      <div style={{fontSize:10,color:"#666",letterSpacing:0.5,textTransform:"uppercase",marginBottom:10,fontFamily:"'Inter',sans-serif",fontWeight:700}}>Which bike?</div>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}} className={an}>
        {s.opts.map(id=>{
          const bk=BIKES.find(b=>b.id===id);
          let bg="#141414",br="#2a2a2a",cl="#fafafa";
          if(ch!==null){if(id===s.answer){bg=C.okBg;br=C.okBdr;cl=C.okTxt}else if(id===ch){bg=C.noBg;br=C.noBdr;cl=C.noTxt}else cl="#444"}
          return <HoverBtn key={id} onClick={()=>pick(id)} disabled={ch!==null} style={{width:"100%",padding:"14px 16px",background:bg,border:`1px solid ${br}`,borderRadius:12,color:cl,fontSize:14,textAlign:"left",cursor:ch===null?"pointer":"default",lineHeight:1.4}}>
            <span style={{fontWeight:700,fontFamily:"'Inter',sans-serif"}}>{bk.name}</span><span style={{color:"#666",marginLeft:8,fontSize:12}}>{bk.type}</span>
          </HoverBtn>
        })}
      </div>
      {ch!==null&&<A>
        <div style={{padding:"12px 16px",borderLeft:`3px solid ${ch===s.answer?C.ok:C.no}`,fontSize:13,lineHeight:1.6,color:"#b8b8b8",marginBottom:16,background:"#0d0d0d",borderRadius:"0 8px 8px 0"}}>
          {ch===s.answer?`Correct — ${cb.name}. `:`The answer was ${cb.name}. `}{s.reasoning}
        </div>
        <div style={{background:"#141414",border:"1px solid #2a2a2a",borderRadius:14,padding:"14px 16px",marginBottom:16}}>
          <div style={{fontFamily:"'Inter',sans-serif",fontSize:10,letterSpacing:0.5,textTransform:"uppercase",color:C.goldTxt,fontWeight:700,marginBottom:10}}>{cb.name}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:"#2a2a2a",borderRadius:8,overflow:"hidden",marginBottom:10}}>
            {cb.stats.map(st=><div key={st.key} style={{background:"#0d0d0d",padding:"10px 12px",textAlign:"center"}}>
              <div style={{fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:17,color:"#fafafa",lineHeight:1,marginBottom:2}}>{st.val}</div>
              <div style={{fontSize:9,color:"#666",letterSpacing:0.5,textTransform:"uppercase",fontWeight:700}}>{st.key}</div>
            </div>)}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}>
            <span style={{color:"#666"}}>{cb.type}</span>
            <span style={{fontFamily:"'Inter',sans-serif",fontWeight:700,color:C.goldTxt}}>{cb.price}</span>
          </div>
        </div>
      </A>}
      {ch!==null&&<button className="tp" style={{width:"100%",padding:14,background:"#141414",border:"1px solid #2a2a2a",borderRadius:12,fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:13,letterSpacing:0.5,textTransform:"uppercase",color:"#fafafa",cursor:"pointer"}} onClick={next}>{idx+1<tot?"Next Scenario ›":"See Results"}</button>}
    </div></div>
  </div>;
}


// ── GLOSSARY TAB ────────────────────────────────────────────────────────────
function GlossaryTab(){
  const [open,sO]=useState(null);
  return <div style={{paddingBottom:80}}>
    <div style={{padding:"40px 20px 24px",borderBottom:`1px solid ${C.border}`}}>
      <A><div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:32,letterSpacing:1,lineHeight:1.1,marginBottom:8}}>GLOSSARY</div></A>
      <A d={60}><div style={{fontSize:13,color:C.t3,lineHeight:1.6}}>Common motorcycle terms explained plainly.</div></A>
    </div>
    <div style={{padding:"24px 20px 40px"}}>
      {GLOSSARY.map((cat,ci)=>(
        <A key={cat.category} d={ci*60}>
          <div style={{...sec,marginBottom:12,marginTop:ci>0?28:0}}>{cat.category}</div>
          <div style={{display:"flex",flexDirection:"column",gap:1}}>
            {cat.terms.map((t,ti)=>{
              const key=`${ci}-${ti}`;
              const isOpen=open===key;
              return <div key={t.term} style={{background:C.s1,border:`1px solid ${C.border}`,borderRadius:isOpen?6:0,marginBottom:isOpen?4:0,overflow:"hidden",transition:"all .2s"}}>
                <div className="tp" onClick={()=>sO(isOpen?null:key)} style={{padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
                  <div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:16,letterSpacing:1}}>{t.term}</div>
                  <div style={{color:C.t4,fontSize:18,transition:"transform .2s",transform:isOpen?"rotate(45deg)":"rotate(0deg)"}}>+</div>
                </div>
                {isOpen&&<A><div style={{padding:"0 18px 16px",fontSize:14,color:C.t2,lineHeight:1.7,borderTop:`1px solid ${C.border}`}}><div style={{paddingTop:14}}>{t.def}</div></div></A>}
              </div>
            })}
          </div>
        </A>
      ))}
    </div>
  </div>;
}

// ── APP ─────────────────────────────────────────────────────────────────────
function App(){
  const [screen,sS]=useState("main");
  const [tab,sT]=useState("home");
  const [bike,sB]=useState(null);
  const [initTab,sIT]=useState("overview");
  const {p,up,rst}=useProg();

  function openBike(b,t="overview"){sB(b);sIT(t);sS("bike");window.scrollTo(0,0)}
  function navTo(dest){
    if(dest==="glossary"){sS("glossary");return;}
    sT(dest);
  }
  function bqFin(id,d,sc,tot){up(pr=>{if(!pr.bikeQuiz[id])pr.bikeQuiz[id]={};const pv=pr.bikeQuiz[id][d];pr.bikeQuiz[id][d]={best:pv?Math.max(pv.best,sc):sc,total:tot,attempts:pv?pv.attempts+1:1};return pr})}
  function gqFin(sc,tot){up(pr=>{pr.generalQuiz={best:Math.max(pr.generalQuiz.best,sc),total:tot,attempts:pr.generalQuiz.attempts+1};return pr})}
  function scFin(sc,tot){up(pr=>{pr.scenarios={completed:pr.scenarios.completed+tot,correct:pr.scenarios.correct+sc,attempts:pr.scenarios.attempts+1};return pr})}

  return <div style={{background:C.bg,minHeight:"100vh",color:C.text,fontFamily:"'Geist',sans-serif",fontSize:15}}>
    <style>{CSS}</style>
{screen==="main"&&<>
      {tab==="home"&&<HomeTab progress={p} onBike={openBike} onNav={navTo}/>}
      {tab==="range"&&<RangeTab onBike={openBike} progress={p}/>}
      {tab==="train"&&<TrainTab onQuiz={()=>sS("gquiz")} onScenarios={()=>sS("scenarios")} onGlossary={()=>sS("glossary")} progress={p} onBike={openBike} onBot={()=>sT("bot")}/>}
      {tab==="compare"&&<CompareTab/>}
      {tab==="bot"&&<BotTab/>}
      {tab==="progress"&&<ProgressTab progress={p} onReset={rst}/>}
      <TabBar active={tab} onChange={sT}/>
    </>}
    {screen==="bike"&&bike&&<BikeScreen bike={bike} initialTab={initTab} onBack={()=>sS("main")} onUp={bqFin} onChange={b=>{sB(b);sIT("overview")}}/>}
    {screen==="gquiz"&&<GQScreen onBack={()=>sS("main")} onFin={gqFin}/>}
    {screen==="scenarios"&&<ScScreen onBack={()=>sS("main")} onFin={scFin}/>}
    {screen==="glossary"&&<div style={{position:"fixed",inset:0,overflow:"hidden",background:"#000",color:"#fafafa",fontFamily:"'Geist',sans-serif"}}>
      <Hdr onBack={()=>sS("main")}/>
      <div style={{overflowY:"auto",height:"calc(100% - 65px)",WebkitOverflowScrolling:"touch",paddingBottom:80}}>
        <div style={{padding:"20px 16px 0"}}>
          {GLOSSARY.map((cat,ci)=>(
            <A key={cat.category} d={ci*60}>
              <div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:10,letterSpacing:0.5,textTransform:"uppercase",color:"#E8B956",marginBottom:8,marginTop:ci>0?24:0}}>{cat.category}</div>
              <div style={{borderRadius:14,overflow:"hidden",border:"1px solid #2a2a2a",marginBottom:4}}>
                {cat.terms.map((t,ti,arr)=>{
                  const isLast=ti===arr.length-1;
                  return <GlossaryItem key={t.term} term={t.term} def={t.def} isLast={isLast}/>;
                })}
              </div>
            </A>
          ))}
        </div>
      </div>
    </div>}
  </div>;
}

export default App;
