import { useState } from 'react';

export const C = {
  bg: "#000000", s1: "#0a0a0a", s2: "#141414", s3: "#1a1a1a",
  border: "#2a2a2a", borderL: "#3f3f46",
  text: "#fafafa", t2: "#a1a1aa", t3: "#71717a", t4: "#52525b",
  accent: "#ffffff", accentDim: "#d4d4d8", accentGlow: "rgba(255,255,255,0.08)", accentBorder: "#e4e4e7",
  gold: "#D4A24A", goldTxt: "#E8B956", goldDim: "#9b7530", goldBg: "rgba(212,162,74,0.12)",
  ok: "#22c55e", okTxt: "#4ade80", okBg: "rgba(34,197,94,0.08)", okBdr: "#166534",
  no: "#ef4444", noTxt: "#f87171", noBg: "rgba(239,68,68,0.08)", noBdr: "#7f1d1d",
  tE: "#ffffff", tS: "#a1a1aa", tD: "#71717a", tW: "#52525b",
};

export const sec={fontSize:10,letterSpacing:3,textTransform:"uppercase",color:C.t3,marginBottom:14,fontWeight:600};
export const bd={padding:"24px 20px"};
export const BIKE_COLOURS={nb250:"#a855f7",nb500:"#a855f7",ch500:"#a855f7",df500:"#a855f7",lfc700:"#a855f7"};
export const crd={background:C.s1,border:`1px solid ${C.border}`,borderRadius:6};
export const btnA={width:"100%",padding:16,background:C.accent,border:"none",borderRadius:6,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:14,letterSpacing:2,textTransform:"uppercase",color:C.bg,cursor:"pointer"};
export const btnG={...btnA,background:"transparent",border:`1px solid ${C.border}`,color:C.t3};

export function A({children,d=0,t="au",s={}}){return <div className={t} style={{animationDelay:d+"ms",...s}}>{children}</div>}

export function Ring({pct,sz=44,sw=3,c}){
  const cl=c||(pct===100?C.accent:pct>0?C.accent:C.t4);
  const r=(sz-sw)/2;
  const ci=2*Math.PI*r;
  const o=ci-(pct/100)*ci;
  return <svg width={sz} height={sz} style={{transform:"rotate(-90deg)",flexShrink:0}}>
    <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={C.border} strokeWidth={sw}/>
    <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={cl} strokeWidth={sw} strokeDasharray={ci} strokeDashoffset={o} strokeLinecap="round" style={{transition:"stroke-dashoffset .8s ease"}}/>
  </svg>
}

export function HoverCard({onClick,title,sub,style,children}){
  const [hovered,sH]=useState(false);
  if(children){return <div
    onMouseEnter={()=>sH(true)}
    onMouseLeave={()=>sH(false)}
    onClick={onClick}
    style={{
      ...crd,
      ...style,
      border:`1px solid ${hovered?"rgba(255,255,255,0.6)":C.border}`,
      boxShadow:hovered?`0 0 0 1px rgba(255,255,255,0.15)`:"none",
      borderRadius:6,cursor:"pointer",
      transition:"border .2s ease, box-shadow .2s ease",
    }}>
    {children}
  </div>}
  return <div
    onMouseEnter={()=>sH(true)}
    onMouseLeave={()=>sH(false)}
    onClick={onClick}
    style={{
      background:hovered?C.accent:C.s1,
      border:`1px solid ${hovered?C.accent:C.border}`,
      borderRadius:6,padding:"24px 20px",marginBottom:12,cursor:"pointer",
      transition:"all .2s ease",
    }}>
    <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:20,letterSpacing:1,textTransform:"uppercase",marginBottom:4,color:hovered?C.bg:C.text,transition:"color .2s ease"}}>{title}</div>
    <div style={{fontSize:13,color:hovered?C.bg:C.t3,opacity:hovered?.8:1,transition:"color .2s ease"}}>{sub}</div>
  </div>
}
