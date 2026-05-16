import { C, A } from '../shared.jsx';

const GOLD=C.gold,GT=C.goldTxt,BORDER='#2a2a2a',CARD='#141414';
const T1='#fafafa',T2='#b8b8b8',T3='#666';

export default function TrainTab({onQuiz,onScenarios,onGlossary}){
  const cards=[
    {
      onClick:onGlossary,
      icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
      title:'Glossary',
      sub:'Common motorcycle terms explained plainly.',
    },
    {
      onClick:onQuiz,
      icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
      title:'All Models Quiz',
      sub:'12 random questions across every bike and difficulty.',
    },
    {
      onClick:onScenarios,
      icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
      title:'Customer Scenarios',
      sub:'Real-world sales situations — pick the right bike.',
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
      <div style={{padding:'20px 16px 0'}}>

        {cards.map((c,i)=>(
          <A key={c.title} d={80+i*60}>
            <div onClick={c.onClick} className="tp" style={{display:'flex',alignItems:'center',gap:14,background:CARD,border:`1px solid ${BORDER}`,borderRadius:14,padding:'16px 18px',marginBottom:10,cursor:'pointer'}}>
              <div style={{width:44,height:44,borderRadius:12,background:'#1a1a1a',border:`1px solid #333`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                {c.icon}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:"'Inter',sans-serif",fontWeight:700,fontSize:15,color:T1,marginBottom:3}}>{c.title}</div>
                <div style={{fontSize:12,color:T3,lineHeight:1.4}}>{c.sub}</div>
              </div>
              <div style={{color:GT,fontSize:20,flexShrink:0}}>›</div>
            </div>
          </A>
        ))}

        <A d={300}>
          <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:14,padding:'14px 18px',marginTop:6}}>
            <div style={{fontSize:12,color:T3,lineHeight:1.6}}>Per-bike quizzes and flashcards are inside each model page. Tap a bike in the Range tab to access them.</div>
          </div>
        </A>

      </div>
    </div>
  </div>;
}
