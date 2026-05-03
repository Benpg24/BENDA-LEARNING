import { useState } from 'react';
import { BIKES, bm, om } from '../data/bikes.js';
import { C, bd, crd, sec, btnA, btnG, A, Ring } from '../shared.jsx';

export default function ProgressTab({progress:pr,onReset}){
  const ov=om(pr);
  const [confirm,setConfirm]=useState(false);
  return <div style={{paddingBottom:80}}>
    <div style={{padding:"40px 20px 24px",borderBottom:`1px solid ${C.border}`}}>
      <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:32,letterSpacing:1,marginBottom:8}}>PROGRESS</div>
    </div>
    <div style={bd}>
      <A><div style={{textAlign:"center",marginBottom:32}}>
        <div style={{display:"inline-block",position:"relative"}}>
          <Ring pct={ov} sz={100} sw={5}/>
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:28}}>{ov}%</span>
          </div>
        </div>
        <div style={{fontSize:11,letterSpacing:3,textTransform:"uppercase",color:C.t2,marginTop:8}}>Overall Completion</div>
      </div></A>
      <div style={sec}>Per Model</div>
      {BIKES.map((b,i)=>{const m=bm(pr,b.id);const bq=pr.bikeQuiz[b.id]||{};return(
        <A key={b.id} d={i*50}><div style={{...crd,padding:"16px 18px",marginBottom:8}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <div>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:15,letterSpacing:1,textTransform:"uppercase"}}>{b.name}</div>
              <div style={{fontSize:11,color:C.t2}}>{b.type}</div>
            </div>
            <Ring pct={m} sz={36} sw={3}/>
          </div>
          <div style={{display:"flex",gap:6}}>
            {["easy","medium","hard"].map(d=>{const data=bq[d];const pc=data?Math.round(data.best/data.total*100):0;const cl=pc===100?C.ok:pc>0?C.accent:C.t4;return(
              <div key={d} style={{flex:1,background:C.bg,borderRadius:4,padding:"8px 6px",textAlign:"center"}}>
                <div style={{fontSize:10,letterSpacing:1,textTransform:"uppercase",color:C.t4,marginBottom:4}}>{d}</div>
                <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:16,color:cl}}>{data?`${data.best}/${data.total}`:"—"}</div>
                {data&&<div style={{fontSize:10,color:C.t4}}>{data.attempts}x</div>}
              </div>
            )})}
          </div>
        </div></A>
      )})}
      <div style={{...sec,marginTop:24}}>Other Modes</div>
      <A d={300}><div style={{...crd,padding:"16px 18px",marginBottom:8}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:15,textTransform:"uppercase",letterSpacing:1}}>General Quiz</div><div style={{fontSize:12,color:C.t3}}>{pr.generalQuiz.attempts}x</div></div>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:22,color:pr.generalQuiz.best>0?C.accent:C.t4}}>{pr.generalQuiz.total>0?`${pr.generalQuiz.best}/${pr.generalQuiz.total}`:"—"}</div>
        </div>
      </div></A>
      <A d={350}><div style={{...crd,padding:"16px 18px",marginBottom:28}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:15,textTransform:"uppercase",letterSpacing:1}}>Scenarios</div><div style={{fontSize:12,color:C.t3}}>{pr.scenarios.attempts}x</div></div>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:22,color:pr.scenarios.correct>0?C.accent:C.t4}}>{pr.scenarios.attempts>0?`${pr.scenarios.correct}/${pr.scenarios.completed}`:"—"}</div>
        </div>
      </div></A>
      {!confirm
        ?<button className="tp" style={{...btnG,color:C.t4}} onClick={()=>setConfirm(true)}>Reset All Progress</button>
        :<div style={{display:"flex",gap:8}}>
          <button className="tp" style={{...btnA,flex:1,background:C.no}} onClick={()=>{onReset();setConfirm(false)}}>Confirm Reset</button>
          <button className="tp" style={{...btnG,flex:1}} onClick={()=>setConfirm(false)}>Cancel</button>
        </div>
      }
    </div>
  </div>;
}
