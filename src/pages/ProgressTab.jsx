import { useState } from 'react';
import { BIKES, om } from '../data/bikes.js';
import { C, Ring } from '../shared.jsx';

const ICON={nb250:"/images/NapBOBnew.png",nb500:"/images/Napbob500N.png",ch500:"/images/ChinchillaN.png",df500:"/images/DarkflagN.png",lfc700:"/images/LFCN.png"};
const GOLD=C.gold,GT=C.goldTxt,BORDER='#2a2a2a',CARD='#0a0a0a';
const T1='#fafafa',T2='#b8b8b8',T3='#666';

function isCert(bq){return['easy','medium','hard'].every(d=>bq[d]&&bq[d].best===bq[d].total&&bq[d].total>0)}
function isInProg(bq){return['easy','medium','hard'].some(d=>bq[d]&&bq[d].attempts>0)}

function ShieldIcon({size=48,check=false,col}){
  const s=size,h=Math.round(s*1.12);
  const stroke=col||(check?GOLD:GOLD);
  const fill=col?`rgba(34,197,94,0.15)`:`rgba(212,162,74,0.15)`;
  return <svg width={s} height={h} viewBox="0 0 48 54" fill="none">
    <path d="M24 2L4 10v16c0 14 9 24 20 28 11-4 20-14 20-28V10L24 2z" fill={fill} stroke={stroke} strokeWidth="1.5"/>
    {check&&<path d="M16 27l6 6 10-10" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>}
    {!check&&<path d="M20 18v8M20 29v2" stroke={stroke} strokeWidth="2" strokeLinecap="round"/>}
  </svg>;
}

