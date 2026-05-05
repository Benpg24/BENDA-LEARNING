import { useState, useEffect, useCallback, useRef } from 'react';
import { BIKES, SCENARIOS, COMP, COMPQ, GLOSSARY, bm, om, bs, nb } from './data/bikes.js';
import { C, bd, crd, sec, btnA, btnG, BIKE_COLOURS, A, Ring, HoverCard } from './shared.jsx';
import RangeTab from './pages/RangeTab.jsx';
import TrainTab from './pages/TrainTab.jsx';
import ProgressTab from './pages/ProgressTab.jsx';
import CompareTab from './pages/CompareTab.jsx';
import HomeTab from './pages/HomeTab.jsx';

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
if (pct === 100) return { label: "EXPERT", color: C.tE, msg: "Perfect score. You own this material.", icon: "◆" };
if (pct >= 75) return { label: "STRONG", color: C.tS, msg: "Solid knowledge. Close a couple of gaps and you're there.", icon: "▲" };
if (pct >= 50) return { label: "DEVELOPING", color: C.tD, msg: "Getting there. Review what you missed and go again.", icon: "●" };
return { label: "NEEDS WORK", color: C.tW, msg: "Spend time on the Learn tab before your next attempt.", icon: "○" };
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
};

// ── BOTTOM TAB BAR ──────────────────────────────────────────────────────────
function TabBar({active,onChange}){
  const tabs=[
    {id:"home",label:"Home",icon:Icons.home},
    {id:"range",label:"Range",icon:Icons.range},
    {id:"train",label:"Train",icon:Icons.train},
    {id:"compare",label:"Compare",icon:Icons.compare},
    {id:"progress",label:"Progress",icon:Icons.progress},
  ];
  return <div style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(0,0,0,0.95)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderTop:`1px solid #1a1a1a`,display:"flex",zIndex:200,paddingBottom:"env(safe-area-inset-bottom)"}}>
    {tabs.map(t=>{
      const isActive=active===t.id;
      return <button key={t.id} className="tp" onClick={()=>onChange(t.id)} style={{flex:1,padding:"10px 0 8px",background:"none",border:"none",color:isActive?C.goldTxt:C.t3,display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer",transition:"color .2s",position:"relative"}}>
        {isActive&&<div style={{position:"absolute",top:0,width:20,height:2,background:C.gold,borderRadius:2}}/>}
        <t.icon/><span style={{fontSize:9,letterSpacing:1,fontWeight:isActive?700:400,fontFamily:"'Rajdhani',sans-serif",textTransform:"uppercase"}}>{t.label}</span>
      </button>;
    })}
  </div>;
}

// ── HEADER ───────────────────────────────────────────────────────────────────
function Hdr({title,onBack,right}){
  return <div style={{background:C.bg,borderBottom:`1px solid ${C.border}`,padding:"16px 20px",display:"flex",alignItems:"center",gap:12,position:"sticky",top:0,zIndex:100}}>
    {onBack&&<button className="tp" style={{background:"none",border:"none",color:C.t3,fontSize:22,cursor:"pointer",padding:"0 8px 0 0",lineHeight:1}} onClick={onBack}>←</button>}
    <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:17,letterSpacing:2,textTransform:"uppercase",flex:1}}>{title}</div>
    {right}
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
  return <div style={bd}>
    <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.t2,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>
      <span>Question {idx+1} of {tot}</span>
      <span style={{color:C.accent}}>{sc} correct</span>
    </div>
    <div style={{height:3,background:C.border,borderRadius:3,marginBottom:28,overflow:"hidden"}}>
      <div style={{height:"100%",background:C.accent,borderRadius:3,width:pct+"%",transition:"width .5s ease"}}/>
    </div>
    {badge&&(()=>{const bt=badge(q);const bc=bt.includes("easy")?"#22c55e":bt.includes("medium")?"#f59e0b":bt.includes("hard")?"#ef4444":C.t2;return <div style={{display:"inline-block",fontSize:10,letterSpacing:2,textTransform:"uppercase",color:bc,border:`1px solid ${bc}`,padding:"4px 10px",borderRadius:3,marginBottom:14}}>{bt}</div>})()}
    <A t="as" key={idx}><div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:22,lineHeight:1.25,marginBottom:24,letterSpacing:.5}}>{q.q}</div></A>
    <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}} className={an}>
      {os.map(o=>{
        let bg=C.s1,br=C.border,cl=C.text;
        if(ch!==null){if(o===q.a){bg=C.okBg;br=C.okBdr;cl=C.okTxt}else if(o===ch){bg=C.noBg;br=C.noBdr;cl=C.noTxt}else cl=C.t4}
        return <HoverBtn key={o} onClick={()=>pick(o)} disabled={ch!==null} style={{width:"100%",padding:"15px 16px",background:bg,border:`1px solid ${br}`,borderRadius:6,color:cl,fontSize:15,textAlign:"left",cursor:ch===null?"pointer":"default",lineHeight:1.4,transition:"all .15s"}}>{o}</HoverBtn>
      })}
    </div>
    {ch!==null&&<A><div style={{padding:"12px 14px",borderLeft:`3px solid ${ch===q.a?C.ok:C.no}`,fontSize:13,lineHeight:1.6,color:C.t2,marginBottom:ch===q.a?16:8}}>{ch===q.a?"Correct. ":`The answer was ${q.a}. `}{q.fact}</div>
    {ch!==q.a&&<div style={{padding:"8px 14px",background:C.s2,borderRadius:4,marginBottom:16,fontSize:12,color:C.t2}}>
      <span style={{color:C.accent}}>→ </span>Find this in the <span style={{color:C.accent,fontWeight:600}}>{q.tab||"Learn"} tab</span>{q.section?` under "${q.section}"`:""}.
    </div>}
    </A>}
    {ch!==null&&<button className="tp" style={{width:"100%",padding:16,background:C.s2,border:`1px solid ${C.border}`,borderRadius:6,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:14,letterSpacing:2,textTransform:"uppercase",color:C.text,cursor:"pointer"}} onClick={next}>{idx+1<tot?"Next Question":"See Results"}</button>}
  </div>;
}

