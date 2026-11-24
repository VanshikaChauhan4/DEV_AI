export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
export interface SecretFinding {
  id: string; ruleId: string; type: string; title: string; severity: Severity;
  confidenceScore: number; confidenceLevel: string; line: number; column: number;
  maskedValue: string; reason: string; evidence: string[]; remediation: string;
  detectedBy: string[]; suppressed: boolean; suppressionReason?: string | null;
}
export interface SecretScanResult {
  status: string; scanId: string; totalFindings: number;
  critical: number; high: number; medium: number; low: number; info: number; suppressed: number;
  summary: string; durationMs: number; inputBytes: number; detectors: string[];
  limitations: string[]; findings: SecretFinding[];
}
