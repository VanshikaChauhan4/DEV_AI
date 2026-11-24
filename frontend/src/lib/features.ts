import { Activity, BrainCircuit, Check, Network, Radar, ShieldCheck, Sparkles } from 'lucide-react';
export const features = [
  { number: '01', title: 'RootCause Memory', tag: 'CONTEXT THAT COMPOUNDS', desc: 'Connect today’s failure to yesterday’s fix. Build a searchable memory of incidents, explanations and proven repairs.', path: '/rootcause', icon: BrainCircuit, metric: 'Relevant history, surfaced' },
  { number: '02', title: 'RepoTwin', tag: 'SEE THE RIPPLE EFFECT', desc: 'Map files, symbols and dependencies so you understand what a change touches before it reaches production.', path: '/repotwin', icon: Network, metric: 'Impact before merge' },
  { number: '03', title: 'Predictive Risk', tag: 'SIGNALS, NOT GUESSWORK', desc: 'Combine code churn, complexity, coverage and defect history into a risk score you can explain.', path: '/risk', icon: Radar, metric: 'Explainable risk signals' },
  { number: '04', title: 'AI Code Repair', tag: 'PATCHES WITH PROOF', desc: 'Turn a stack trace or failing test into a proposed, reviewable patch—with the reasoning attached.', path: '/repair', icon: Sparkles, metric: 'Human-reviewed changes' },
  { number: '05', title: 'TestTruth', tag: 'TEST THE TESTS', desc: 'Measure whether your test suite catches meaningful regressions, not just whether it turns green.', path: '/testtruth', icon: Activity, metric: 'Quality over checkbox coverage' },
  { number: '06', title: 'SafePatch', tag: 'ISOLATED BY DESIGN', desc: 'Validate changes in a restricted execution environment with clear resource and network boundaries.', path: '/safepatch', icon: ShieldCheck, metric: 'Safer verification loops' },
  { number: '07', title: 'Evidence Reports', tag: 'READY FOR REVIEW', desc: 'Bring the diff, tests, risk factors and validation evidence into one decision-ready engineering report.', path: '/reports', icon: Check, metric: 'One decision-ready report' },
];
const imgs = ['moonlit-bloom', 'polaris-landscape', 'luminous-valley', 'imagine-create', 'dreamscape-tree', 'strange-world', 'moonlit-bloom'];
export const featureImg = (i: number) => `/assets/images/${imgs[i]}.png`;
export const featureHue = (i: number) => (i === 6 ? 'hue-rotate(60deg)' : '');
