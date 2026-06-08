import type { HistoryEntry } from '@/lib/types';

function answerColor(style: HistoryEntry['style']): string {
  if (style === 'warn') return 'text-warn';
  if (style === 'no') return 'text-danger';
  return 'text-accent';
}

/** The trail of answered questions above the current step. */
export function HistoryTrail({ history }: { history: HistoryEntry[] }) {
  if (history.length === 0) return null;
  return (
    <ol className="mb-5 flex flex-col gap-1.5">
      {history.map((h, i) => (
        <li
          key={`${h.nodeId}-${i}`}
          className="flex items-start gap-2.5 rounded-[5px] border border-border bg-bg3 px-3 py-[9px] opacity-70"
        >
          <span className="flex-1 text-[11px] leading-snug text-text2">{h.question}</span>
          <span className={`flex-shrink-0 whitespace-nowrap font-mono text-[11px] ${answerColor(h.style)}`}>
            {h.answer}
          </span>
        </li>
      ))}
    </ol>
  );
}
