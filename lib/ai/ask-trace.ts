import Anthropic from '@anthropic-ai/sdk';
import { getAnthropicApiKey, getClaudeModel } from '@/lib/env';
import { ASK_TRACE_SYSTEM_PROMPT } from './ask-prompt';
import type { ChatMessage } from './follow-up-chat';

/* General-purpose "Ask Trace" Q&A. Unlike runFollowUpChat, there's no saved
   report context — just the technician's question history against the field
   assistant system prompt. */

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) client = new Anthropic({ apiKey: getAnthropicApiKey() });
  return client;
}

export async function runAskTrace(messages: ChatMessage[]): Promise<string> {
  const model = getClaudeModel();
  const response = await getClient().messages.create({
    model,
    max_tokens: 2048,
    system: ASK_TRACE_SYSTEM_PROMPT,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });

  const text = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('');

  if (!text.trim()) throw new Error('Empty response from Claude');
  return text.trim();
}
