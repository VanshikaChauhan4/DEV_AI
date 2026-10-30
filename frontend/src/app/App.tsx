import { useEffect, useState } from 'react';
import { Link, Route, Routes, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BrainCircuit, Network, Radar, ShieldCheck, Sparkles, TerminalSquare, Workflow } from 'lucide-react';
import { ParallaxComponent } from '../components/ui/parallax-scrolling';
import { FeatureWheel } from '../components/landing/FeatureWheel';
import { CurveCarousel } from '../components/landing/CurveCarousel';
import { features } from '../lib/features';

const steps = [
  { n: '01', title: 'Understand', icon: Network, text: 'Index repository structure, dependencies and relevant history.' },
  { n: '02', title: 'Predict', icon: Radar, text: 'Surface change risk and explain the signals behind it.' },
  { n: '03', title: 'Repair', icon: Sparkles, text: 'Propose a focused patch with traceable reasoning.' },
  { n: '04', title: 'Verify', icon: ShieldCheck, text: 'Run checks in isolation and attach the evidence.' },
];

function SiteFooter() {
  return <footer className="site-footer"><div className="site-footer-bg"/><div className="site-footer-inner"><h3>Build ideas.<br/><em>Ship with proof.</em></h3><nav><a href="#platform">Platform</a><a href="#workflow">How it works</a><a href="#principles">Principles</a><Link to="/dashboard">Workspace ↗</Link></nav><small>© 2026 DevMind AI · PREDICT WITH EVIDENCE · REPAIR WITH CONFIDENCE</small></div></footer>;
}

