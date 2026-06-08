import Anthropic from '@anthropic-ai/sdk';
import { getAnthropicApiKey, getClaudeModel } from '@/lib/env';
import { FOLLOW_UP_SYSTEM_PROMPT } from './follow-up-prompt';

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) client = new Anthropic({ apiKey: getAnthropicApiKey() });
  return client;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function runFollowUpChat(
  reportContext: string,
  messages: ChatMessage[],
): Promise<string> {
  const model = getClaudeModel();
  const response = await getClient().messages.create({
    model,
    max_tokens: 2048,
    system: `${FOLLOW_UP_SYSTEM_PROMPT}\n\n---\nSAVED REPORT CONTEXT\n---\n${reportContext}`,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const text = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('');

  if (!text.trim()) throw new Error('Empty response from Claude');
  return text.trim();
}
