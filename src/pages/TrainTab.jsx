import { C, A } from '../shared.jsx';
import { BIKES, bm } from '../data/bikes.js';

const GOLD=C.gold,GT=C.goldTxt,BORDER='#2a2a2a',CARD='#0a0a0a';
const T1='#fafafa',T2='#b8b8b8',T3='#666';

const ICON={nb250:"/images/NapBOBnew.png",nb500:"/images/Napbob500N.png",ch500:"/images/ChinchillaN.png",df500:"/images/DarkflagN.png",lfc700:"/images/LFCN.png"};

export default function TrainTab({onQuiz,onScenarios,onGlossary,progress,onBike,onBot}){
  const pr=progress||{bikeQuiz:{},generalQuiz:{best:0,total:0,attempts:0},scenarios:{completed:0,correct:0,attempts:0}};

  // Stats
  const totalQuizAttempts=Object.values(pr.bikeQuiz).reduce((acc,b)=>{
    return acc+(['easy','medium','hard'].reduce((s,d)=>s+(b[d]?.attempts||0),0));
  },0)+(pr.generalQuiz?.attempts||0);
  const scenarioAttempts=pr.scenarios?.attempts||0;
  const overallPct=Math.round(BIKES.reduce((s,b)=>s+bm(pr,b.id),0)/BIKES.length);

  // Study next — lowest incomplete bike
  const studyNext=[...BIKES]
    .map(b=>({...b,pct:bm(pr,b.id)}))
    .filter(b=>b.pct<100)
    .sort((a,b)=>a.pct-b.pct)[0]||null;

  const cards=[
    {
      onClick:onQuiz,
      icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
      title:'All Models Quiz',
      sub:'12 random questions across every bike and difficulty.',
      tag:'QUIZ',
    },
    {
      onClick:onScenarios,
      icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
      title:'Customer Scenarios',
      sub:'Real-world sales situations — pick the right bike for the customer.',
      tag:'SCENARIOS',
    },
    {
      onClick:onGlossary,
      icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
      title:'Glossary',
      sub:'Common motorcycle terms explained plainly.',
      tag:'REFERENCE',
    },
    {
      onClick:onBot,
      icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M12 11V7"/><circle cx="12" cy="5" r="2"/><line x1="8" y1="15" x2="8" y2="18"/><line x1="16" y1="15" x2="16" y2="18"/></svg>,
      title:'AI Training Coach',
      sub:'Ask anything about the Benda range — specs, comparisons, who each bike suits.',
    },
  ];

  return <div style={{position:'fixed',inset:0,overflow:'hidden',background:'#000',color:T1,fontFamily:"'Geist',sans-serif"}}>

    {/* HEADER */}
    <div style={{padding:'14px 20px 10px',borderBottom:`1px solid ${BORDER}`,position:'relative',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
      <img src="/images/BENDAlogo.png" alt="Benda" style={{height:40,width:'auto',objectFit:'contain',filter:'brightness(0) invert(1)',position:'absolute',left:20,top:'50%',transform:'translateY(-50%)'}}/>
      <A><div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:20,letterSpacing:0.5,textTransform:'uppercase',color:T1}}>TRAINING</div></A>
    </div>

    {/* BODY */}
    <div style={{overflowY:'auto',height:'calc(100% - 65px)',WebkitOverflowScrolling:'touch',paddingBottom:80}}>

      {/* STATS BAR */}
      <A>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:1,margin:'16px 16px 0',borderRadius:14,overflow:'hidden',border:`1px solid ${BORDER}`}}>
          {[
            {label:'OVERALL',value:`${overallPct}%`},
            {label:'QUIZZES',value:totalQuizAttempts},
            {label:'SCENARIOS',value:scenarioAttempts},
          ].map((s,i)=>(
            <div key={i} style={{background:CARD,padding:'14px 10px',textAlign:'center',borderLeft:i>0?`1px solid ${BORDER}`:'none'}}>
              <div style={{fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:22,color:GT,lineHeight:1}}>{s.value}</div>
              <div style={{fontSize:8,fontWeight:700,letterSpacing:1,color:T3,marginTop:4,textTransform:'uppercase'}}>{s.label}</div>
            </div>
          ))}
        </div>
      </A>

      {/* TRAINING TOOLS */}
      <div style={{padding:'20px 16px 0'}}>
        <div style={{fontSize:9,fontWeight:700,letterSpacing:1.5,color:T3,textTransform:'uppercase',marginBottom:12}}>TRAINING TOOLS</div>
        {cards.map((c,i)=>(
          <A key={c.title} d={160+i*60}>
            <div onClick={c.comingSoon?undefined:c.onClick} className={c.comingSoon?'':'tp'} style={{display:'flex',alignItems:'center',gap:16,background:CARD,border:`1px solid ${BORDER}`,borderRadius:14,padding:'18px 18px',marginBottom:10,cursor:c.comingSoon?'default':'pointer',opacity:c.comingSoon?0.5:1}}>
              <div style={{width:50,height:50,borderRadius:14,background:'#111',border:`1px solid #2a2a2a`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                {c.icon}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                  <div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:15,color:c.comingSoon?T3:T1}}>{c.title}</div>
                  {c.comingSoon&&<div style={{fontSize:7,fontWeight:800,letterSpacing:1,color:T3,background:'#1a1a1a',border:`1px solid #333`,borderRadius:4,padding:'2px 6px'}}>COMING SOON</div>}
                </div>
                <div style={{fontSize:12,color:T3,lineHeight:1.5}}>{c.sub}</div>
              </div>
              {!c.comingSoon&&<div style={{color:GT,fontSize:22,flexShrink:0}}>›</div>}
            </div>
          </A>
        ))}
      </div>

    </div>
  </div>;
}
