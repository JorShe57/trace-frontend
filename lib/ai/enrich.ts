import type {
  EnrichDiagnosisRequest,
  EnrichDiagnosisResponse,
  EnrichedDiagnosis,
} from '@/lib/api/types';
import { sanitizePath } from '@/lib/engine';
import { getClaudeModel, getPromptVersion, isAiEnrichmentEnabled } from '@/lib/env';
import { enrichWithClaude } from './claude';
import { buildDiagnosisContext } from './build-context';

function fallbackEnrichment(req: EnrichDiagnosisRequest): EnrichedDiagnosis {
  const { outcome } = req;
  return {
    summary: outcome.finding ?? outcome.title,
    finding: outcome.finding ?? outcome.title,
    steps: outcome.steps ?? [],
    tools: outcome.tools ?? [],
    safety: outcome.safety ?? null,
    confidence: 'medium',
    rationale: 'Static tree outcome — AI enrichment unavailable.',
    watchouts: [],
  };
}

export async function enrichDiagnosis(
  req: EnrichDiagnosisRequest,
): Promise<EnrichDiagnosisResponse> {
  const path = sanitizePath(req.path);
  const baseOutcomeId = req.outcome.nodeId;
  const sessionId = `sess_${path.join('_')}_${baseOutcomeId}`;

  if (!isAiEnrichmentEnabled()) {
    return {
      sessionId,
      enriched: fallbackEnrichment(req),
      source: 'fallback',
      baseOutcomeId,
    };
  }

  try {
    const context = buildDiagnosisContext({ ...req, path });
    const enriched = await enrichWithClaude(context);
    return {
      sessionId,
      enriched,
      source: 'claude',
      baseOutcomeId,
      model: getClaudeModel(),
      promptVersion: getPromptVersion(),
    };
  } catch (error) {
    console.error('[enrichDiagnosis]', error);
    return {
      sessionId,
      enriched: fallbackEnrichment(req),
      source: 'fallback',
      baseOutcomeId,
    };
  }
}
