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

/** One answered question in an AI-driven diagnostic session. */
export interface AiQAEntry {
  question: string;
  answer: string;
}

/** Equipment + complaint the AI session started from. */
export interface AiDiagnoseRequest {
  unit: EnrichUnit;
  complaint: string;
  history: AiQAEntry[];
  technicianNotes?: string;
}

export interface AiAnswerOption {
  label: string;
  sub: string | null;
  style: '' | 'yes' | 'warn' | 'no';
}

/** The AI wants another data point before concluding. */
export interface AiQuestionStep {
  kind: 'question';
  question: string;
  context: string;
  tip: string | null;
  phase: string;
  answers: AiAnswerOption[];
}

/** The AI has reached a diagnosis. */
export interface AiOutcomeStep {
  kind: 'outcome';
  title: string;
  icon: string | null;
  finding: string;
  steps: string[];
  tools: string[];
  safety: string | null;
  confidence: 'high' | 'medium' | 'low';
  rationale: string;
  watchouts: string[];
  phase: string;
}

export type AiDiagnosticStep = AiQuestionStep | AiOutcomeStep;

export interface AiDiagnoseResponse {
  step: AiDiagnosticStep;
  /** 'claude' when the model reasoned the step; 'unavailable' when AI is off or errored. */
  source: 'claude' | 'unavailable';
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
