import Anthropic from '@anthropic-ai/sdk';
import { getAnthropicApiKey, getClaudeModel } from '@/lib/env';
import { SYSTEM_PROMPT } from './prompts';
import { enrichedDiagnosisSchema, type EnrichedDiagnosisParsed } from './schemas';

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) client = new Anthropic({ apiKey: getAnthropicApiKey() });
  return client;
}

export async function enrichWithClaude(context: string): Promise<EnrichedDiagnosisParsed> {
  const model = getClaudeModel();
  const response = await getClient().messages.create({
    model,
    max_tokens: 2048,
    system: `${SYSTEM_PROMPT}\n\nReturn a single JSON object with fields: summary, finding, steps, tools, safety, confidence, rationale, watchouts. No markdown fences.`,
    messages: [
      {
        role: 'user',
        content: `Enrich this field diagnostic for the technician.\n\n${context}`,
      },
    ],
  });

  const text = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('');

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Claude response did not contain JSON');

  const parsed = JSON.parse(jsonMatch[0]) as unknown;
  return enrichedDiagnosisSchema.parse(parsed);
}
