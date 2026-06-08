import Anthropic from '@anthropic-ai/sdk';
import type { AiDiagnoseRequest, AiDiagnoseResponse } from '@/lib/api/types';
import {
  getAnthropicApiKey,
  getClaudeModel,
  getPromptVersion,
  hasAnthropicApiKey,
  isAiDiagnosisEnabled,
} from '@/lib/env';
import { DIAGNOSE_SYSTEM_PROMPT, buildTreeKnowledge } from './diagnose-prompt';
import { diagnosticStepSchema } from './step-schemas';

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!client) client = new Anthropic({ apiKey: getAnthropicApiKey() });
  return client;
}

/** Soft ceiling on questions before we ask the model to commit to a diagnosis. */
const MAX_QUESTIONS = 8;

function buildUserMessage(req: AiDiagnoseRequest): string {
  const lines: string[] = [];
  lines.push(`Equipment: ${req.unit.name} (id: ${req.unit.id})`);
  lines.push(`Customer complaint: ${req.complaint}`);
  lines.push('');

  if (req.history.length === 0) {
    lines.push('No questions asked yet — this is the first step. Ask the single best opening question for this complaint and equipment.');
  } else {
    lines.push('Answers so far:');
    req.history.forEach((qa, i) => {
      lines.push(`  ${i + 1}. Q: ${qa.question}`);
      lines.push(`     A: ${qa.answer}`);
    });
  }

  if (req.technicianNotes?.trim()) {
    lines.push('');
    lines.push(`Technician notes: ${req.technicianNotes.trim()}`);
  }

  lines.push('');
  if (req.history.length >= MAX_QUESTIONS) {
    lines.push('You have asked enough questions — return your best OUTCOME now, even at lower confidence.');
  } else {
    lines.push('Return the next QUESTION or, if the evidence is clear enough, the final OUTCOME.');
  }

  return lines.join('\n');
}

/**
 * Run one turn of the AI diagnostic. Returns the next question or a final
 * diagnosis. Never throws to the caller — on any failure or when AI is
 * disabled it reports `source: 'unavailable'` so the UI can fall back to the
 * classic guided tree.
 */
export async function runDiagnoseStep(req: AiDiagnoseRequest): Promise<AiDiagnoseResponse> {
  if (!isAiDiagnosisEnabled() || !hasAnthropicApiKey()) {
    return { step: unavailableStep(), source: 'unavailable' };
  }

  try {
    const model = getClaudeModel();
    const response = await getClient().messages.create({
      model,
      max_tokens: 1500,
      system: `${DIAGNOSE_SYSTEM_PROMPT}\n\n${buildTreeKnowledge()}`,
      messages: [{ role: 'user', content: buildUserMessage(req) }],
    });

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('');

    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Model response did not contain JSON');

    const step = diagnosticStepSchema.parse(JSON.parse(match[0]));
    return {
      step,
      source: 'claude',
      model,
      promptVersion: getPromptVersion(),
    };
  } catch (error) {
    console.error('[runDiagnoseStep]', error);
    return { step: unavailableStep(), source: 'unavailable' };
  }
}

/** A terminal step shown when the AI engine can't run. */
function unavailableStep(): AiDiagnoseResponse['step'] {
  return {
    kind: 'outcome',
    title: 'AI diagnosis unavailable',
    icon: '⚠',
    finding:
      'The AI diagnostic engine is not available right now (it may be disabled or the model could not be reached). You can still work the call using the classic guided decision tree.',
    steps: [
      'Switch to the guided diagnostic tree to continue manually',
      'Verify the ANTHROPIC_API_KEY and ENABLE_AI_DIAGNOSIS settings if this persists',
    ],
    tools: [],
    safety: null,
    confidence: 'low',
    rationale: 'Static fallback — AI engine unavailable.',
    watchouts: [],
    phase: 'System',
  };
}
