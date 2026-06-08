'use client';

import type { OutcomeNode } from '@/lib/types';

interface OutcomeProps {
  node: OutcomeNode;
  unitName?: string;
  onBack: () => void;
  onRestart: () => void;
}

/** Terminal diagnosis card: finding, safety flag, steps and tools. */
export function Outcome({ node, unitName, onBack, onRestart }: OutcomeProps) {
  const danger = Boolean(node.safety);
  return (
    <section
      data-screen-label="Outcome"
      className={`overflow-hidden rounded-card border bg-bg2 ${danger ? 'border-danger' : 'border-accent'}`}
    >
      <header
        className={`flex items-center gap-2 border-b px-4 py-3 ${
          danger
            ? 'border-danger/20 bg-[var(--red-bg)]'
            : 'border-accent/20 bg-[var(--accent-dim)]'
        }`}
      >
        <span className="text-[18px]" aria-hidden="true">
          {node.icon || '◈'}
        </span>
        <div className="min-w-0 flex-1">
          <h1
            className={`font-head text-[18px] font-bold tracking-[0.06em] ${
              danger ? 'text-danger' : 'text-accent'
            }`}
          >
            {node.title}
          </h1>
          <div className="mt-px font-mono text-[9px] text-text2">
            {[node.phase, unitName].filter(Boolean).join(' · ')}
          </div>
        </div>
      </header>

      <div className="p-4">
        {node.safety && (
          <div className="mb-2.5 flex items-start gap-2 rounded-[4px] border border-danger/30 bg-[var(--red-bg)] px-3 py-[9px] text-[12px] leading-[1.5] text-danger">
            <span className="flex-shrink-0" aria-hidden="true">
              ⚠
            </span>
            <span>{node.safety}</span>
          </div>
        )}

        <Section label="Finding">
          <p className="text-[13px] leading-[1.6] text-text">{node.finding}</p>
        </Section>

        {node.steps && node.steps.length > 0 && (
          <>
            <Divider />
            <Section label="Next steps">
              <ol className="flex flex-col gap-1.5">
                {node.steps.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 rounded-[4px] border border-border2 bg-bg3 px-3 py-[9px] text-[12px] leading-[1.5] text-text"
                  >
                    <span className="mt-px flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full border border-accent/30 bg-[var(--accent-dim)] font-mono text-[9px] text-accent">
                      {i + 1}
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </Section>
          </>
        )}

        {node.tools && node.tools.length > 0 && (
          <>
            <Divider />
            <Section label="Tools needed">
              <p className="font-mono text-[12px] leading-[1.6] text-accent">
                {node.tools.join(' · ')}
              </p>
            </Section>
          </>
        )}
      </div>

      <footer className="flex gap-2 border-t border-border bg-bg3 px-4 py-2.5">
        <button
          type="button"
          onClick={onBack}
          className="rounded-[3px] border border-border2 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-text3 transition-colors hover:border-border hover:text-text2"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="rounded-[3px] border border-accent bg-[var(--accent-dim)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-accent transition-colors hover:bg-[var(--accent-dim)]"
        >
          ↺ Restart
        </button>
      </footer>
    </section>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3.5 last:mb-0">
      <div className="mb-1.5 font-mono text-[8px] uppercase tracking-[0.12em] text-text3">
        {label}
      </div>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="my-3 h-px bg-border" />;
}
