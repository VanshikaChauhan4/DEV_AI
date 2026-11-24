import { useEffect, useState } from 'react';
import { Link, Route, Routes, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BrainCircuit, Network, Radar, ShieldCheck, Sparkles, TerminalSquare, Workflow, Code2, ClipboardCheck, Bug, Eye } from 'lucide-react';
import { ParallaxComponent } from '../components/ui/parallax-scrolling';
import { FeatureWheel } from '../components/landing/FeatureWheel';
import { CurveCarousel } from '../components/landing/CurveCarousel';
import { features } from '../lib/features';
import SecretShield from '../secret-shield/SecretShield';
import ChangeImpactRadar from '../change-impact-radar/ChangeImpactRadar';

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
type AgentResult={id:number;agent:string;input:string;output:string;mode?:string;createdAt:string};
function AgentPage(){
  const {slug}=useParams();
  const a=agentInfo.find(x=>x.slug===slug);
  const [input,setInput]=useState('');
  const [sourceUrl,setSourceUrl]=useState('');
  const [importBusy,setImportBusy]=useState(false);
  const [out,setOut]=useState('');
  const [mode,setMode]=useState('');
  const [history,setHistory]=useState<AgentResult[]>([]);
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);
  const [aiStatus,setAiStatus]=useState<{available:boolean;model:string;provider:string;message:string}|null>(null);
  useEffect(()=>{
    if(!a)return;
    fetch('/api/agents/'+a.slug+'/history').then(r=>r.json()).then(setHistory).catch(()=>setError('Backend unavailable. Start Spring Boot on port 8080.'));
    fetch('/api/ai/status').then(r=>r.json()).then(setAiStatus).catch(()=>setAiStatus(null));
  },[slug]);
  if(!a)return <main className="agent-page"><Link to="/">← Home</Link><h1>Agent not found</h1></main>;
  const importContext=async()=>{
    if(!sourceUrl.trim())return;
    setImportBusy(true);setError('');
    try{
      const endpoint=a.slug==='codebase'?'/api/github/repository?url=':'/api/github/issue?url=';
      const r=await fetch(endpoint+encodeURIComponent(sourceUrl.trim()));
      const d=await r.json();if(!r.ok)throw Error(d.error||'GitHub import failed');
      if(a.slug==='codebase')setInput(JSON.stringify(d,null,2));
      else setInput('GitHub issue: '+d.title+'\\nRepository: '+d.repositoryUrl+'\\n\\n'+(d.description||'(No issue description provided)'));
    }catch(e){setError(e instanceof Error?e.message:String(e));}
    finally{setImportBusy(false);}
  };
  const submit=async()=>{
    setBusy(true);setError('');
    try{
      const r=await fetch('/api/agents/'+a.slug+'/execute',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({input})});
      const d=await r.json();if(!r.ok)throw Error(d.error||'Agent request failed');
      setOut(d.output);setMode(d.mode||'RULE_BASED_FALLBACK');setHistory(h=>[d,...h]);
    }catch(e){setError(e instanceof Error?e.message:String(e));}
    finally{setBusy(false);}
  };
  const examples={
    codebase:['Analyze this repository context: Spring Boot 3, Java 21, React/Vite. backend has controller, service, repository layers.','Repository URL: https://github.com/owner/repo — what context should I collect to map the codebase?'],
    planner:['Issue: Add JWT authentication. Acceptance: login endpoint, invalid token rejected, role-based access, unit tests.','Issue: Add pagination to the products API. Requirements: page/size, stable sorting, invalid page validation.'],
    developer:['Implement a password reset flow in Spring Boot. Include proposed classes, pseudocode, validation, and tests.','Add request rate limiting to the public API. Outline a safe implementation and likely file changes.'],
    test:['Feature: JWT authentication. Test successful login, invalid password, expired token, missing token, role authorization.','Bug: pagination returns duplicate items. Suggest regression tests and Maven commands.'],
    debugger:['Error: java.lang.NullPointerException at UserService.java:42. It occurs after user lookup. Help triage.','Build error: cannot find symbol method getUserId() in UserDto. Analyze likely causes and steps.'],
    reviewer:['Review this change: Controller accepts userId from request body and returns the account profile without checking ownership.','Review diff/context: added SQL migration, modified login permissions, but no tests were added.']
  };
  const exampleList=(examples as Record<string,string[]>)[a.slug]||[];
  const AgentIcon=({code}:{code:string})=> code==='codebase'?<Code2 size={20}/>:code==='planner'?<BrainCircuit size={20}/>:code==='developer'?<Sparkles size={20}/>:code==='test'?<ClipboardCheck size={20}/>:code==='debugger'?<Bug size={20}/>:<Eye size={20}/>;
  const descriptionBySlug:Record<string,string>={codebase:'Map architecture and understand the files and dependencies supplied as context.',planner:'Convert an engineering issue into an ordered, reviewable implementation plan.',developer:'Draft an implementation approach and sample code without claiming files were changed.',test:'Build a test matrix and commands. Clearly separate proposed tests from executed tests.',debugger:'Analyze stack traces and symptoms, rank likely causes, and give reproducible diagnosis steps.',reviewer:'Review supplied code or change context for risks and actionable findings.'};
  return <main className="agent-page">
    <nav className="agent-top-nav"><Link to="/">← DevMind AI</Link><Link to="/dashboard">Workflow Dashboard</Link><Link to="/tools/secrets">Secret Shield</Link><Link to="/tools/risk">Change Impact Radar</Link></nav>
    <div className="agent-title-row"><div className="agent-title-icon"><AgentIcon code={a.slug}/></div><div><span className="eyebrow">SPECIALIST WORKSPACE / {a.slug.toUpperCase()}</span><h1>{a.name}</h1></div></div>
    <p className="agent-intro">{descriptionBySlug[a.slug]||a.description}</p>
    <div className="agent-status-row"><span className={'agent-ai-status '+(aiStatus?.available?'is-online':'is-offline')}>{aiStatus?.available?'● AI provider configured':'○ AI provider not configured'}</span><span>{aiStatus?`${aiStatus.provider} · ${aiStatus.model}`:'Checking AI provider…'}</span><span className="agent-safe-note">AI output is a proposal — no repository is modified</span></div>
    <div className="agent-workbench agent-workbench-enhanced">
      <section className="workspace-panel agent-input-panel"><div className="agent-panel-heading"><span className="agent-panel-index">01</span><div><h3>Context & instructions</h3><p>Provide relevant context for this specialist.</p></div></div>
      <div className="agent-example-pills">{exampleList.map((ex,i)=><button key={i} onClick={()=>setInput(ex)}>Use example {i+1}</button>)}</div>
      {(a.slug==='codebase'||a.slug==='planner')&&<div className="agent-import-row"><input value={sourceUrl} onChange={e=>setSourceUrl(e.target.value)} placeholder={a.slug==='codebase'?'Public GitHub repository URL':'Public GitHub issue URL'}/><button className="dev-secondary" disabled={!sourceUrl.trim()||importBusy} onClick={importContext}>{importBusy?'Importing…':a.slug==='codebase'?'Import repository context':'Import issue'}</button></div>}
      <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder={a.hint}/>
      <div className="agent-input-footer"><small>{input.length.toLocaleString()} characters · Do not include real secrets</small><button className="button-primary" disabled={!input.trim()||busy} onClick={submit}>{busy?'Analyzing…':'Run '+a.name} <ArrowRight size={16}/></button></div>
      {error&&<p className="agent-error" role="alert">{error}</p>}
      <div className="agent-guardrail"><ShieldCheck size={17}/><span>Human approval required. This workspace does not clone, write, execute or push code.</span></div></section>
      <section className="workspace-panel agent-result-panel"><div className="agent-panel-heading"><span className="agent-panel-index">02</span><div><h3>Analysis output</h3><p>Structured results and actionable recommendations.</p></div></div>{out?<><div className={'agent-result-mode '+((mode==='AI_GENERATED'||mode==='LOCAL_AI')?'mode-ai':'mode-fallback')}>{(mode==='AI_GENERATED'||mode==='LOCAL_AI')?'✦ AI-generated response':'◇ Rule-based fallback · AI provider unavailable'}</div><pre className="agent-output">{out}</pre></>:<div className="agent-empty-result"><div className="agent-empty-orbit"><AgentIcon code={a.slug}/></div><strong>Your result will appear here</strong><p>Enter context, then run this specialist agent.</p></div>}</section>
    </div>
    <section className="workspace-panel agent-history-panel"><div className="agent-panel-heading"><span className="agent-panel-index">03</span><div><h3>Saved execution history</h3><p>{history.length} saved runs · stored in the local database</p></div></div>{history.length===0?<p className="agent-history-empty">No runs saved yet.</p>:history.map(h=><button className="dev-history agent-history-item" key={h.id} onClick={()=>{setInput(h.input);setOut(h.output);setMode(h.mode||'RULE_BASED_FALLBACK')}}><span><b>Run #{h.id}</b><small>{new Date(h.createdAt).toLocaleString()}</small></span><span className="agent-history-mode">{(h.mode==='AI_GENERATED'||h.mode==='LOCAL_AI')?'AI GENERATED':'FALLBACK'}</span><span className="agent-history-preview">{h.input.slice(0,120)}{h.input.length>120?'…':''}</span></button>)}</section>
    <div className="agent-nav">{agentInfo.map(x=><Link key={x.slug} className={x.slug===a.slug?'active-agent':''} to={'/agents/'+x.slug}>{x.name} ↗</Link>)}</div>
  </main>;
}
export default function App() { return <Routes><Route path="/" element={<Landing/>}/><Route path="/agents/:slug" element={<AgentPage/>}/><Route path="/tools/secrets" element={<SecretShield/>}/><Route path="/tools/risk" element={<ChangeImpactRadar/>}/><Route path="/dashboard" element={<Workspace title="Engineering workspace"/>}/>{features.map((f) => <Route key={f.path} path={f.path} element={<Workspace title={f.title}/>}/>)}<Route path="*" element={<Workspace title="Page not found"/>}/></Routes>; }
