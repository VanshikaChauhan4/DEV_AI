import type { RiskResult } from './types';
export async function analyzeChangeImpact(input: string, endpoint = '/api/tools/risk'): Promise<RiskResult> {
  const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ input }) });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.message || body?.error || `Risk analysis failed (${response.status})`);
  }
  return response.json();
}