export default function ProgressTab({progress:pr,onReset,onSignOut,isManager,onTeam}){
  const [confirm,setConfirm]=useState(false);
  const ov=om(pr);
  const certCount=BIKES.filter(b=>isCert(pr.bikeQuiz[b.id]||{})).length;
  const needCount=BIKES.length-certCount;

  return <div style={{background:'#000',color:T1,fontFamily:"'Geist',sans-serif",minHeight:"100vh",paddingBottom:90,zoom:0.9}}>

    {/* HEADER */}
    <div style={{padding:"14px 20px 10px",borderBottom:`1px solid ${BORDER}`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
      <img src="/images/BENDAlogo.png" alt="Benda" style={{height:40,width:"auto",objectFit:"contain",filter:"brightness(0) invert(1)",position:"absolute",left:20,top:"50%",transform:"translateY(-50%)"}}/>
      <div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:20,letterSpacing:0.5,textTransform:"uppercase"}}>PROGRESS</div>
    </div>

    {isManager&&onTeam&&<div className="tp" onClick={onTeam} style={{margin:"16px 16px 0",borderRadius:14,background:"#140e00",border:`1px solid ${GOLD}55`,padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer"}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={GT} strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        <div>
          <div style={{fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:13,color:GT,letterSpacing:0.3}}>TEAM PROGRESS</div>
          <div style={{fontSize:11,color:T2,marginTop:1}}>See all staff completion at a glance</div>
        </div>
      </div>
      <div style={{color:GT,fontSize:22}}>›</div>
    </div>}

    {/* OVERALL HERO CARD */}
    <div style={{margin:"20px 16px 12px",borderRadius:14,background:CARD,border:`1px solid ${BORDER}`,overflow:"hidden",position:"relative"}}>
      <div style={{position:"relative",padding:"14px 16px 0",textAlign:"center"}}>
        <div style={{fontSize:9,fontWeight:700,letterSpacing:1.5,color:T2,textTransform:"uppercase",marginBottom:4}}>OVERALL COMPLETION</div>
        <div style={{fontFamily:"'Inter',sans-serif",fontWeight:900,fontSize:38,color:T1,lineHeight:1,letterSpacing:-2}}>{ov}<span style={{fontSize:22}}>%</span></div>
        <div style={{fontSize:11,color:T2,marginTop:4,lineHeight:1.4}}>You're on track to become shop floor ready.</div>
        {needCount>0&&<div style={{fontSize:11,color:GT,fontWeight:700,marginTop:3}}>{needCount} bike{needCount!==1?"s":""} still need perfect scores.</div>}
        {ov===100&&<div style={{position:"absolute",top:12,right:14,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
          <ShieldIcon size={36} check col="#22c55e"/>
          <div style={{fontSize:7,fontWeight:800,letterSpacing:0.5,color:C.ok,textAlign:"center",lineHeight:1.2}}>SHOP FLOOR<br/>READY</div>
        </div>}
      </div>
      <div style={{padding:"10px 16px 12px"}}>
        <div style={{height:4,background:"#262626",borderRadius:3,overflow:"hidden",marginBottom:5}}>
          <div style={{width:`${ov}%`,height:"100%",background:`linear-gradient(90deg,${GOLD},${GT})`,borderRadius:3,transition:"width 1s ease"}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between"}}>
          <div style={{fontSize:10,fontWeight:700,color:GT}}>{ov}% COMPLETE</div>
          <div style={{fontSize:10,fontWeight:700,color:T3}}>100% REQUIRED</div>
        </div>
      </div>
    </div>

    {/* CERTIFICATION STATUS */}
    <div style={{margin:"0 16px 12px",borderRadius:14,background:CARD,border:`1px solid ${BORDER}`,padding:"16px"}}>
      <div style={{display:"flex",gap:16,alignItems:"center"}}>
        <div style={{position:"relative",flexShrink:0}}>
          <Ring pct={Math.round(certCount/BIKES.length*100)} sz={90} sw={6} c={GOLD}/>
          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <div style={{fontFamily:"'Inter',sans-serif",fontWeight:900,fontSize:22,color:GT,lineHeight:1}}>{certCount}/{BIKES.length}</div>
            <div style={{fontSize:7,fontWeight:700,color:T3,letterSpacing:0.5,textAlign:"center",lineHeight:1.3}}>BIKES<br/>CERTIFIED</div>
          </div>
        </div>
        <div style={{flex:1}}>
          <div style={{fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:13,color:GT,marginBottom:6,letterSpacing:0.3}}>CERTIFICATION STATUS</div>
          <div style={{fontSize:12,color:T2,lineHeight:1.5}}>Complete all quizzes with perfect scores to earn Shop Floor Approval for each bike.</div>
          <div style={{display:"flex",gap:10,marginTop:8,flexWrap:"wrap"}}>
            {[{c:GT,l:"CERTIFIED"},{c:C.ok,l:"IN PROGRESS"},{c:T3,l:"NOT STARTED"}].map(({c,l})=>(
              <div key={l} style={{display:"flex",alignItems:"center",gap:4}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:c,flexShrink:0}}/>
                <div style={{fontSize:8,fontWeight:700,color:T3,letterSpacing:0.3}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* PER MODEL QUIZ PROGRESS */}
    <div style={{margin:"0 16px 12px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <div style={{fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:12,letterSpacing:0.5,textTransform:"uppercase"}}>PER MODEL QUIZ PROGRESS</div>
        <div style={{fontSize:10,color:T3,fontWeight:600}}>{BIKES.length} MODELS</div>
      </div>
      {BIKES.map(b=>{
        const bq=pr.bikeQuiz[b.id]||{};
        const cert=isCert(bq);
        const inProg=!cert&&isInProg(bq);
        const quizzesLeft=['easy','medium','hard'].filter(d=>!bq[d]||bq[d].best<bq[d].total).length;
        const statusColor=cert?GT:inProg?C.ok:T3;
        const statusText=cert?"SHOP FLOOR\nAPPROVED":inProg?"IN PROGRESS":"NOT STARTED";
        const statusSub=cert?"":inProg?`${quizzesLeft} to go!`:"Start training";
        return <div key={b.id} style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,marginBottom:8,overflow:"hidden",display:"flex",alignItems:"stretch"}}>
          {/* Left: name + image + scores */}
          <div style={{flex:1,display:"flex",flexDirection:"column"}}>
            <div style={{padding:"10px 14px 6px",display:"flex",alignItems:"baseline",gap:8}}>
              <div style={{fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:12,textTransform:"uppercase",letterSpacing:0.3}}>{b.name}</div>
              <div style={{fontSize:9,color:T3}}>{b.type}</div>
            </div>
            <div style={{flex:1,display:"flex",alignItems:"center",padding:"0 0 12px"}}>
              <div style={{width:100,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",paddingTop:13}}>
                <img src={ICON[b.id]} alt={b.name} style={{maxWidth:"115%",maxHeight:65,objectFit:"contain",WebkitMaskImage:"radial-gradient(ellipse 85% 80% at 50% 55%, black 35%, transparent 100%)",maskImage:"radial-gradient(ellipse 85% 80% at 50% 55%, black 35%, transparent 100%)",filter:"brightness(1.2) contrast(1.05) saturate(1.1)"}}/>
              </div>
              <div style={{flex:1,display:"flex",gap:6,justifyContent:"center",alignItems:"center"}}>
                {['easy','medium','hard'].map(d=>{
                  const data=bq[d];
                  const perfect=data&&data.best===data.total&&data.total>0;
                  const partial=data&&data.attempts>0&&!perfect;
                  const bc=perfect?C.ok:partial?GOLD:BORDER;
                  const tc=perfect?C.ok:partial?GT:T3;
                  return <div key={d} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                    <div style={{fontSize:7,fontWeight:700,color:T3,letterSpacing:0.5,textTransform:"uppercase"}}>{d.slice(0,1).toUpperCase()+d.slice(1)}</div>
                    <div style={{width:32,height:32,borderRadius:"50%",border:`2px solid ${bc}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <div style={{fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:10,color:tc}}>{data?`${data.best}/${data.total}`:"—"}</div>
                    </div>
                  </div>;
                })}
              </div>
            </div>
          </div>
          {/* Right: status — full card height, divider spans top to bottom */}
          <div style={{borderLeft:`1px solid ${BORDER}`,width:78,flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,padding:"12px 8px"}}>
            {cert?<ShieldIcon size={26} check/>:<div style={{width:24,height:24,borderRadius:"50%",border:`2px solid ${statusColor}`,display:"flex",alignItems:"center",justifyContent:"center"}}>{inProg&&<div style={{width:8,height:8,borderRadius:"50%",background:C.ok}}/>}</div>}
            <div style={{fontSize:8,fontWeight:800,color:statusColor,letterSpacing:0.2,textAlign:"center",lineHeight:1.3,whiteSpace:"pre-line"}}>{statusText}</div>
            {statusSub&&<div style={{fontSize:8,color:T3,textAlign:"center"}}>{statusSub}</div>}
          </div>
        </div>;
      })}
    </div>

    {/* RESET */}
    <div style={{padding:"0 16px"}}>
      {!confirm
        ?<button className="tp" onClick={()=>setConfirm(true)} style={{width:"100%",padding:14,background:"transparent",border:`1px solid ${BORDER}`,borderRadius:10,fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:13,color:T3,cursor:"pointer"}}>Reset All Progress</button>
        :<div style={{display:"flex",gap:8}}>
          <button className="tp" onClick={()=>{onReset();setConfirm(false)}} style={{flex:1,padding:14,background:C.no,border:"none",borderRadius:10,fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:13,color:"#fff",cursor:"pointer"}}>Confirm Reset</button>
          <button className="tp" onClick={()=>setConfirm(false)} style={{flex:1,padding:14,background:"transparent",border:`1px solid ${BORDER}`,borderRadius:10,fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:13,color:T3,cursor:"pointer"}}>Cancel</button>
        </div>
      }
      {onSignOut&&<button className="tp" onClick={onSignOut} style={{width:"100%",marginTop:10,padding:14,background:"transparent",border:"none",fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:13,color:T3,cursor:"pointer"}}>Sign Out</button>}
    </div>
  </div>;
}
