import type { HistoryEntry } from '@/lib/types';

export interface EnrichUnit {
  id: string;
  name: string;
}

export interface EnrichOutcomePayload {
  nodeId: string;
  title: string;
  finding?: string;
  safety?: string | null;
  steps?: string[];
  tools?: string[];
}

export interface EnrichDiagnosisRequest {
  path: string[];
  history: HistoryEntry[];
  unit: EnrichUnit | null;
  outcome: EnrichOutcomePayload;
  technicianNotes?: string;
}

export interface EnrichedDiagnosis {
  summary: string;
  finding: string;
  steps: string[];
  tools: string[];
  safety: string | null;
  confidence: 'high' | 'medium' | 'low';
  rationale: string;
  watchouts: string[];
}

export interface EnrichDiagnosisResponse {
  sessionId: string;
  enriched: EnrichedDiagnosis;
  source: 'claude' | 'fallback';
  baseOutcomeId: string;
  model?: string;
  promptVersion?: string;
}

export interface DiagnosticSessionPayload {
  path: string[];
  unitId?: string;
  outcomeId?: string;
  completedAt?: string;
  notes?: string;
  enrichment?: EnrichedDiagnosis;
  claudeModel?: string;
  promptVersion?: string;
  /** Optional links into the project tracker. */
  equipmentId?: string;
  jobId?: string;
  title?: string;
}

export interface SaveSessionResponse {
  id: string;
}