// ── RESULTS ─────────────────────────────────────────────────────────────────
function Res({score,total,actions}){
  const pct=Math.round(score/total*100);const tier=getTier(pct);
  return <div style={bd}>
    <div style={{textAlign:"center"}}>
      <A><div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:68,lineHeight:1,marginBottom:4}}>{score}<span style={{color:C.accent}}>/{total}</span></div>
      <div style={{fontSize:11,letterSpacing:3,textTransform:"uppercase",color:C.t2,marginBottom:20}}>{pct}% correct</div></A>
      <A d={200}><div className="at" style={{display:"inline-flex",alignItems:"center",gap:10,padding:"12px 24px",border:`2px solid ${tier.color}`,borderRadius:6,marginBottom:20}}>
        <span style={{fontSize:20,color:tier.color}}>{tier.icon}</span>
        <span style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:18,letterSpacing:3,textTransform:"uppercase",color:tier.color}}>{tier.label}</span>
      </div></A>
      <A d={350}><div style={{fontSize:14,color:C.t2,lineHeight:1.6,marginBottom:28,paddingBottom:28,borderBottom:`1px solid ${C.border}`}}>{tier.msg}</div></A>
    </div>
    <A d={450}><div style={{display:"flex",flexDirection:"column",gap:10}}>{actions}</div></A>
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

function GlossaryItem({term,def}){
  const [open,sO]=useState(false);
  return <div style={{background:C.s1,border:`1px solid ${C.border}`,borderRadius:open?6:0,marginBottom:open?4:0,overflow:"hidden"}}>
    <div className="tp" onClick={()=>sO(!open)} style={{padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
      <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:15,letterSpacing:1}}>{term}</div>
      <div style={{color:C.t4,fontSize:18,transition:"transform .2s",transform:open?"rotate(45deg)":"rotate(0deg)"}}>+</div>
    </div>
    {open&&<div style={{padding:"0 16px 14px",fontSize:13,color:C.t2,lineHeight:1.7,borderTop:`1px solid ${C.border}`}}><div style={{paddingTop:12}}>{def}</div></div>}
  </div>
}

