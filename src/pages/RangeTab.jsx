import { BIKES, bm } from '../data/bikes.js';
import { C, bd, A, Ring, HoverCard } from '../shared.jsx';

export default function RangeTab({onBike,progress:pr}){
  return <div style={{paddingBottom:80,background:"#000000",minHeight:"100vh"}}>
    <div style={{padding:"40px 20px 24px",borderBottom:`1px solid ${C.border}`}}>
      <A><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
        <img src="/images/BENDAlogo.png" alt="Benda" style={{height:55,width:"auto",objectFit:"contain",filter:"brightness(0) invert(1)"}}/>
      </div></A>
      <A d={60}><div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:32,letterSpacing:1,lineHeight:1.1,marginBottom:4,textAlign:"left"}}>THE RANGE</div></A>
      <A d={100}><div style={{fontSize:13,color:C.t2,lineHeight:1.6,textAlign:"left"}}>5 models. Learn each one inside out.</div></A>
    </div>
    <div style={bd}>
      {BIKES.map((b,i)=>{const m=bm(pr,b.id);return(
        <A key={b.id} d={80+i*50}><HoverCard onClick={()=>onBike(b)} style={{background:C.s1,padding:"12px 14px",marginBottom:10,display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
          <div style={{width:105,height:78,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
            <div style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:"80%",height:"40%",background:"radial-gradient(ellipse,rgba(180,120,30,0.35) 0%,transparent 70%)",pointerEvents:"none"}}/>
            {b.icon&&<img src={b.icon} alt={b.name} style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain",position:"relative"}}/>}
          </div>
          <div style={{flex:1,paddingLeft:4,textAlign:"left",minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:14,letterSpacing:0.5,textTransform:"uppercase",lineHeight:1.1}}>{b.name}</div>
              {m===100&&<Ring pct={m} sz={20} sw={2}/>}
            </div>
            <div style={{fontSize:10,color:C.t2,letterSpacing:1.2,textTransform:"uppercase",marginTop:3}}>{b.type}</div>
            <div style={{fontSize:13,color:C.goldTxt,fontWeight:700,marginTop:3,fontFamily:"'Rajdhani',sans-serif"}}>{b.price}</div>
          </div>
          <div style={{color:C.t3,fontSize:20,flexShrink:0}}>›</div>
        </HoverCard></A>
      )})}
    </div>
  </div>;
}
