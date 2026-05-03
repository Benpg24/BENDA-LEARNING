import { useState } from 'react';
import { BIKES, COMP, compKey } from '../data/bikes.js';
import { C, crd, sec, A } from '../shared.jsx';

export default function CompareTab(){
  const [a,sA]=useState(BIKES[0].id);
  const [b,sB]=useState(BIKES[1].id);
  const bA=BIKES.find(x=>x.id===a);const bB=BIKES.find(x=>x.id===b);
  const k=compKey(a,b);const v=k?COMP[k]:null;
  const sL=["Max Power","Torque","Weight","Seat"];
  const sAv=Object.fromEntries(bA.stats.map(s=>[s.key,s.val]));
  const sBv=Object.fromEntries(bB.stats.map(s=>[s.key,s.val]));

  return <div style={{paddingBottom:80}}>
    <div style={{padding:"40px 20px 24px",borderBottom:`1px solid ${C.border}`}}>
      <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:32,letterSpacing:1,marginBottom:8}}>COMPARE</div>
    </div>
    <div style={{padding:"20px 20px 0"}}>
      <div style={{...sec,marginBottom:10}}>Pick two bikes</div>
      <div style={{display:"flex",gap:10,marginBottom:20}}>
        {[{v:a,s:sA},{v:b,s:sB}].map(({v:val,s:set},i)=>(
          <select key={i} style={{flex:1,padding:"13px 12px",background:C.s1,border:`1px solid ${C.border}`,borderRadius:6,color:C.text,fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:13,letterSpacing:1}} value={val} onChange={e=>set(e.target.value)}>
            {BIKES.map(bk=><option key={bk.id} value={bk.id}>{bk.name}</option>)}
          </select>
        ))}
      </div>
    </div>
    {a===b
      ?<div style={{padding:20,color:C.t3,fontSize:14}}>Select two different bikes.</div>
      :<div style={{padding:"0 20px 40px"}}>
        <A key={a+b}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
            {[bA,bB].map(bk=><div key={bk.id} style={{...crd,background:"#000",overflow:"hidden",textAlign:"center"}}>
              <div style={{width:"100%",height:70,background:C.s2,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontSize:10,color:C.t4,letterSpacing:1}}>IMG</span>
              </div>
              <div style={{padding:"10px 12px"}}>
                <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,letterSpacing:1,textTransform:"uppercase",marginBottom:2}}>{bk.name}</div>
                <div style={{fontSize:11,color:C.t2,letterSpacing:1,textTransform:"uppercase"}}>{bk.type}</div>
                <div style={{fontSize:12,color:"#4ade80",marginTop:4,fontWeight:600}}>{bk.price}</div>
              </div>
            </div>)}
          </div>
          <div style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",color:C.accent,padding:"16px 0 10px",borderBottom:`1px solid ${C.border}`,marginBottom:2,fontWeight:600}}>At a Glance</div>
          {["type","feel","who"].map(k=>{
            const ls={type:"Type",feel:"Feel",who:"Best for"};
            return <div key={k} style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:C.border,marginBottom:1}}>
              {[bA,bB].map(bk=><div key={bk.id} style={{background:C.s1,padding:"12px 14px"}}>
                <div style={{fontSize:10,letterSpacing:1,textTransform:"uppercase",color:C.t3,marginBottom:4}}>{ls[k]}</div>
                <div style={{fontSize:13,fontWeight:500}}>{bk.anchors[k]}</div>
              </div>)}
            </div>
          })}
          <div style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",color:C.accent,padding:"16px 0 10px",borderBottom:`1px solid ${C.border}`,marginBottom:2,fontWeight:600}}>Key Numbers</div>
          {sL.map(l=><div key={l} style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:C.border,marginBottom:1}}>
            {[sAv,sBv].map((sv,i)=><div key={i} style={{background:C.s1,padding:"12px 14px"}}>
              <div style={{fontSize:10,letterSpacing:1,textTransform:"uppercase",color:C.t3,marginBottom:4}}>{l}</div>
              <div style={{fontSize:13,fontWeight:500}}>{sv[l]||"—"}</div>
            </div>)}
          </div>)}
          {v&&<>
            <div style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",color:C.accent,padding:"16px 0 10px",borderBottom:`1px solid ${C.border}`,marginBottom:2,fontWeight:600}}>What They Share</div>
            {v.same.map((s,i)=><div key={i} style={{padding:"9px 0",borderBottom:`1px solid ${C.border}`,fontSize:13,color:C.t2,display:"flex",gap:10}}>
              <span style={{color:C.okTxt,flexShrink:0,fontWeight:700}}>=</span><span>{s}</span>
            </div>)}
            <div style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",color:C.accent,padding:"16px 0 10px",borderBottom:`1px solid ${C.border}`,marginBottom:2,fontWeight:600}}>Key Differences</div>
            {v.diff.map((d,i)=><div key={i} style={{padding:"9px 0",borderBottom:`1px solid ${C.border}`,fontSize:13,color:C.t2,display:"flex",gap:10}}>
              <span style={{color:C.noTxt,flexShrink:0,fontWeight:700}}>/</span><span>{d}</span>
            </div>)}
            <div style={{background:C.s2,border:`1px solid ${C.border}`,borderRadius:6,padding:18,marginTop:20}}>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:12,letterSpacing:2,textTransform:"uppercase",color:C.accent,marginBottom:10}}>Sales Verdict</div>
              <div style={{fontSize:14,color:"#aaa",lineHeight:1.7}}>{v.verdict}</div>
            </div>
          </>}
        </A>
      </div>
    }
  </div>;
}