// ── LEARN TAB ───────────────────────────────────────────────────────────────
function LearnSLabel({children}){
  return <div style={{marginBottom:12,textAlign:"left"}}>
    <div style={{fontSize:10,fontWeight:700,letterSpacing:2,color:"#fafafa"}}>{children}</div>
  </div>;
}
function LearnTab({bike:b}){
  const GT=C.goldTxt,GOLD=C.gold,GD=C.goldDim;
  return <div style={{...bd,...(b.id==="nb250"?{zoom:0.9}:{})}}>

    {/* Carousel */}
    <A><div style={{marginBottom:16}}>
      <BikeCarousel images={b.images} name={b.name}/>
    </div></A>

    {/* Hero — name / price / type */}
    <A d={60}><div style={{marginBottom:24}}>
      <div style={{fontSize:10,fontWeight:700,letterSpacing:2,color:C.t3,textTransform:"uppercase",marginBottom:6}}>{b.type}</div>
      <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:800,fontSize:34,letterSpacing:-0.5,textTransform:"uppercase",lineHeight:1,marginBottom:6}}>{b.name}</div>
      <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:22,fontWeight:700,color:GT}}>{b.price}</div>
    </div></A>

    {/* The Pitch — Type / Feel / Who */}
    <A d={120}><div style={{marginBottom:24}}>
      <LearnSLabel>THE PITCH</LearnSLabel>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {[["TYPE",b.anchors.type],["FEEL",b.anchors.feel],["WHO IT'S FOR",b.anchors.who]].map(([l,v])=>(
          <div key={l} style={{background:C.s1,border:`1px solid ${C.border}`,borderLeft:`3px solid ${GOLD}`,borderRadius:6,padding:"14px 16px"}}>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:GT,marginBottom:6}}>{l}</div>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:17,lineHeight:1.3,color:"#fafafa"}}>{v}</div>
          </div>
        ))}
      </div>
    </div></A>

    {/* By the Numbers — stats grid */}
    <A d={200}><div style={{marginBottom:24}}>
      <LearnSLabel>BY THE NUMBERS</LearnSLabel>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {b.stats.map(s=><div key={s.key} style={{background:C.s1,border:`1px solid ${C.border}`,borderRadius:6,padding:"14px 12px",textAlign:"center"}}>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:800,fontSize:28,lineHeight:1,color:GT,marginBottom:4}}>{s.val}</div>
          <div style={{fontSize:9,color:C.t3,letterSpacing:1.5,textTransform:"uppercase"}}>{s.key}</div>
        </div>)}
      </div>
    </div></A>

    {/* Key Facts */}
    <A d={280}><div style={{marginBottom:24}}>
      <LearnSLabel>KEY FACTS</LearnSLabel>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {b.facts.map((f,i)=><div key={i} style={{background:C.s1,border:`1px solid ${C.border}`,borderRadius:6,padding:"14px 16px",display:"flex",gap:14}}>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:800,fontSize:22,color:GD,lineHeight:1,flexShrink:0,width:28,paddingTop:2}}>0{i+1}</div>
          <div>
            <div style={{fontWeight:700,fontSize:14,marginBottom:4,color:"#fafafa"}}>{f.title}</div>
            <div style={{fontSize:13,color:C.t2,lineHeight:1.5}}>{f.desc}</div>
          </div>
        </div>)}
      </div>
    </div></A>

    {/* Sales Playbook */}
    {b.sellingPoints&&<A d={360}><div style={{height:1,background:C.border,margin:"0 0 20px"}}/>
      <LearnSLabel>SALES PLAYBOOK</LearnSLabel>
      {b.sellingPoints.map((sp,i)=><div key={i} style={{...crd,padding:"14px 16px",marginBottom:8}}>
        <div style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:GT,fontWeight:700,marginBottom:6}}>{sp.title}</div>
        <div style={{fontSize:13,color:C.t2,lineHeight:1.6}}>{sp.text}</div>
      </div>)}
    </A>}
  </div>;
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
        <div style={{position:"absolute",top:12,left:0,right:0,textAlign:"center",fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:11,letterSpacing:2,textTransform:"uppercase",color:flash==="ok"?"#22c55e":flash==="no"?"#ef4444":bikeCol,opacity:.8}}>{b.name}</div>
        <div style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",color:flash==="ok"?"#22c55e":flash==="no"?"#ef4444":flipped?bikeCol:C.t4,marginBottom:20,fontWeight:600}}>{flipped?"Answer":"Question"}</div>
        <div key={`${ri}-${flipped}`} className="af" style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:flipped?24:20,letterSpacing:.5,lineHeight:1.3,color:flipped?C.text:"#ccc"}}>
          {flipped?card.back:card.front}
        </div>
        {!flipped&&<div style={{fontSize:12,color:C.t4,marginTop:20}}>Tap to reveal</div>}
      </div>
    </div>
    {flipped?(
      <A><div style={{display:"flex",gap:10}}>
        <button className="tp" onClick={markStudy} style={{flex:1,padding:16,background:C.noBg,border:`1px solid ${C.noBdr}`,borderRadius:6,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,letterSpacing:1,textTransform:"uppercase",color:C.noTxt,cursor:"pointer"}}>Not Quite</button>
        <button className="tp" onClick={markOk} style={{flex:1,padding:16,background:C.okBg,border:`1px solid ${C.okBdr}`,borderRadius:6,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,letterSpacing:1,textTransform:"uppercase",color:C.okTxt,cursor:"pointer"}}>Got It</button>
      </div></A>
    ):(
      <div style={{display:"flex",gap:8}}>
        <button className="tp" style={{...btnG,flex:1,padding:14}} onClick={()=>{sF(false);sI(i=>(i-1+cards.length)%cards.length)}}>Prev</button>
        <button className="tp" style={{...btnG,flex:1,padding:14}} onClick={()=>{sF(false);sI(i=>(i+1)%cards.length)}}>Next</button>
      </div>
    )}
    {allDone&&<A d={200}><div style={{textAlign:"center",marginTop:20,padding:16,background:C.okBg,border:`1px solid ${C.okBdr}`,borderRadius:6}}>
      <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:16,color:C.okTxt,textTransform:"uppercase",letterSpacing:1}}>All cards done!</div>
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
      {[["easy","Easy","Key facts","#22c55e"],["medium","Medium","Specs & details","#f59e0b"],["hard","Hard","Deep numbers","#ef4444"]].map(([d,l,desc,col])=>(
        <div key={d} className="tp" style={{flex:1,padding:"13px 8px",border:`1px solid ${diff===d?col:C.border}`,background:diff===d?`${col}18`:C.s1,borderRadius:6,textAlign:"center",transition:"all .2s"}} onClick={()=>sD(d)}>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:14,letterSpacing:1,textTransform:"uppercase",marginBottom:3,color:col}}>{l}</div>
          <div style={{fontSize:11,color:C.t2}}>{desc}</div>
        </div>
      ))}
    </div></A>
    <A d={200}><button className="tp" style={btnA} onClick={start}>Start Quiz</button></A>
  </div>;

  if(phase==="results")return <Res score={sc} total={qs.length} actions={<>
    {pct===100&&nd&&<button className="tp" style={btnA} onClick={()=>{sD(nd);sP("start")}}>Level Up to {nd[0].toUpperCase()+nd.slice(1)}</button>}
    {pct===100&&!nd&&nxt&&<button className="tp" style={btnA} onClick={()=>onNext(nxt)}>Next Bike: {nxt.name}</button>}
    <button className="tp" style={pct<100?btnA:btnG} onClick={()=>sP("start")}>Try {diff} Again</button>
    <button className="tp" style={btnG} onClick={onLearn}>Review Learn Tab</button>
  </>}/>;

  return <QE questions={qs} badge={()=>diff} onFinish={fin}/>;
}