function Landing() {
  return <main className="site-shell">
    <ParallaxComponent />
    <section className="visual-inspiration section-pad" aria-labelledby="visual-inspiration-title">
      <div className="visual-inspiration-heading" data-reveal>
        <span className="eyebrow"><i/> A QUIETER SPACE TO THINK</span>
        <h2 id="visual-inspiration-title">Complex code deserves<br/><em>a clearer view.</em></h2>
        <p>A calm, visual workspace for the moments when a bug is hard to trace, a change feels risky, or the next step is unclear.</p>
      </div>
      <div className="visual-mosaic">
        <article className="visual-tile visual-tile--moon" data-reveal>
          <img src="/assets/images/moonlit-bloom.png" alt="Dreamlike moonlit field of flowers" loading="lazy" />
          <div className="visual-tile-shade"/><div className="visual-tile-copy"><span>01 / FIND YOUR FOCUS</span><h3>Make space<br/>for clarity.</h3></div>
        </article>
        <article className="visual-tile visual-tile--polaris" data-reveal>
          <img src="/assets/images/polaris-landscape.png" alt="A person looking out over a luminous, star-filled landscape" loading="lazy" />
          <div className="visual-tile-shade"/><div className="visual-tile-copy"><span>02 / SEE THE WHOLE SYSTEM</span><h3>Follow the<br/>signals.</h3></div>
        </article>
        <article className="visual-tile visual-tile--valley" data-reveal>
          <img src="/assets/images/luminous-valley.png" alt="Glowing, flowing lights over a dark flower valley" loading="lazy" />
          <div className="visual-tile-shade"/><div className="visual-tile-copy"><span>03 / TRACE THE CAUSE</span><h3>Find the thread.</h3></div>
        </article>
        <article className="visual-tile visual-tile--imagine" data-reveal>
          <img src="/assets/images/imagine-create.png" alt="A surreal pastel landscape beneath swirling clouds" loading="lazy" />
          <div className="visual-tile-shade"/><div className="visual-tile-copy"><span>04 / EXPLORE A FIX</span><h3>Turn insight<br/>into action.</h3></div>
        </article>
        <article className="visual-tile visual-tile--dream" data-reveal>
          <img src="/assets/images/dreamscape-tree.png" alt="A lone tree in a luminous, dreamlike landscape" loading="lazy" />
          <div className="visual-tile-shade"/><div className="visual-tile-copy"><span>05 / CHECK THE IMPACT</span><h3>Change with<br/>confidence.</h3></div>
        </article>
        <article className="visual-tile visual-tile--strange" data-reveal>
          <img src="/assets/images/strange-world.png" alt="A surreal glowing landscape with a warm, atmospheric horizon" loading="lazy" />
          <div className="visual-tile-shade"/><div className="visual-tile-copy"><span>06 / VERIFY THE RESULT</span><h3>Ship with proof.</h3></div>
        </article>
      </div>
      <p className="visual-inspiration-quote" data-reveal>“Good tools make the hard parts feel possible.”</p>
    </section>
    <section className="agent-showcase section-pad" id="agents"><span className="eyebrow">SIX SPECIALISTS · SIX WORKSPACES</span><h2>One mission. <em>Six focused minds.</em></h2><div className="agent-grid">{agentInfo.map((a,i)=><Link className="agent-card" to={"/agents/"+a.slug} key={a.slug}><span>0{i+1} / AGENT</span><h3>{a.name}</h3><p>{a.description}</p><strong>Open workspace ↗</strong></Link>)}</div><div className="unique-grid"><Link to="/tools/secrets"><h3>01 · Secret Shield</h3><p>Find accidentally pasted API keys, private keys and credentials before code is shared. Runs locally on your own backend.</p><strong>Scan code ↗</strong></Link><Link to="/tools/risk"><h3>02 · Change Impact Radar</h3><p>Score risky changes using transparent indicators: authentication, database migrations, payment paths and missing tests.</p><strong>Assess a change ↗</strong></Link></div></section><FeatureWheel/>
    <CurveCarousel/>

    <section className="workflow-section section-pad" id="workflow">
      <div className="section-intro" data-reveal><div><span className="eyebrow"><i/> 03 / THE REPAIR LOOP</span><h2>From “why did it fail?”<br/><em>to “here’s the proof.”</em></h2></div><p>Autonomy without a black box. Each stage produces an artifact the next stage can use—and a person can review.</p></div>
      <div className="workflow-track">{steps.map((s, i) => { const Icon = s.icon; return <motion.article className="workflow-step" key={s.n} data-reveal transition={{ delay: i * .08 }}><div className="workflow-step-top"><span>{s.n}</span><Icon size={21}/></div><h3>{s.title}</h3><p>{s.text}</p>{i < 3 && <span className="step-arrow"><ArrowRight size={17}/></span>}</motion.article>; })}</div>
      <div className="human-note" data-reveal><ShieldCheck size={20}/><p><strong>Human approval stays in the loop.</strong> DevMind prepares evidence and recommends next actions; your team decides what gets accepted and merged.</p></div>
    </section>

    <section className="principles-section section-pad" id="principles">
      <div className="principles-image" data-reveal><div className="principles-image-glow"/><div className="code-window"><div className="window-dots"><i/><i/><i/><span>repair.plan</span></div><code><b>01</b> analyze(repo)</code><code><b>02</b> predict(change)</code><code><b>03</b> propose(patch)</code><code className="code-success"><b>04</b> verify(evidence) ✓</code><div className="window-status"><span/> ALL CHECKS REVIEWABLE</div></div><span className="image-vertical-label">INTELLIGENCE WITH RECEIPTS</span></div>
      <div className="principles-copy" data-reveal><span className="eyebrow"><i/> 04 / THE PRINCIPLE</span><h2>Intelligence is useful.<br/><em>Evidence is trust.</em></h2><p>AI-generated code is only a proposal. DevMind is designed around the engineering work that makes a proposal trustworthy: context, impact analysis, tests, isolation and a clear review trail.</p><div className="principle-list"><div><span>01</span><p><strong>Explain the why</strong><small>Risk signals and repair decisions remain inspectable.</small></p></div><div><span>02</span><p><strong>Prove the change</strong><small>Tests and validation results travel with the patch.</small></p></div><div><span>03</span><p><strong>Keep people in control</strong><small>Reviewers retain the final say before merge.</small></p></div></div><Link className="text-link" to="/dashboard">Enter the engineering workspace <ArrowRight size={16}/></Link></div>
    </section>

    <section className="final-cta" id="workspace"><div className="cta-backdrop"/><div className="cta-content" data-reveal><span className="eyebrow eyebrow-glass"><i/> 05 / START EXPLORING</span><h2>Make every code change<br/><em>easier to trust.</em></h2><p>Bring the error, the repository or the proposed change. Start with a clear question—and build toward verifiable engineering outcomes.</p><Link className="button-primary" to="/dashboard">Open DevMind workspace <ArrowRight size={16}/></Link></div><div className="cta-orbit cta-orbit-one"/><div className="cta-orbit cta-orbit-two"/></section>
    <SiteFooter/>
  </main>;
}

