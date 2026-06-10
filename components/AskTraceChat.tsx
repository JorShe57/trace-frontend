'use client';

import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui';
import {
  ChatComposer,
  ChatMessageRow,
  ChatTypingIndicator,
  type ChatMessage,
} from '@/components/chat-ui';

/* General "Ask Trace" assistant — free-form HVAC/R field Q&A. Mirrors the
   report follow-up chat, but posts to /api/ask with no saved-report context.
   An optional initialQuestion (e.g. from a ?q= deep link on the dashboard) is
   auto-sent once on mount. */

const STARTER_PROMPTS = [
  'How do I test a thermocouple?',
  'How do I check a run capacitor?',
  'What causes a frozen evaporator coil?',
  'How do I read superheat on a fixed-orifice system?',
];

export function AskTraceChat({
  initialQuestion,
  minHeight = 440,
}: {
  initialQuestion?: string;
  /** Minimum height of the message area in px (smaller when embedded). */
  minHeight?: number;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  // Guards the one-time auto-send of an initial question (React strict mode
  // mounts effects twice in dev).
  const sentInitial = useRef(false);

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
      const res = await fetch('/api/ask', {
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

  useEffect(() => {
    if (initialQuestion && !sentInitial.current) {
      sentInitial.current = true;
      void sendMessage(initialQuestion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuestion]);

  return (
    <Card className="flex flex-col">
      <div
        className="flex-1 space-y-5 overflow-y-auto px-5 py-5"
        style={{ minHeight }}
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center py-8 text-center">
            <p className="mb-1 text-[14px] font-semibold text-text">
              Ask Trace
            </p>
            <p className="mb-5 max-w-[380px] text-[12px] leading-[1.55] text-text2">
              Ask any HVAC/R field question — how to test a component, what a reading should be,
              or how to troubleshoot a symptom.
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
        placeholder="Ask a field question — e.g. how do I test a thermocouple?"
      />
    </Card>
  );
}