// ── BIKE SCREEN ─────────────────────────────────────────────────────────────
function BikeScreen({bike:b,onBack,onUp,onChange}){
  const [tab,sT]=useState("learn");
  const tabs=["learn","specs","quiz","cards"];
  const labels={learn:"Learn",specs:"Specs",quiz:"Quiz",cards:"Cards"};
  return <div style={{paddingBottom:0}}>
    <Hdr title={b.name} onBack={onBack}/>
    <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,background:C.bg}}>
      {tabs.map(t=><button key={t} style={{flex:1,padding:"13px 8px",fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:11,letterSpacing:2,textTransform:"uppercase",color:tab===t?C.text:C.t2,border:"none",background:"none",cursor:"pointer",borderBottom:tab===t?`2px solid ${C.accent}`:"2px solid transparent",marginBottom:-1}} onClick={()=>sT(t)}>{labels[t]}</button>)}
    </div>
    {tab==="learn"&&<LearnTab bike={b}/>}
    {tab==="specs"&&<SpecsTab bike={b}/>}
    {tab==="cards"&&<FlashTab bike={b}/>}
    {tab==="quiz"&&<QuizTab bike={b} onLearn={()=>sT("learn")} onUp={onUp} onNext={onChange}/>}
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
  return <div>
    <Hdr title="All Models Quiz" onBack={onBack}/>
    {sc!==null
      ?<Res score={sc} total={qs.length} actions={<button className="tp" style={btnG} onClick={onBack}>Back</button>}/>
      :<QE questions={qs} badge={q=>`${q.bike} · ${q.difficulty}`} onFinish={fin}/>
    }
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

  if(phase==="results")return <div><Hdr title="Scenarios" onBack={onBack}/><Res score={sc} total={scs.length} actions={<button className="tp" style={btnG} onClick={onBack}>Back</button>}/></div>;

  const s=scs[idx];const tot=scs.length;const pct=((idx+(ch!==null?1:0))/tot)*100;
  const cb=BIKES.find(b=>b.id===s.answer);

  return <div>
    <Hdr title="Customer Scenarios" onBack={onBack}/>
    <div style={bd}>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.t2,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>
        <span>Scenario {idx+1} of {tot}</span><span style={{color:C.accent}}>{sc} correct</span>
      </div>
      <div style={{height:3,background:C.border,borderRadius:3,marginBottom:28,overflow:"hidden"}}>
        <div style={{height:"100%",background:C.accent,borderRadius:3,width:pct+"%",transition:"width .5s ease"}}/>
      </div>
      <div style={{display:"inline-block",fontSize:10,letterSpacing:2,textTransform:"uppercase",color:C.t3,border:`1px solid ${C.border}`,padding:"4px 10px",borderRadius:3,marginBottom:14}}>{s.difficulty}</div>
      <A t="as" key={idx}><div style={{...crd,padding:"18px 20px",marginBottom:24}}>
        <div style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",color:C.accent,fontWeight:600,marginBottom:10}}>Customer Walks In</div>
        <div style={{fontSize:15,lineHeight:1.6,color:"#ddd"}}>{s.situation}</div>
      </div></A>
      <div style={{fontSize:12,color:C.t2,letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>Which bike?</div>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}} className={an}>
        {s.opts.map(id=>{
          const bk=BIKES.find(b=>b.id===id);
          let bg=C.s1,br=C.border,cl=C.text;
          if(ch!==null){if(id===s.answer){bg=C.okBg;br=C.okBdr;cl=C.okTxt}else if(id===ch){bg=C.noBg;br=C.noBdr;cl=C.noTxt}else cl=C.t4}
          return <HoverBtn key={id} onClick={()=>pick(id)} disabled={ch!==null} style={{width:"100%",padding:"15px 16px",background:bg,border:`1px solid ${br}`,borderRadius:6,color:cl,fontSize:15,textAlign:"left",cursor:ch===null?"pointer":"default",lineHeight:1.4}}>
            <span style={{fontWeight:600}}>{bk.name}</span><span style={{color:C.t2,marginLeft:8,fontSize:13}}>{bk.type}</span>
          </HoverBtn>
        })}
      </div>
      {ch!==null&&<A>
        <div style={{padding:"12px 14px",borderLeft:`3px solid ${ch===s.answer?C.ok:C.no}`,fontSize:13,lineHeight:1.6,color:C.t2,marginBottom:16}}>
          {ch===s.answer?`Correct - ${cb.name}. `:`The answer was ${cb.name}. `}{s.reasoning}
        </div>
        <div style={{...crd,padding:"14px 16px",marginBottom:16}}>
          <div style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",color:C.accent,fontWeight:600,marginBottom:10}}>{cb.name}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:C.border,borderRadius:4,overflow:"hidden"}}>
            {cb.stats.map(st=><div key={st.key} style={{background:C.bg,padding:"10px 12px",textAlign:"center"}}>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:18,lineHeight:1,marginBottom:2}}>{st.val}</div>
              <div style={{fontSize:10,color:C.t4,letterSpacing:1,textTransform:"uppercase"}}>{st.key}</div>
            </div>)}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:10,fontSize:12}}>
            <span style={{color:C.t3}}>{cb.type}</span>
            <span style={{color:"#4ade80",fontWeight:600}}>{cb.price}</span>
          </div>
        </div>
      </A>}
      {ch!==null&&<button className="tp" style={{width:"100%",padding:16,background:C.s2,border:`1px solid ${C.border}`,borderRadius:6,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:14,letterSpacing:2,textTransform:"uppercase",color:C.text,cursor:"pointer"}} onClick={next}>{idx+1<tot?"Next Scenario":"See Results"}</button>}
    </div>
  </div>;
}