type Run = {id:number;title:string;description:string;repositoryUrl:string;status:string;mode:string;createdAt:string;resultJson:string};
function Workspace({ title }: { title: string }) {
 const [input,setInput]=useState(''); const [issueUrl,setIssueUrl]=useState(''); const [repo,setRepo]=useState(''); const [runs,setRuns]=useState<Run[]>([]); const [selected,setSelected]=useState<Run|null>(null); const [busy,setBusy]=useState(false); const [error,setError]=useState(''); const [online,setOnline]=useState(false);
 const refresh=async()=>{try{const response=await fetch('/api/runs');if(!response.ok)throw Error('Backend unavailable');setRuns(await response.json());setOnline(true);}catch{setOnline(false);}};
 useEffect(()=>{void refresh();},[]);
 const loadIssue=async()=>{setBusy(true);setError('');try{const r=await fetch('/api/github/issue?url='+encodeURIComponent(issueUrl));const d=await r.json();if(!r.ok)throw Error(d.error||'Unable to load issue');setInput(d.title+'\n\n'+d.description);setRepo(d.repositoryUrl);}catch(e){setError(String(e));}finally{setBusy(false);}};
 const submit=async()=>{setBusy(true);setError('');try{const r=await fetch('/api/runs',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({description:input,repositoryUrl:repo})});const d=await r.json();if(!r.ok)throw Error(d.error||'Request failed');setSelected(d);await refresh();}catch(e){setError(String(e));}finally{setBusy(false);}};
 const data=selected?JSON.parse(selected.resultJson):null;
 return <main className="workspace-page"><Link to="/" className="workspace-back">← Back to DevMind AI</Link><span className="eyebrow"><i/> WORKSPACE / CONNECTED DEMO</span><h1>{title}</h1><p className="workspace-lead">Spring Boot connected workflow with persistent local history. <strong>{online?'● Backend connected':'○ Backend offline'}</strong>. This is a clearly labelled demonstration, not autonomous code execution.</p>
 <div className="workspace-panel"><div className="workspace-panel-head"><span><TerminalSquare size={18}/> GitHub issue or development task</span><span className="preview-badge">DEMO MODE</span></div>
 <input className="dev-input" value={issueUrl} onChange={e=>setIssueUrl(e.target.value)} placeholder="Public GitHub issue URL (optional)"/><button className="dev-secondary" disabled={busy||!issueUrl.trim()} onClick={loadIssue}>Import public issue</button>
 <input className="dev-input" value={repo} onChange={e=>setRepo(e.target.value)} placeholder="Repository URL (optional)"/><textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Example: Add JWT authentication to this Spring Boot project"/><div className="workspace-panel-footer"><span>Never paste secrets. Demo does not modify or push repository code.</span><button className="button-primary" disabled={busy||!input.trim()} onClick={submit}>{busy?'Working…':'Run demo workflow'} <ArrowRight size={15}/></button></div>{error&&<div className="workspace-notice">{error}</div>}</div>
 {selected&&data&&<div className="workspace-panel"><div className="workspace-panel-head"><strong>Run #{selected.id}: {selected.title}</strong><span className="preview-badge">{selected.mode}</span></div><p>{data.summary}</p><h3>Implementation plan</h3><ol>{data.plan.map((x:string)=><li key={x}>{x}</li>)}</ol><h3>Agent execution</h3><div className="dev-stages">{data.stages.map((x:{name:string;status:string;detail:string})=><article key={x.name}><strong>{x.name} · {x.status}</strong><p>{x.detail}</p></article>)}</div><p><strong>Tests:</strong> {data.tests} · <strong>Pull request:</strong> {data.pullRequest}</p><small>{data.note}</small></div>}
 <div className="workspace-panel"><h3>Saved workflow history</h3>{runs.length===0?<p>No saved runs yet.</p>:runs.map(r=><button className="dev-history" key={r.id} onClick={()=>setSelected(r)}>#{r.id} · {r.title} <small>{new Date(r.createdAt).toLocaleString()} · {r.mode}</small></button>)}</div>
 <div className="workspace-hints"><div><BrainCircuit size={18}/><strong>6 agents</strong><span>Role-based demo pipeline</span></div><div><ShieldCheck size={18}/><strong>Reviewable</strong><span>Actual execution is never falsely reported</span></div><div><Workflow size={18}/><strong>Persistent</strong><span>Saved in backend H2 database</span></div></div></main>;
}

const agentInfo=[
{slug:'codebase',name:'Codebase Agent',description:'Capture repository structure and relevant source context.',hint:'Paste a Java project tree, pom.xml dependencies or repository notes.'},
{slug:'planner',name:'Planner Agent',description:'Break a GitHub issue into actionable engineering steps.',hint:'Describe the issue and its acceptance criteria.'},
{slug:'developer',name:'Developer Agent',description:'Prepare a focused implementation brief and file-change checklist.',hint:'Describe the intended code change and files.'},
{slug:'test',name:'Test Agent',description:'Prepare reproducible Maven and JUnit verification commands.',hint:'Paste test cases, acceptance criteria or Maven output.'},
{slug:'debugger',name:'Debugger Agent',description:'Triage error messages with bounded debugging steps.',hint:'Paste a stack trace or compiler error.'},
{slug:'reviewer',name:'Reviewer Agent',description:'Review change evidence and flag risks before human approval.',hint:'Paste the diff or describe the change.'}];
type AgentResult={id:number;agent:string;input:string;output:string;createdAt:string};
function AgentPage(){const {slug}=useParams();const a=agentInfo.find(x=>x.slug===slug);const [input,setInput]=useState('');const [out,setOut]=useState('');const [history,setHistory]=useState<AgentResult[]>([]);const [error,setError]=useState('');const [busy,setBusy]=useState(false);useEffect(()=>{if(!a)return;fetch('/api/agents/'+a.slug+'/history').then(r=>r.json()).then(setHistory).catch(()=>setError('Start the backend on port 8080.'));},[slug]);if(!a)return <main className="agent-page"><Link to="/">← Home</Link><h1>Agent not found</h1></main>;const submit=async()=>{setBusy(true);setError('');try{const r=await fetch('/api/agents/'+a.slug+'/execute',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({input})});const d=await r.json();if(!r.ok)throw Error(d.error||'Failed');setOut(d.output);setHistory(h=>[d,...h]);}catch(e){setError(String(e));}finally{setBusy(false)}};return <main className="agent-page"><nav><Link to="/">← DevMind AI</Link><Link to="/dashboard">Dashboard</Link></nav><span className="eyebrow">INDEPENDENT AGENT WORKSPACE / {a.slug.toUpperCase()}</span><h1>{a.name}</h1><p>{a.description}</p><div className="agent-workbench"><div className="workspace-panel"><h3>Input</h3><textarea value={input} onChange={e=>setInput(e.target.value)} placeholder={a.hint}/><button className="button-primary" disabled={!input.trim()||busy} onClick={submit}>{busy?'Working…':'Execute this stage'} →</button>{error&&<p role="alert">{error}</p>}<small>Rule-based demo stage. No external AI, repository write, test execution or PR is claimed.</small></div><div className="workspace-panel"><h3>Stage output</h3><pre className="agent-output">{out||'Results appear here after execution.'}</pre></div></div><div className="workspace-panel"><h3>Saved {a.name} history</h3>{history.map(h=><button className="dev-history" key={h.id} onClick={()=>setOut(h.output)}>#{h.id} · {new Date(h.createdAt).toLocaleString()} · {h.input.slice(0,90)}</button>)}</div><div className="agent-nav">{agentInfo.map(x=><Link key={x.slug} to={'/agents/'+x.slug}>{x.name} ↗</Link>)}</div></main>}
function PracticalTool({kind}:{kind:'secrets'|'risk'}){const [input,setInput]=useState('');const [result,setResult]=useState<any>(null);const [error,setError]=useState('');const run=async()=>{try{const r=await fetch('/api/tools/'+kind,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({input})});const d=await r.json();if(!r.ok)throw Error(d.error);setResult(d)}catch(e){setError(String(e))}};return <main className="agent-page"><Link to="/">← DevMind AI</Link><span className="eyebrow">REAL-WORLD ENGINEERING TOOL</span><h1>{kind==='secrets'?'Secret Shield':'Change Impact Radar'}</h1><p>{kind==='secrets'?'Detect credential patterns without sending pasted code to a third-party LLM.':'Get a transparent, explainable heuristic risk score before merging a change.'}</p><div className="workspace-panel"><textarea value={input} onChange={e=>setInput(e.target.value)} placeholder={kind==='secrets'?'Paste code or configuration here (use dummy credentials for class demo).':'Describe your planned changes, affected files and tests.'}/><button className="button-primary" onClick={run} disabled={!input.trim()}>Analyze →</button>{error&&<p>{error}</p>}{result&&<pre className="agent-output">{JSON.stringify(result,null,2)}</pre>}</div><small>Heuristic screening, not a security audit or proof of safety. Inputs are processed in memory and not saved by these endpoints.</small></main>}
export default function App() { return <Routes><Route path="/" element={<Landing/>}/><Route path="/agents/:slug" element={<AgentPage/>}/><Route path="/tools/secrets" element={<PracticalTool kind="secrets"/>}/><Route path="/tools/risk" element={<PracticalTool kind="risk"/>}/><Route path="/dashboard" element={<Workspace title="Engineering workspace"/>}/>{features.map((f) => <Route key={f.path} path={f.path} element={<Workspace title={f.title}/>}/>)}<Route path="*" element={<Workspace title="Page not found"/>}/></Routes>; }
