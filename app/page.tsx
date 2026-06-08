'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { readLastPath } from '@/lib/useDiagnostic';
import { buildHistory, getNode } from '@/lib/engine';
import { LogoMark, WordMark } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';

function readResume(): { href: string; label: string } | null {
  const last = readLastPath();
  if (!last) return null;
  const node = getNode(last[last.length - 1]);
  const history = buildHistory(last);
  const where =
    node && node.type === 'outcome'
      ? node.title
      : node && 'question' in node
        ? node.question
        : 'In progress';
  return {
    href: `/diagnostic/${last.join('/')}`,
    label: `${history.length} step${history.length === 1 ? '' : 's'} in · ${where}`,
  };
}

/** Landing screen: brand intro, primary start, and resume-last-session. */
export default function Home() {
  const resume = useSyncExternalStore(() => () => {}, readResume, () => null);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-[100] flex h-[52px] items-center gap-3 border-b border-border bg-bg2 px-5">
        <LogoMark />
        <div className="leading-tight">
          <WordMark />
          <div className="font-mono text-[9px] tracking-[0.08em] text-text3">
            Diagnostic Decision Tree
          </div>
        </div>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-shell flex-1 flex-col justify-center px-5 py-12">
        <div className="rounded-card border border-border2 bg-bg2 px-5 py-8 text-center">
          <div className="mb-1 font-head text-[28px] font-bold tracking-[0.2em] text-text">
            T<span className="text-accent">.</span>R<span className="text-accent">.</span>A
            <span className="text-accent">.</span>C<span className="text-accent">.</span>E
            <span className="text-accent">.</span>
          </div>
          <div className="mb-4 font-mono text-[11px] tracking-[0.08em] text-text3">
            Technician Reference &amp; Component Evaluation
          </div>
          <p className="mx-auto mb-7 max-w-[480px] text-[13px] leading-[1.6] text-text2">
            A guided field diagnostic. Start from the customer&rsquo;s complaint and walk the
            tree — controls, equipment, visual, then performance — to a likely cause, with the
            next steps, safety flags and tools you need.
          </p>

          <Link
            href="/diagnostic/start"
            className="inline-block rounded-[4px] border border-accent bg-[var(--accent-dim)] px-6 py-2.5 font-head text-[14px] font-semibold uppercase tracking-[0.1em] text-accent transition-colors hover:bg-[var(--accent-dim)]"
          >
            Start a diagnostic →
          </Link>
        </div>

        {resume && (
          <Link
            href={resume.href}
            className="mt-3 flex items-center gap-3 rounded-card border border-border bg-bg3 px-4 py-3 transition-colors hover:border-accent"
          >
            <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-text3">
              Resume
            </span>
            <span className="flex-1 truncate text-[12px] text-text2">{resume.label}</span>
            <span className="font-mono text-[12px] text-accent">→</span>
          </Link>
        )}
      </main>
    </div>
  );
}
