import { useState, useRef, useCallback } from 'react';
import { BIKES, bm, om } from '../data/bikes.js';
import { C, Ring } from '../shared.jsx';

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
      <div style={{fontSize:8,fontWeight:700,letterSpacing:1.5,color:"#71717a",marginTop:4}}>PROGRESS</div>
    </div>
  </div>;
}

function HomeSLabel({children}){
  return <div style={{display:"flex",alignItems:"center",gap:8}}>
    <div style={{width:14,height:1,background:C.gold}}/>
    <div style={{fontSize:10,fontWeight:700,letterSpacing:2,color:"#fafafa"}}>{children}</div>
  </div>;
}

export default function HomeTab({progress:pr,onBike,onNav}){
  const GOLD=C.gold,GT=C.goldTxt,GD=C.goldDim;
  const trainingImg={nb500:"/images/nb500-training.png",ch500:"/images/ch500-training.png",df500:"/images/df500-training.png",lfc700:"/images/lfc700-training.png"};
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
  const overall=om(pr);
  const h=new Date().getHours();
  const greet=h<12?"GOOD MORNING":h<18?"GOOD AFTERNOON":"GOOD EVENING";
  const DAYS=["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];
  const dayName=DAYS[new Date().getDay()];
  const quizCount=Object.values(pr.bikeQuiz).reduce((s,bq)=>s+Object.values(bq).reduce((ss,d)=>ss+(d?.attempts||0),0),0)+pr.generalQuiz.attempts;
  const bq=pr.bikeQuiz[featured.id]||{};
  const nextDiff=!bq.easy||!bq.easy.attempts?"Easy":!bq.medium||!bq.medium.attempts?"Medium":!bq.hard||!bq.hard.attempts?"Hard":"Easy";

  return <div style={{background:"#000",minHeight:"100vh",color:"#fafafa",paddingBottom:90,fontFamily:"'Outfit',sans-serif",WebkitFontSmoothing:"antialiased",zoom:0.9}}>
    {/* ── HEADER ── */}
    <div style={{padding:"44px 20px 0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <img src="/images/BENDAlogo.png" alt="Benda" style={{height:55,width:"auto",objectFit:"contain",filter:"brightness(0) invert(1)"}}/>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <svg width="11" height="14" viewBox="0 0 11 14" fill="none"><path d="M5.5 0C5.5 0 9.5 3.5 9.5 7.5C9.5 9.985 7.709 12 5.5 12C3.291 12 1.5 9.985 1.5 7.5C1.5 6 2.5 5 2.5 5C2.5 5 3 7 4.5 7C4.5 5 3.5 3 5.5 0Z" fill={GT}/></svg>
          <div style={{fontSize:9,fontWeight:700,letterSpacing:1.5,color:GT,lineHeight:1.3}}>
            <div>7 DAY</div>
            <div>STREAK</div>
          </div>
        </div>
        <div style={{width:28,height:28,borderRadius:"50%",background:C.goldBg,border:`1px solid ${GD}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={GT} strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        </div>
      </div>
    </div>

    {/* ── WELCOME ── */}
    <div style={{padding:"6px 20px 8px",textAlign:"left"}}>
      <div style={{fontSize:10,fontWeight:700,letterSpacing:2,color:C.t3,marginBottom:3}}>{dayName} · {greet}</div>
      <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:30,lineHeight:1.05,letterSpacing:-0.5}}>Welcome back, Ben</div>
      <p style={{fontSize:13,color:C.t2,margin:"3px 0 0",lineHeight:1.4}}>Pick up where you left off and sharpen your product knowledge.</p>
    </div>

    {/* ── CONTINUE TRAINING ── */}
    <div style={{margin:"0 16px 10px",padding:16,borderRadius:16,background:C.s1,border:`1px solid #2a2a2a`,position:"relative",overflow:"hidden"}}>
      <img src={trainingImg[featured.id]||"/images/Napbob250trainingapp2 (1600 x 900 px)-2.png"} alt={featured.name} style={{position:"absolute",right:"3px",top:"40%",transform:"translateY(-50%)",height:"88%",width:"auto",maxWidth:"55%",objectFit:"contain",opacity:0.7,pointerEvents:"none",WebkitMaskImage:"linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)",maskImage:"linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)"}}/>
      <div style={{position:"relative",zIndex:1,display:"flex",alignItems:"flex-start"}}>
        <div style={{minWidth:0}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:1.6,color:C.t3}}>CONTINUE TRAINING</div>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:800,fontSize:19,marginTop:5,letterSpacing:-0.3,textTransform:"uppercase"}}>{featured.name}</div>
          <div style={{fontSize:12,color:C.t2,marginTop:2}}>{nextDiff} quiz next</div>
        </div>
      </div>
      <div style={{position:"relative",zIndex:1,marginTop:4,display:"flex",alignItems:"flex-end",gap:14}}>
        <div style={{flex:1,display:"flex",justifyContent:"center",alignItems:"flex-end"}}><SpeedoDial value={featPct} gold={GOLD} goldTxt={GT} sz={100}/></div>
        <div style={{flex:1,paddingBottom:4,paddingRight:8}}>
          <button className="tp" onClick={()=>onBike(featured)} style={{
            marginTop:8,display:"flex",alignItems:"center",justifyContent:"center",gap:6,
            width:"100%",padding:"8px 12px",
            background:`linear-gradient(180deg,#f4d27a 0%,${GOLD} 45%,#b8841f 100%)`,
            color:"#1a1206",border:"none",borderRadius:8,
            boxShadow:"inset 0 1px 0 rgba(255,255,255,0.45),inset 0 -1px 0 rgba(0,0,0,0.25),0 2px 8px rgba(0,0,0,0.4)",
            fontFamily:"'Rajdhani',sans-serif",fontWeight:800,fontSize:12,letterSpacing:1.2,cursor:"pointer",
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
      <div ref={garageRef} onScroll={onGarageScroll} style={{display:"flex",gap:10,overflowX:"auto",padding:"2px 16px 6px",scrollbarWidth:"none",WebkitOverflowScrolling:"touch",scrollBehavior:"smooth",overscrollBehaviorX:"none",}}>
        {BIKES.map((b,i)=>{
          const pct=bm(pr,b.id);
          const isActive=(activeGarageId||featured.id)===b.id;
          return <div key={b.id} onClick={()=>onBike(b)} style={{flexShrink:0,width:130,padding:12,borderRadius:14,background:C.s1,border:`1px solid ${isActive?GD:"#2a2a2a"}`,cursor:"pointer",position:"relative",overflow:"hidden",boxShadow:isActive?`0 0 18px rgba(212,162,74,0.22)`:"none",transition:"border-color .35s ease, box-shadow .35s ease",}}>
            <div style={{position:"absolute",inset:0,background:`linear-gradient(160deg,#1a1207,${C.s1} 60%)`,opacity:isActive?1:0,transition:"opacity .35s ease",pointerEvents:"none"}}/>
            <div style={{position:"relative"}}>
              <div style={{height:52,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <img src={{nb250:"/images/nb250-garage.png",nb500:"/images/nb500-training.png",ch500:"/images/ch500-training.png",df500:"/images/df500-training.png",lfc700:"/images/lfc700-training.png"}[b.id]||b.icon} alt="" style={{width:"115%",height:"100%",objectFit:"contain",WebkitMaskImage:"linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)",maskImage:"linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)"}}/>
              </div>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,color:"#fafafa",marginTop:6,lineHeight:1.2}}>{b.name}</div>
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


    {/* ── TRAINING SNAPSHOT ── */}
    <div style={{padding:"0 16px",marginBottom:22}}>
      <HomeSLabel>TRAINING SNAPSHOT</HomeSLabel>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginTop:10}}>
        <div style={{aspectRatio:"1/1.15",borderRadius:12,background:C.s1,border:`1px solid #2a2a2a`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:8,textAlign:"center"}}>
          <Ring pct={overall} sz={48} sw={4} c={GOLD}/>
          <div style={{fontSize:9,fontWeight:700,letterSpacing:0.8,color:C.t2,marginTop:6,textTransform:"uppercase"}}>Overall</div>
          <div style={{fontSize:9,color:GT,marginTop:2}}>Keep it up!</div>
        </div>
        <div style={{aspectRatio:"1/1.15",borderRadius:12,background:C.s1,border:`1px solid #2a2a2a`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:8,textAlign:"center"}}>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:30,fontWeight:800,color:"#fafafa",lineHeight:1}}>{quizCount}</div>
          <div style={{fontSize:9,fontWeight:700,letterSpacing:0.8,color:C.t2,marginTop:6,textTransform:"uppercase"}}>Quizzes</div>
          <div style={{fontSize:9,color:GT,marginTop:2}}>All models</div>
        </div>
        <div style={{aspectRatio:"1/1.15",borderRadius:12,background:C.s1,border:`1px solid #2a2a2a`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:8,textAlign:"center"}}>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:30,fontWeight:800,color:"#fafafa",lineHeight:1}}>{pr.scenarios.completed||0}</div>
          <div style={{fontSize:9,fontWeight:700,letterSpacing:0.8,color:C.t2,marginTop:6,textTransform:"uppercase"}}>Scenarios</div>
          <div style={{fontSize:9,color:GT,marginTop:2}}>Completed</div>
        </div>
      </div>
    </div>

    {/* ── RECENT WINS ── */}
    {(quizCount>0||pr.scenarios.completed>0)&&<div style={{padding:"0 16px",marginBottom:22}}>
      <HomeSLabel>RECENT WINS</HomeSLabel>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:10}}>
        <div style={{padding:12,borderRadius:12,background:C.s1,border:`1px solid #2a2a2a`,display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:40,height:40,borderRadius:"50%",border:`1.5px solid ${GOLD}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <span style={{fontSize:16,fontWeight:800,color:GT,fontFamily:"Georgia,serif"}}>7</span>
          </div>
          <div style={{minWidth:0}}>
            <div style={{fontSize:12,fontWeight:700,color:"#fafafa",fontFamily:"'Rajdhani',sans-serif"}}>Day Streak</div>
            <div style={{fontSize:10,color:C.t3,marginTop:1}}>You're on fire</div>
          </div>
        </div>
        <div style={{padding:12,borderRadius:12,background:C.s1,border:`1px solid #2a2a2a`,display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:40,height:40,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="36" height="36" viewBox="0 0 40 40" fill="none"><path d="M20 6 8 11v9c0 7 5 12 12 14 7-2 12-7 12-14v-9z" stroke={GOLD} strokeWidth="1.4"/><path d="m20 14 1.5 3 3.3.5-2.4 2.3.6 3.3-3-1.6-3 1.6.6-3.3-2.4-2.3 3.3-.5z" fill={GOLD}/></svg>
          </div>
          <div style={{minWidth:0}}>
            <div style={{fontSize:12,fontWeight:700,color:"#fafafa",fontFamily:"'Rajdhani',sans-serif"}}>Training</div>
            <div style={{fontSize:10,color:C.t3,marginTop:1}}>{quizCount} quiz{quizCount!==1?"zes":""} done</div>
          </div>
        </div>
      </div>
    </div>}
  </div>;
}
