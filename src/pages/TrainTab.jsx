import { C, bd, crd, A, HoverCard } from '../shared.jsx';

export default function TrainTab({onQuiz,onScenarios,onGlossary}){
  return <div style={{paddingBottom:80}}>
    <div style={{padding:"40px 20px 24px",borderBottom:`1px solid ${C.border}`}}>
      <A><div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:32,letterSpacing:1,lineHeight:1.1,marginBottom:8}}>TRAINING</div></A>
      <A d={60}><div style={{fontSize:13,color:C.t2,lineHeight:1.6}}>Test your knowledge across the full range.</div></A>
    </div>
    <div style={bd}>
      <A d={100}><HoverCard onClick={onGlossary} title="Glossary" sub="Common motorcycle terms explained plainly"/></A>
      <A d={160}><HoverCard onClick={onQuiz} title="All Models Quiz" sub="12 random questions from every bike and difficulty"/></A>
      <A d={220}><HoverCard onClick={onScenarios} title="Customer Scenarios" sub="Real-world sales situations - pick the right bike"/></A>
      <A d={280}><div style={{...crd,padding:"20px",marginTop:20}}>
        <div style={{fontSize:12,color:C.t2,lineHeight:1.6}}>Per-bike quizzes and flashcards are inside each model page. Tap a bike in the Range tab to access them.</div>
      </div></A>
    </div>
  </div>;
}
