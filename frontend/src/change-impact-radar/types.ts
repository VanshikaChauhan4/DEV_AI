export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export interface RiskSignal { id: string; label: string; points: number; explanation: string; matchedTerms: string[]; }
export interface RiskResult {
  score: number; level: RiskLevel; levelLabel: string; signals: RiskSignal[];
  testEvidence: string; recommendations: string[]; methodology: string; disclaimer: string;
}
