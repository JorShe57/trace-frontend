'use client';

import { useEffect, useRef } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

/* Shared chat presentation for the Trace assistants (Ask Trace + report
   follow-up). Mirrors the conventions of modern AI chat UIs: user turns are
   compact right-aligned bubbles, assistant turns are full-width rendered
   markdown with no bubble, and the composer is a rounded surface with an
   embedded send button. */

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/* ── Markdown rendering ──
   Assistant replies arrive as markdown (headings, lists, bold, tables,
   code). Each element is mapped onto the TRACE design tokens so the output
   reads as native UI rather than raw markup. */

const mdComponents: Components = {
  p: ({ children }) => <p className="mb-3 leading-[1.65] last:mb-0">{children}</p>,
  ul: ({ children }) => (
    <ul className="mb-3 list-disc space-y-1.5 pl-5 marker:text-text3 last:mb-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-3 list-decimal space-y-1.5 pl-5 marker:text-text3 last:mb-0">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="leading-[1.6] [&>ol]:mt-1.5 [&>ul]:mt-1.5">{children}</li>
  ),
  h1: ({ children }) => (
    <h1 className="mb-2 mt-5 text-[16px] font-semibold tracking-[-0.01em] text-text first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-2 mt-5 text-[15px] font-semibold tracking-[-0.01em] text-text first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-1.5 mt-4 text-[14px] font-semibold text-text first:mt-0">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="mb-1.5 mt-4 text-[13px] font-semibold text-text first:mt-0">{children}</h4>
  ),
  strong: ({ children }) => <strong className="font-semibold text-text">{children}</strong>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-accent underline decoration-accent/40 underline-offset-2 hover:text-accent2"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-3 border-l-2 border-accent/50 pl-3 text-text2 last:mb-0">
      {children}
    </blockquote>
  ),
  code: ({ children, className }) => (
    <code
      className={`rounded bg-bg4 px-1.5 py-0.5 font-mono text-[0.875em] text-text ${className ?? ''}`}
    >
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="mb-3 overflow-x-auto rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-[12px] leading-[1.6] last:mb-0 [&_code]:bg-transparent [&_code]:p-0">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="mb-3 overflow-x-auto last:mb-0">
      <table className="w-full border-collapse text-[12.5px]">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-border2 px-3 py-1.5 text-left font-semibold text-text">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-border px-3 py-1.5 align-top text-text2">{children}</td>
  ),
  hr: () => <hr className="my-4 border-border" />,
};

export function ChatMarkdown({ content }: { content: string }) {
  return (
    <div className="text-[13.5px] text-text">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

/* ── Message turns ── */

export function ChatMessageRow({ message }: { message: ChatMessage }) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] whitespace-pre-wrap rounded-2xl rounded-br-md border border-accent/20 bg-[var(--accent-dim)] px-4 py-2.5 text-[13.5px] leading-[1.6] text-text">
          {message.content}
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-3">
      <AssistantAvatar />
      <div className="min-w-0 flex-1 pt-0.5">
        <ChatMarkdown content={message.content} />
      </div>
    </div>
  );
}

function AssistantAvatar() {
  return (
    <div
      aria-hidden
      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-accent text-[11px] font-semibold text-[var(--accent-contrast)]"
    >
      T
    </div>
  );
}

export function ChatTypingIndicator() {
  return (
    <div className="flex gap-3">
      <AssistantAvatar />
      <div className="flex items-center gap-1 pt-2" aria-label="Assistant is responding">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-text3"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Composer ── */

export function ChatComposer({
  input,
  onInputChange,
  onSend,
  disabled,
  placeholder,
}: {
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Grow with content (and shrink back when the parent clears it on send).
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [input]);

  return (
    <form
      className="px-4 pb-4 pt-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSend();
      }}
    >
      <div className="flex items-end gap-2 rounded-2xl border border-border2 bg-bg3 px-3 py-2 transition-colors focus-within:border-accent">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={placeholder}
          rows={1}
          disabled={disabled}
          className="max-h-[160px] flex-1 resize-none bg-transparent py-1 text-[13.5px] leading-[1.5] text-text placeholder:text-text3 focus:outline-none disabled:opacity-50"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          aria-label="Send message"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-[var(--accent-contrast)] transition-colors hover:bg-accent2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M8 13V3m0 0L3.5 7.5M8 3l4.5 4.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <p className="mt-1.5 px-1 text-[11px] text-text3">
        Enter to send · Shift+Enter for a new line
      </p>
    </form>
  );
}
