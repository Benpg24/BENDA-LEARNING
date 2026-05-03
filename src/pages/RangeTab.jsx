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
        <A key={b.id} d={80+i*50}><HoverCard onClick={()=>onBike(b)} style={{background:C.s1,padding:"16px 20px",marginBottom:10,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
          <div style={{width:120,height:90,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
            {b.icon&&<img src={b.icon} alt={b.name} style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain"}}/>}
          </div>
          <div style={{flex:1,paddingLeft:8}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:19,letterSpacing:1,textTransform:"uppercase"}}>{b.name}</div>
              {m===100&&<Ring pct={m} sz={22} sw={2}/>}
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center",marginTop:3}}>
              <span style={{fontSize:11,color:C.t2,letterSpacing:1,textTransform:"uppercase"}}>{b.type}</span>
              <span style={{fontSize:11,color:"#4ade80",fontWeight:600}}>{b.price}</span>
            </div>
          </div>
          <div style={{color:C.t3,fontSize:22,flexShrink:0}}>›</div>
        </HoverCard></A>
      )})}
    </div>
  </div>;
}
