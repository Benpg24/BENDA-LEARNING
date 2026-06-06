import { useState } from 'react';
import { BIKES, COMP, compKey } from '../data/bikes.js';
import { C, A } from '../shared.jsx';

const ICON={nb250:"/images/NapBOBnew.png",nb500:"/images/Napbob500N.png",ch500:"/images/ChinchillaN.png",df500:"/images/DarkflagN.png",lfc700:"/images/LFCN.png"};
const GOLD=C.gold,GT=C.goldTxt,BORDER='#2a2a2a',CARD='#0a0a0a';
const T1='#fafafa',T2='#b8b8b8',T3='#666';

function SLabel({children}){
  return <div style={{fontSize:10,fontWeight:700,letterSpacing:0.5,color:T1,marginBottom:8}}>{children}</div>;
}

export default function CompareTab(){
  const [a,sA]=useState(BIKES[0].id);
  const [b,sB]=useState(BIKES[1].id);
  const bA=BIKES.find(x=>x.id===a);
  const bB=BIKES.find(x=>x.id===b);
  const k=compKey(a,b);const v=k?COMP[k]:null;
  const sL=["Max Power","Torque","Weight","Seat"];
  const sAv=Object.fromEntries(bA.stats.map(s=>[s.key,s.val]));
  const sBv=Object.fromEntries(bB.stats.map(s=>[s.key,s.val]));

  return <div style={{background:"#000",color:T1,fontFamily:"'Geist',sans-serif",minHeight:"100vh",paddingBottom:90}}>

    {/* HEADER */}
    <div style={{padding:"14px 20px 10px",borderBottom:`1px solid ${BORDER}`,display:"flex",alignItems:"center",justifyContent:"center",position:"sticky",top:0,zIndex:10,background:"#000"}}>
      <img src="/images/BENDAlogo.png" alt="Benda" style={{height:40,width:"auto",objectFit:"contain",filter:"brightness(0) invert(1)",position:"absolute",left:20,top:"50%",transform:"translateY(-50%)"}}/>
      <A><div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:20,letterSpacing:0.5,textTransform:"uppercase",color:T1}}>COMPARE</div></A>
    </div>

    <div>

      {/* BIKE SELECTORS */}
      <div style={{padding:"16px 16px 0"}}>
        <SLabel>PICK TWO BIKES</SLabel>
        <div style={{display:"flex",gap:10,marginBottom:16}}>
          {[{v:a,s:sA},{v:b,s:sB}].map(({v:val,s:set},i)=>(
            <select key={i} value={val} onChange={e=>set(e.target.value)} style={{flex:1,padding:"12px 10px",background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,color:T1,fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:12,letterSpacing:0.3,WebkitAppearance:"none",appearance:"none"}}>
              {BIKES.map(bk=><option key={bk.id} value={bk.id}>{bk.name}</option>)}
            </select>
          ))}
        </div>
      </div>

      {a===b
        ?<div style={{padding:"40px 20px",textAlign:"left",color:T3,fontSize:13}}>Select two different bikes to compare.</div>
        :<A key={a+b}>

          {/* BIKE HERO CARDS */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,padding:"0 16px 16px"}}>
            {[bA,bB].map(bk=>(
              <div key={bk.id} style={{borderRadius:14,background:CARD,border:`1px solid ${BORDER}`,overflow:"hidden"}}>
                <div style={{height:90,background:"#000",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
                  <img src={ICON[bk.id]||bk.icon} alt={bk.name} style={{width:"90%",height:"90%",objectFit:"contain",WebkitMaskImage:"radial-gradient(ellipse 85% 80% at 50% 55%, black 35%, transparent 100%)",maskImage:"radial-gradient(ellipse 85% 80% at 50% 55%, black 35%, transparent 100%)",filter:"brightness(1.2) contrast(1.05) saturate(1.1)"}}/>
                </div>
                <div style={{padding:"10px 12px",textAlign:"left"}}>
                  <div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:12,letterSpacing:0.3,textTransform:"uppercase",color:T1,lineHeight:1.2,marginBottom:2}}>{bk.name}</div>
                  <div style={{fontSize:10,color:T3,letterSpacing:0.5,textTransform:"uppercase",marginBottom:4}}>{bk.type}</div>
                  <div style={{fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:14,color:GT}}>{bk.price}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{padding:"0 16px"}}>

            {/* AT A GLANCE */}
            <SLabel>AT A GLANCE</SLabel>
            <div style={{borderRadius:14,overflow:"hidden",border:`1px solid ${BORDER}`,marginBottom:16}}>
              {["type","feel","who"].map((key,i,arr)=>{
                const ls={type:"Type",feel:"Feel",who:"Best for"};
                return <div key={key} style={{display:"grid",gridTemplateColumns:"1fr 1fr",borderBottom:i<arr.length-1?`1px solid ${BORDER}`:"none"}}>
                  {[bA,bB].map((bk,j)=><div key={bk.id} style={{padding:"12px 14px",borderLeft:j>0?`1px solid ${BORDER}`:"none",background:CARD,textAlign:"left"}}>
                    <div style={{fontSize:9,fontWeight:700,letterSpacing:0.5,textTransform:"uppercase",color:T3,marginBottom:4}}>{ls[key]}</div>
                    <div style={{fontSize:12,color:T2,lineHeight:1.4}}>{bk.anchors[key]}</div>
                  </div>)}
                </div>;
              })}
            </div>

            {/* KEY NUMBERS */}
            <SLabel>KEY NUMBERS</SLabel>
            <div style={{borderRadius:14,overflow:"hidden",border:`1px solid ${BORDER}`,marginBottom:16}}>
              {sL.map((l,i,arr)=>(
                <div key={l} style={{display:"grid",gridTemplateColumns:"1fr 1fr",borderBottom:i<arr.length-1?`1px solid ${BORDER}`:"none"}}>
                  {[sAv,sBv].map((sv,j)=><div key={j} style={{padding:"12px 14px",borderLeft:j>0?`1px solid ${BORDER}`:"none",background:CARD,textAlign:"left"}}>
                    <div style={{fontSize:9,fontWeight:700,letterSpacing:0.5,textTransform:"uppercase",color:T3,marginBottom:4}}>{l}</div>
                    <div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:13,color:T1}}>{sv[l]||"—"}</div>
                  </div>)}
                </div>
              ))}
            </div>

            {v&&<>
              {/* WHAT THEY SHARE */}
              <SLabel>WHAT THEY SHARE</SLabel>
              <div style={{borderRadius:14,overflow:"hidden",border:`1px solid ${BORDER}`,marginBottom:16}}>
                {v.same.map((s,i,arr)=>(
                  <div key={i} style={{padding:"12px 14px",borderBottom:i<arr.length-1?`1px solid ${BORDER}`:"none",background:CARD,display:"flex",gap:10,alignItems:"flex-start"}}>
                    <span style={{color:GT,fontWeight:700,flexShrink:0,fontSize:13}}>=</span>
                    <span style={{fontSize:13,color:T2,lineHeight:1.4}}>{s}</span>
                  </div>
                ))}
              </div>

              {/* KEY DIFFERENCES */}
              <SLabel>KEY DIFFERENCES</SLabel>
              <div style={{borderRadius:14,overflow:"hidden",border:`1px solid ${BORDER}`,marginBottom:16}}>
                {v.diff.map((d,i,arr)=>(
                  <div key={i} style={{padding:"12px 14px",borderBottom:i<arr.length-1?`1px solid ${BORDER}`:"none",background:CARD,display:"flex",gap:10,alignItems:"flex-start"}}>
                    <span style={{color:GT,fontWeight:700,flexShrink:0,fontSize:13}}>›</span>
                    <span style={{fontSize:13,color:T2,lineHeight:1.4}}>{d}</span>
                  </div>
                ))}
              </div>

              {/* SALES VERDICT */}
              <div style={{borderRadius:14,background:CARD,border:`1px solid ${BORDER}`,padding:"14px 16px",marginBottom:16}}>
                <div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:10,letterSpacing:0.5,textTransform:"uppercase",color:GT,marginBottom:8}}>Sales Verdict</div>
                <div style={{fontSize:13,color:T2,lineHeight:1.6}}>{v.verdict}</div>
              </div>
            </>}

          </div>
        </A>
      }
    </div>
  </div>;
}
