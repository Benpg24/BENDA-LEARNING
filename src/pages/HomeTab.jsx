import { useState, useRef, useCallback } from 'react';
import { BIKES, bm } from '../data/bikes.js';
import { C } from '../shared.jsx';

function SpeedoDial({value,gold,goldTxt,sz=110}){
  const size=sz,stroke=6,r=(size-stroke)/2,c=Math.PI*r,off=c-(value/100)*c;
  return <div style={{width:size,height:size/2+14,position:"relative",flexShrink:0}}>
    <svg width={size} height={size} style={{position:"absolute",top:0,left:0}}>
      <path d={`M ${stroke/2} ${size/2} A ${r} ${r} 0 0 1 ${size-stroke/2} ${size/2}`} fill="none" stroke="#262626" strokeWidth={stroke} strokeLinecap="round"/>
      <path d={`M ${stroke/2} ${size/2} A ${r} ${r} 0 0 1 ${size-stroke/2} ${size/2}`} fill="none" stroke={gold} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off}/>
      {[0,25,50,75,100].map(t=>{const ang=Math.PI+(t/100)*Math.PI;const x1=size/2+Math.cos(ang)*(r-8),y1=size/2+Math.sin(ang)*(r-8),x2=size/2+Math.cos(ang)*(r-14),y2=size/2+Math.sin(ang)*(r-14);return <line key={t} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#52525b" strokeWidth="1"/>;})}
    </svg>
    <div style={{position:"absolute",left:0,right:0,top:14,textAlign:"center"}}>
      <div style={{fontSize:28,fontWeight:800,color:goldTxt,letterSpacing:-1,fontFamily:"Georgia,serif",lineHeight:1}}>{value}<span style={{fontSize:14}}>%</span></div>
      <div style={{fontSize:8,fontWeight:700,letterSpacing:0.3,color:"#71717a",marginTop:4}}>PROGRESS</div>
    </div>
  </div>;
}

function HomeSLabel({children}){
  return <div style={{textAlign:"left"}}>
    <div style={{fontSize:10,fontWeight:700,letterSpacing:0.5,color:"#fafafa"}}>{children}</div>
  </div>;
}

const FACTS=[
  {bike:"LFC 700",fact:"The LFC 700 is the world's first inline-4 cruiser. Four cylinders in a straight line — a configuration found in sportsbikes — in a full cruiser body."},
  {bike:"LFC 700",fact:"The LFC 700 uses Brembo brakes — the same brand used on MotoGP factory race machines."},
  {bike:"LFC 700",fact:"The LFC 700's 310mm rear tyre is the widest fitted to any production motorcycle in the world."},
  {bike:"LFC 700",fact:"KYB suspension on the LFC 700 is the same brand used on premium Japanese superbikes costing twice the price."},
  {bike:"Dark Flag 500",fact:"The Dark Flag 500 Commander has a V4 engine under 500cc — almost unheard of at this price point. Most rivals use a V-twin."},
  {bike:"Dark Flag 500",fact:"The Dark Flag 500 Commander is the only bike in the Benda range with cruise control — standard, not optional."},
  {bike:"Dark Flag 500",fact:"The Dark Flag's electronic air suspension auto-adjusts to road conditions. That feature normally only appears on bikes costing $25,000+."},
  {bike:"Dark Flag 500",fact:"The Dark Flag Commander has an adjustable seat — 670mm to 700mm — making it the most accessible bike in the range for shorter riders."},
  {bike:"Chinchilla 500",fact:"The Chinchilla 500 has USD (upside-down) forks — sportsbike suspension technology on a cruiser under $10k."},
  {bike:"Chinchilla 500",fact:"The Chinchilla 500 and Napoleonbob 500 share an identical 475cc V-twin engine. Same heart, completely different character."},
  {bike:"Napoleonbob 250",fact:"The Napoleonbob 250's multi-link front fork is unique in its class — it reduces front-end dive under braking in a way standard forks can't."},
  {bike:"Napoleonbob 250",fact:"The Napoleonbob 250 sips just 3.1L/100km — the most fuel-efficient bike in the range, giving roughly 300km from a single tank."},
  {bike:"Benda Range",fact:"4 out of 5 Benda bikes are LAMS approved. The only exception is the LFC 700 — a full-licence flagship."},
  {bike:"Benda Range",fact:"Every single Benda model comes with ABS and Traction Control as standard. No exceptions, no upgrades required."},
  {bike:"Napoleonbob 500",fact:"The Napoleonbob 500 sits 53mm lower than the 250 despite having nearly double the engine displacement."},
];

function DidYouKnow({gold,goldTxt}){
  const f=FACTS[Math.floor(Date.now()/86400000)%FACTS.length];
  return <div style={{margin:"0 16px 24px",borderRadius:16,background:"#0a0a0a",border:`1px solid #2a2a2a`,overflow:"hidden"}}>
    <div style={{background:`linear-gradient(90deg,rgba(212,162,74,0.12),transparent)`,borderBottom:"1px solid #1a1a1a",padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <div style={{fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:9,letterSpacing:1.5,color:goldTxt,textTransform:"uppercase"}}>Did You Know?</div>
      </div>
      <div style={{fontFamily:"'Inter',sans-serif",fontSize:9,fontWeight:600,color:"#444",letterSpacing:0.3}}>{f.bike}</div>
    </div>
    <div style={{padding:"14px 16px 16px"}}>
      <div style={{fontSize:13,color:"#d4d4d4",lineHeight:1.65}}>{f.fact}</div>
    </div>
  </div>;
}

export default function HomeTab({progress:pr,onBike,onNav,name,onSignOut}){
  const GOLD=C.gold,GT=C.goldTxt,GD=C.goldDim;
  const trainingImg={nb250:"/images/napbobpotential.png",nb500:"/images/NAP BOB Homepage.png",ch500:"/images/Chinchilla homepage.png",df500:"/images/Dark Flag Homepage.png",lfc700:"/images/LFC homepage.png"};
  const garageRef=useRef(null);
  const [activeGarageId,setActiveGarageId]=useState(null);
  const onGarageScroll=useCallback(()=>{
    const el=garageRef.current;if(!el)return;
    const atStart=el.scrollLeft<=0;
    const atEnd=el.scrollLeft>=el.scrollWidth-el.clientWidth-1;
    if(atStart){setActiveGarageId(BIKES[0]?.id);return;}
    if(atEnd){setActiveGarageId(BIKES[BIKES.length-1]?.id);return;}
    const center=el.scrollLeft+el.clientWidth/2;
    const cards=[...el.children];
    let closest=null,minDist=Infinity;
    cards.forEach((c,i)=>{const mid=c.offsetLeft+c.offsetWidth/2;const d=Math.abs(mid-center);if(d<minDist){minDist=d;closest=BIKES[i]?.id;}});
    if(closest)setActiveGarageId(closest);
  },[]);
  const featured=[...BIKES].sort((a,b)=>{
    const pa=bm(pr,a.id),pb=bm(pr,b.id);
    if(pa===100&&pb!==100)return 1;if(pb===100&&pa!==100)return -1;
    return (pb>0?pb:0)-(pa>0?pa:0);
  })[0]||BIKES[0];
  const featPct=bm(pr,featured.id);
  const h=new Date().getHours();
  const greet=h<12?"GOOD MORNING":h<18?"GOOD AFTERNOON":"GOOD EVENING";
  const DAYS=["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];
  const dayName=DAYS[new Date().getDay()];
  const bq=pr.bikeQuiz[featured.id]||{};
  const nextDiff=!bq.easy||!bq.easy.attempts?"Easy":!bq.medium||!bq.medium.attempts?"Medium":!bq.hard||!bq.hard.attempts?"Hard":"Easy";

  return <div style={{background:"#000",minHeight:"100vh",color:"#fafafa",paddingBottom:90,fontFamily:"'Geist',sans-serif",WebkitFontSmoothing:"antialiased",zoom:0.9}}>
    {/* ── HEADER ── */}
    <div style={{padding:"16px 20px 10px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <img src="/images/BENDAlogo.png" alt="Benda" style={{height:55,width:"auto",objectFit:"contain",filter:"brightness(0) invert(1)"}}/>
      </div>
      <button onClick={onSignOut} style={{background:"none",border:"1px solid #2a2a2a",borderRadius:6,color:"#555",fontSize:9,fontFamily:"'Inter',sans-serif",fontWeight:700,letterSpacing:0.5,padding:"5px 9px",cursor:"pointer",textTransform:"uppercase"}}>Sign out</button>
    </div>

    {/* ── WELCOME ── */}
    <div style={{padding:"6px 20px 8px",textAlign:"left"}}>
      <div style={{fontSize:10,fontWeight:700,letterSpacing:0.5,color:C.t3,marginBottom:3}}>{dayName} · {greet}</div>
      <div style={{fontFamily:"'Geist',sans-serif",fontWeight:800,fontSize:30,lineHeight:1.05,letterSpacing:-0.5}}>Welcome back, {name||'there'}</div>
      <p style={{fontSize:13,color:C.t2,margin:"3px 0 0",lineHeight:1.4}}>Pick up where you left off and sharpen your product knowledge.</p>
    </div>

    {/* ── CONTINUE TRAINING ── */}
    <div style={{margin:"0 16px 10px",padding:16,borderRadius:16,background:C.s1,border:`1px solid #2a2a2a`,position:"relative",overflow:"hidden"}}>
      <img src={trainingImg[featured.id]||"/images/Napbob250trainingapp2 (1600 x 900 px)-2.png"} alt={featured.name} style={{position:"absolute",right:"-10px",top:"-30px",height:"105%",width:"auto",maxWidth:"75%",objectFit:"contain",opacity:0.95,filter:"brightness(1.2)",pointerEvents:"none",WebkitMaskImage:"radial-gradient(ellipse 85% 85% at 65% 50%, black 25%, transparent 80%)",maskImage:"radial-gradient(ellipse 85% 85% at 65% 50%, black 25%, transparent 80%)"}}/>
      <div style={{position:"relative",zIndex:1,display:"flex",alignItems:"flex-end",gap:14}}>
        <div style={{flex:1}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:1.6,color:C.t3}}>CONTINUE TRAINING</div>
          <div style={{fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:19,marginTop:5,letterSpacing:-0.3,textTransform:"uppercase"}}>{featured.name}</div>
          <div style={{display:"flex",alignItems:"center",gap:5,marginTop:6}}>
            {[["easy","Easy"],["medium","Med"],["hard","Hard"]].map(([d,label],i,arr)=>{
              const attempted=bq[d]&&bq[d].attempts>0;
              const perfect=attempted&&bq[d].best===bq[d].total;
              const isNext=nextDiff.toLowerCase()===d;
              const col=perfect?"#22c55e":attempted?"#f59e0b":isNext?GT:"#444";
              const txt=perfect?`✓ ${label}`:attempted?`${bq[d].best}/${bq[d].total} ${label}`:label;
              return <div key={d} style={{display:"flex",alignItems:"center",gap:5}}>
                <div style={{fontSize:9,fontWeight:700,color:col,letterSpacing:0.3}}>{txt}</div>
                {i<arr.length-1&&<div style={{fontSize:9,color:"#333"}}>›</div>}
              </div>;
            })}
          </div>
          <div style={{display:"flex",justifyContent:"flex-start",marginTop:6}}><SpeedoDial value={featPct} gold={GOLD} goldTxt={GT} sz={100}/></div>
        </div>
        <div style={{flex:1,paddingBottom:4,paddingRight:8}}>
          <button className="tp" onClick={()=>onBike(featured,'quiz')} style={{
            marginTop:8,display:"flex",alignItems:"center",justifyContent:"center",gap:6,
            width:"100%",padding:"8px 12px",
            background:`linear-gradient(180deg,#f4d27a 0%,${GOLD} 45%,#b8841f 100%)`,
            color:"#1a1206",border:"none",borderRadius:8,
            boxShadow:"inset 0 1px 0 rgba(255,255,255,0.45),inset 0 -1px 0 rgba(0,0,0,0.25),0 2px 8px rgba(0,0,0,0.4)",
            fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:12,letterSpacing:0.3,cursor:"pointer",
          }}>
            RESUME ›
          </button>
        </div>
      </div>
    </div>

    {/* ── YOUR GARAGE ── */}
    <div style={{marginBottom:10}}>
      <div style={{padding:"0 16px",display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:6}}>
        <HomeSLabel>YOUR GARAGE</HomeSLabel>
        <div style={{fontSize:9,fontWeight:600,color:C.t4}}>{BIKES.length} models</div>
      </div>
      <div ref={garageRef} onScroll={onGarageScroll} style={{display:"flex",gap:10,overflowX:"auto",padding:"2px 16px 6px",scrollbarWidth:"none",WebkitOverflowScrolling:"touch",scrollBehavior:"smooth",overscrollBehaviorX:"none"}}>
        {BIKES.map((b,i)=>{
          const pct=bm(pr,b.id);
          const isActive=(activeGarageId||featured.id)===b.id;
          const [namePart,numPart]=(b.name.match(/^(.*?)(\d.*)$/)||[,'',b.name]).slice(1);
          return <div key={b.id} onClick={()=>onBike(b)} style={{flexShrink:0,width:148,padding:12,borderRadius:14,background:C.s1,border:`1px solid ${isActive?GD:"#2a2a2a"}`,cursor:"pointer",position:"relative",overflow:"hidden",boxShadow:isActive?`0 0 18px rgba(212,162,74,0.22)`:"none",transition:"border-color .35s ease, box-shadow .35s ease"}}>
            <div style={{position:"absolute",inset:0,background:`linear-gradient(160deg,#1a1207,${C.s1} 60%)`,opacity:isActive?1:0,transition:"opacity .35s ease",pointerEvents:"none"}}/>
            <div style={{position:"relative"}}>
              <div style={{height:110,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <img src={{nb250:"/images/NapBOBnew.png",nb500:"/images/Napbob500N.png",ch500:"/images/ChinchillaN.png",df500:"/images/DarkflagN.png",lfc700:"/images/LFCN.png"}[b.id]||b.icon} alt="" style={{width:"140%",height:"100%",objectFit:"contain",WebkitMaskImage:"linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)",maskImage:"linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)"}}/>
              </div>
              <div style={{fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:14,color:"#fafafa",marginTop:6,lineHeight:1.2}}>{namePart.trim()}</div>
              <div style={{fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:11,color:C.t2,lineHeight:1.2}}>{numPart.trim()}</div>
              <div style={{marginTop:8,display:"flex",alignItems:"center",gap:5}}>
                <div style={{flex:1,height:2,background:"#262626",borderRadius:2}}>
                  <div style={{width:`${pct}%`,height:"100%",background:GOLD,borderRadius:2,transition:"width 1s ease"}}/>
                </div>
                <div style={{fontSize:9,fontWeight:700,color:GT}}>{pct}%</div>
              </div>
            </div>
          </div>;
        })}
      </div>
    </div>

    {/* ── DID YOU KNOW ── */}
    <DidYouKnow gold={C.gold} goldTxt={C.goldTxt}/>

  </div>;
}
