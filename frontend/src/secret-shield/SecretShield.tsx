import React, { useMemo, useState } from 'react';
import { scanSecrets } from './api';
import type { SecretFinding, SecretScanResult, Severity } from './types';
import './secret-shield.css';

const demo = `// Synthetic demo values only (not real credentials)
const apiKey = "ghp_Q8w3ErT7yU1iO5pA9sD2fG6hJ4kL0zXcVb1";
const db = "postgres://demo:Zx9kLm2pQw8@localhost:5432/app";
POSTGRES_PASSWORD=Tr0ub4dor&3xK9
REDIS_PASSWORD: "r3d1s-Pa55-w0rd"
SAFE_ENV=\${DB_PASSWORD}
const safe = process.env.API_TOKEN;`;
const severityOrder: Severity[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'];
export interface SecretShieldProps { endpoint?: string; }
export default function SecretShield({ endpoint }: SecretShieldProps) {
  const [input, setInput] = useState(''); const [result, setResult] = useState<SecretScanResult | null>(null);
  const [loading, setLoading] = useState(false); const [error, setError] = useState('');
  const [severity, setSeverity] = useState('ALL'); const [type, setType] = useState('ALL');
  const types = useMemo(() => [...new Set(result?.findings.map(f => f.type) ?? [])], [result]);
  const findings = useMemo(() => (result?.findings ?? []).filter(f => (severity === 'ALL' || f.severity === severity) && (type === 'ALL' || f.type === type)).sort((a,b) => severityOrder.indexOf(a.severity)-severityOrder.indexOf(b.severity)), [result, severity, type]);
  async function runScan() { setError(''); setResult(null); if (!input.trim()) { setError('Paste code or text to scan first.'); return; } setLoading(true); try { setResult(await scanSecrets(input, endpoint)); } catch(e) { setError(e instanceof Error ? e.message : 'Scan failed. Try again.'); } finally { setLoading(false); } }
  function safeReport() { if (!result) return; const report = JSON.stringify({summary:result.summary,counts:{critical:result.critical,high:result.high,medium:result.medium,low:result.low,info:result.info},findings:result.findings.map(({id,ruleId,type,title,severity,confidenceScore,line,column,maskedValue,reason,remediation})=>({id,ruleId,type,title,severity,confidenceScore,line,column,maskedValue,reason,remediation}))},null,2); const blob = new Blob([report],{type:'application/json'}); const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='secret-shield-safe-report.json';a.click();URL.revokeObjectURL(a.href); }
  return <section className="ss-root">
    <header className="ss-header"><div><div className="ss-eyebrow">DEV MIND AI · SECURITY TOOL</div><h1>Secret Shield <span>🛡️</span></h1><p>Privacy-first secret detection and credential exposure analysis.</p></div><div className="ss-privacy"><span className="ss-dot"/>Local rule-based scan<br/><small>No external LLM</small></div></header>
    <div className="ss-notice"><strong>Privacy:</strong> The scanner uses local backend rules. Scan content is not sent to an external AI provider or intentionally persisted. Format detection does not validate whether a credential is active.</div>
    <div className="ss-workspace"><div className="ss-input-card"><div className="ss-card-title"><h2>Input workspace</h2><span>{new TextEncoder().encode(input).length.toLocaleString()} / 100 KB</span></div><textarea spellCheck={false} aria-label="Code or text to scan" placeholder="Paste source code, .env values, config, logs or connection strings…" value={input} onChange={e=>setInput(e.target.value)} /><div className="ss-actions"><button className="ss-secondary" onClick={()=>setInput(demo)}>Load synthetic example</button><button className="ss-secondary" onClick={()=>{setInput('');setResult(null);setError('')}}>Clear</button><button className="ss-primary" onClick={runScan} disabled={loading}>{loading?'Scanning…':'Scan input'}</button></div>{error&&<div role="alert" className="ss-error">{error}</div>}</div>
    {result && <div className="ss-results"><div className="ss-result-head"><div><h2>Scan report</h2><p>{result.summary}</p></div><button className="ss-secondary" onClick={safeReport}>Export safe report</button></div><div className="ss-metrics"><Metric label="Findings" value={result.totalFindings}/><Metric label="Critical" value={result.critical} tone="critical"/><Metric label="High" value={result.high} tone="high"/><Metric label="Medium" value={result.medium} tone="medium"/><Metric label="Low / Info" value={result.low+result.info}/></div><div className="ss-filters"><label>Severity <select value={severity} onChange={e=>setSeverity(e.target.value)}><option>ALL</option>{severityOrder.map(s=><option key={s}>{s}</option>)}</select></label><label>Type <select value={type} onChange={e=>setType(e.target.value)}><option>ALL</option>{types.map(t=><option key={t}>{t}</option>)}</select></label><span>{result.durationMs} ms · {result.inputBytes.toLocaleString()} bytes</span></div>{findings.length===0?<div className="ss-empty">No findings match these filters.</div>:<div className="ss-findings">{findings.map(f=><FindingCard key={f.id} finding={f}/>)}</div>}<details className="ss-details"><summary>Detectors and limitations</summary><p><b>Detectors:</b> {result.detectors.join(' · ')}</p><ul>{result.limitations.map(x=><li key={x}>{x}</li>)}</ul></details></div>}
    </div><footer className="ss-foot">Heuristic screening, not a security audit or proof of safety. Review findings manually; rotate confirmed exposed credentials.</footer>
  </section>;
}
function Metric({label,value,tone}:{label:string;value:number;tone?:string}){return <div className={`ss-metric ${tone??''}`}><span>{label}</span><b>{value}</b></div>}
function FindingCard({finding:f}:{finding:SecretFinding}){return <article className="ss-finding"><div className="ss-finding-top"><span className={`ss-badge ${f.severity.toLowerCase()}`}>{f.severity}</span><span className="ss-finding-type">{f.type}</span><span className="ss-loc">Line {f.line}{f.column>0 ? `, col ${f.column}` : ''}</span></div><h3>{f.title}</h3><code className="ss-masked">{f.maskedValue}</code><div className="ss-confidence"><span>Confidence {f.confidenceScore}/100 · {f.confidenceLevel}</span><div className="ss-bar"><i style={{width:`${f.confidenceScore}%`}}/></div></div><p>{f.reason}</p><div className="ss-remedy"><b>Recommended action</b><p>{f.remediation}</p></div><details><summary>Rule &amp; evidence</summary><p>Rule: {f.ruleId}</p>{f.evidence.map((e,i)=><p key={i}>{e}</p>)}</details></article>}
