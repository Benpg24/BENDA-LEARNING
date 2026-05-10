import { BIKES, bm } from '../data/bikes.js';
import { C, bd, A, Ring, HoverCard } from '../shared.jsx';

export default function RangeTab({onBike,progress:pr}){
  return <div style={{position:"fixed",inset:0,overflow:"hidden",background:"#000000"}}>
    <div style={{padding:"14px 20px 10px",borderBottom:`1px solid ${C.border}`,position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <img src="/images/BENDAlogo.png" alt="Benda" style={{height:40,width:"auto",objectFit:"contain",filter:"brightness(0) invert(1)",position:"absolute",left:20,top:"50%",transform:"translateY(-50%)"}}/>
      <A><div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:20,letterSpacing:1,textTransform:"uppercase",color:C.t1}}>THE RANGE</div></A>
    </div>
    <div style={bd}>
      {BIKES.map((b,i)=>{const m=bm(pr,b.id);return(
        <A key={b.id} d={80+i*50}><HoverCard onClick={()=>onBike(b)} style={{background:C.s1,padding:"12px 14px",marginBottom:10,display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
          <div style={{width:105,height:78,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
            {b.icon&&<img src={b.icon} alt={b.name} style={{maxWidth:"120%",maxHeight:"120%",objectFit:"contain",position:"relative",WebkitMaskImage:"radial-gradient(ellipse 85% 80% at 50% 55%, black 35%, transparent 100%)",maskImage:"radial-gradient(ellipse 85% 80% at 50% 55%, black 35%, transparent 100%)",filter:"brightness(1.2) contrast(1.05) saturate(1.1)"}}/>}
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
