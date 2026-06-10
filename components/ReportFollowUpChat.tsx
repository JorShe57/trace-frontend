'use client';

import { useRef, useState } from 'react';
import { Card, SectionLabel } from '@/components/ui';
import {
  ChatComposer,
  ChatMessageRow,
  ChatTypingIndicator,
  type ChatMessage,
} from '@/components/chat-ui';

interface ReportFollowUpChatProps {
  reportId: string;
  reportTitle: string;
  finding?: string | null;
  firstStep?: string | null;
}

const STARTER_PROMPTS = [
  'Walk me through step 1 — what exactly should I check?',
  'What measurements should I take first?',
  'I tried the first step and it didn\'t fix it. What next?',
];

export function ReportFollowUpChat({
  reportId,
  reportTitle,
  finding,
  firstStep,
}: ReportFollowUpChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(nextMessages);
    setInput('');
    setError(null);
    setLoading(true);
    requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }));

    try {
      const res = await fetch(`/api/reports/${reportId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = (await res.json()) as { reply?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Request failed');
      setMessages([...nextMessages, { role: 'assistant', content: data.reply ?? '' }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
      requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }));
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="px-4 py-3">
        <SectionLabel>Context loaded</SectionLabel>
        <p className="text-[13px] font-medium text-text">{reportTitle}</p>
        {finding && (
          <p className="mt-1 text-[12px] leading-[1.5] text-text2">{finding}</p>
        )}
        {firstStep && (
          <p className="mt-2 text-[12.5px] text-text3">
            First step: {firstStep}
          </p>
        )}
      </Card>

      <Card className="flex min-h-[420px] flex-col">
        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-8 text-center">
              <p className="mb-1 text-[14px] font-semibold text-text">
                Field assistant
              </p>
              <p className="mb-5 max-w-[360px] text-[12px] leading-[1.55] text-text2">
                Ask about any step, measurement, or part from this report. The assistant
                knows your full diagnostic history and recommendations.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {STARTER_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    disabled={loading}
                    className="rounded-lg border border-border2 bg-bg3 px-3 py-1.5 text-left text-[11px] leading-[1.4] text-text2 transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, i) => <ChatMessageRow key={i} message={m} />)
          )}

          {loading && <ChatTypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {error && (
          <div className="mx-4 mb-2 rounded-lg border border-danger/30 bg-[var(--red-bg)] px-3 py-2 text-[12px] text-danger">
            {error}
          </div>
        )}

        <ChatComposer
          input={input}
          onInputChange={setInput}
          onSend={() => sendMessage(input)}
          disabled={loading}
          placeholder="Ask about a step, measurement, part, or what to try next…"
        />
      </Card>
    </div>
  );
}
