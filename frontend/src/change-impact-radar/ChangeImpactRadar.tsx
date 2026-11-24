import { useState } from 'react';
import { Activity, AlertTriangle, ArrowRight, CheckCircle2, Clipboard, FileCode2, Shield, Sparkles } from 'lucide-react';
import { analyzeChangeImpact } from './api';
import type { RiskResult, RiskLevel } from './types';
import './change-impact-radar.css';

const examples = [
  'Change JWT authorization roles in UserController and add integration tests. Existing admin access must remain backward compatible.',
  'Add a database migration to drop the legacy column and update the payment checkout transaction. No tests added.',
  'Update the landing page hero styling and add a Vitest component test. No backend or security logic changes.'
];
const levelText: Record<RiskLevel, string> = { LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High', CRITICAL: 'Critical' };

export default function ChangeImpactRadar() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<RiskResult | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const run = async () => {
    setError(''); setResult(null); setBusy(true);
    try { setResult(await analyzeChangeImpact(input.trim())); }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to analyze change.'); }
    finally { setBusy(false); }
  };
  return <main className="cir-page">
    <nav className="cir-nav"><a href="/">← DevMind AI</a><a href="/tools/secrets">Secret Shield</a><span>Change Impact Radar</span></nav>
    <header className="cir-hero"><div className="cir-eyebrow"><Activity size={15}/> ENGINEERING RISK / HEURISTIC MODE</div><h1>Change Impact <em>Radar</em></h1><p>Estimate merge risk with transparent signals. Every point is explained—no black-box verdict.</p></header>
    <div className="cir-layout">
      <section className="cir-panel cir-input-panel"><div className="cir-panel-head"><span className="cir-index">01</span><div><h2>Describe your change</h2><p>Include changed files, systems touched and test status. Do not paste secrets.</p></div></div>
        <div className="cir-examples">{examples.map((ex,i)=><button key={i} onClick={()=>{setInput(ex);setResult(null);setError('')}}>Example {i+1}</button>)}</div>
        <textarea value={input} onChange={e=>{setInput(e.target.value);setResult(null)}} placeholder="Example: Update JWT role checks, modify user repository, add migration… Mention tests that were run or are missing." maxLength={30000}/>
        <div className="cir-input-foot"><span>{input.length.toLocaleString()} / 30,000 characters</span><button className="cir-primary" onClick={run} disabled={!input.trim()||busy}>{busy?'Scoring signals…':'Analyze change'} <ArrowRight size={16}/></button></div>
        {error&&<div className="cir-error" role="alert"><AlertTriangle size={16}/>{error}</div>}
        <div className="cir-privacy"><Shield size={16}/><span>Input is processed by this backend endpoint and is not saved by Change Impact Radar.</span></div>
      </section>
      <section className="cir-panel cir-results"><div className="cir-panel-head"><span className="cir-index">02</span><div><h2>Risk assessment</h2><p>Score, signals and review recommendations.</p></div></div>
        {!result ? <div className="cir-empty"><div className="cir-orbit"><Activity size={26}/></div><b>Radar is ready</b><p>Describe a change and run the analysis to see its score.</p></div> : <div className="cir-result-content">
          <div className={`cir-score-card ${result.level.toLowerCase()}`}><div className="cir-score"><strong>{result.score}</strong><span>/100</span></div><div><span className="cir-level">{levelText[result.level]} risk</span><h3>{result.levelLabel}</h3><p>Heuristic score—not a merge decision.</p></div><div className="cir-meter"><i style={{width:`${result.score}%`}}/></div></div>
          <div className="cir-result-section"><h3><Sparkles size={17}/> Explainable signals <span>{result.signals.length}</span></h3>{result.signals.length===0?<p className="cir-no-signals">No risk keywords matched. This does not guarantee a safe change.</p>:<div className="cir-signals">{result.signals.map(s=><article key={s.id} className="cir-signal"><div className="cir-signal-top"><b>{s.label}</b><span className={s.points<0?'negative':''}>{s.points>0?'+':''}{s.points}</span></div><p>{s.explanation}</p>{s.matchedTerms.length>0&&<div className="cir-terms">Matched: {s.matchedTerms.map((t,i)=><code key={i}>{t}</code>)}</div>}</article>)}</div>}</div>
          <div className="cir-result-section"><h3><CheckCircle2 size={17}/> Test evidence</h3><p className="cir-test-evidence">{result.testEvidence}</p></div>
          <div className="cir-result-section"><h3><Clipboard size={17}/> Recommended next steps</h3><ul className="cir-recommendations">{result.recommendations.map((r,i)=><li key={i}>{r}</li>)}</ul></div>
          <details className="cir-method"><summary>How the score is calculated</summary><p>{result.methodology}</p><p>{result.disclaimer}</p></details>
        </div>}
      </section>
    </div>
    <footer className="cir-footer"><FileCode2 size={16}/><span>Transparent keyword heuristics · No repository graph or test execution · Human review remains required</span></footer>
  </main>;
}
