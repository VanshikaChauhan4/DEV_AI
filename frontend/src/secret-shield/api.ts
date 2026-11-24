import type { SecretScanResult } from './types';

export async function scanSecrets(input: string, endpoint = '/api/tools/secrets'): Promise<SecretScanResult> {
  let response: Response;
  try {
    response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ input }) });
  } catch {
    throw new Error('Cannot reach the Secret Shield backend. Make sure it is running on port 8080.');
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.error || `Scan failed (${response.status})`);
  }
  const data = await response.json().catch(() => null);
  if (!data || !Array.isArray(data.findings)) throw new Error('Unexpected response from the Secret Shield backend.');
  return data;
}
