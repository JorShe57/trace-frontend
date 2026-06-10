'use client';

import { useRef, useState } from 'react';
import { Button, Card, SectionLabel, Textarea } from '@/components/ui';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

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
        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
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
            messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-card px-3.5 py-2.5 text-[13px] leading-[1.55] ${
                    m.role === 'user'
                      ? 'border border-accent/30 bg-[var(--accent-dim)] text-text'
                      : 'border border-border2 bg-bg3 text-text'
                  }`}
                >
                  <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.05em] text-text3">
                    {m.role === 'user' ? 'You' : 'T.R.A.C.E.'}
                  </div>
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-card border border-border2 bg-bg3 px-3.5 py-2.5">
                <div className="text-[12.5px] text-text3">Reasoning…</div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {error && (
          <div className="mx-4 mb-2 rounded-lg border border-danger/30 bg-[var(--red-bg)] px-3 py-2 text-[12px] text-danger">
            {error}
          </div>
        )}

        <form
          className="flex gap-2 border-t border-border px-4 py-3"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a step, measurement, part, or what to try next…"
            rows={2}
            disabled={loading}
            className="resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
          />
          <Button type="submit" disabled={loading || !input.trim()} className="self-end">
            Send
          </Button>
        </form>
      </Card>
    </div>
  );
}