// ── GLOSSARY TAB ────────────────────────────────────────────────────────────
function GlossaryTab(){
  const [open,sO]=useState(null);
  return <div style={{paddingBottom:80}}>
    <div style={{padding:"40px 20px 24px",borderBottom:`1px solid ${C.border}`}}>
      <A><div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:32,letterSpacing:1,lineHeight:1.1,marginBottom:8}}>GLOSSARY</div></A>
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
                  <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:16,letterSpacing:1}}>{t.term}</div>
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
  const {p,up,rst}=useProg();

  function openBike(b){sB(b);sS("bike");window.scrollTo(0,0)}
  function navTo(dest){
    if(dest==="glossary"){sS("glossary");return;}
    sT(dest);
  }
  function bqFin(id,d,sc,tot){up(pr=>{if(!pr.bikeQuiz[id])pr.bikeQuiz[id]={};const pv=pr.bikeQuiz[id][d];pr.bikeQuiz[id][d]={best:pv?Math.max(pv.best,sc):sc,total:tot,attempts:pv?pv.attempts+1:1};return pr})}
  function gqFin(sc,tot){up(pr=>{pr.generalQuiz={best:Math.max(pr.generalQuiz.best,sc),total:tot,attempts:pr.generalQuiz.attempts+1};return pr})}
  function scFin(sc,tot){up(pr=>{pr.scenarios={completed:pr.scenarios.completed+tot,correct:pr.scenarios.correct+sc,attempts:pr.scenarios.attempts+1};return pr})}

  return <div style={{background:C.bg,minHeight:"100vh",color:C.text,fontFamily:"'Outfit',sans-serif",fontSize:15}}>
    <style>{CSS}</style>
{screen==="main"&&<>
      {tab==="home"&&<HomeTab progress={p} onBike={openBike} onNav={navTo}/>}
      {tab==="range"&&<RangeTab onBike={openBike} progress={p}/>}
      {tab==="train"&&<TrainTab onQuiz={()=>sS("gquiz")} onScenarios={()=>sS("scenarios")} onGlossary={()=>sS("glossary")}/>}
      {tab==="compare"&&<CompareTab/>}
      {tab==="progress"&&<ProgressTab progress={p} onReset={rst}/>}
      <TabBar active={tab} onChange={sT}/>
    </>}
    {screen==="bike"&&bike&&<BikeScreen bike={bike} onBack={()=>sS("main")} onUp={bqFin} onChange={b=>{sB(b)}}/>}
    {screen==="gquiz"&&<GQScreen onBack={()=>sS("main")} onFin={gqFin}/>}
    {screen==="scenarios"&&<ScScreen onBack={()=>sS("main")} onFin={scFin}/>}
    {screen==="glossary"&&<div>
      <Hdr title="Glossary" onBack={()=>sS("main")}/>
      <div style={{padding:"24px 20px 80px"}}>
        {GLOSSARY.map((cat,ci)=>(
          <A key={cat.category} d={ci*60}>
            <div style={{...sec,marginBottom:12,marginTop:ci>0?28:0}}>{cat.category}</div>
            <div style={{display:"flex",flexDirection:"column",gap:1}}>
              {cat.terms.map(t=><GlossaryItem key={t.term} term={t.term} def={t.def}/>)}
            </div>
          </A>
        ))}
      </div>
    </div>}
  </div>;
}

export default App;
