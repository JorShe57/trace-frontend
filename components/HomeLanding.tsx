'use client';

import Link from 'next/link';
import { LogoMark, WordMark } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';

/** Public landing screen: brand intro and sign-in / sign-up CTAs. */
export function HomeLanding() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-[100] flex h-[52px] items-center gap-3 border-b border-border bg-bg2 px-5">
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
          <LogoMark />
          <div className="leading-tight">
            <WordMark />
            <div className="font-mono text-[9px] tracking-[0.08em] text-text3">
              Diagnostic Decision Tree
            </div>
          </div>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-[3px] border border-border2 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-text2 transition-colors hover:border-accent hover:text-accent"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-[3px] border border-accent bg-[var(--accent-dim)] px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-accent transition-colors hover:bg-[var(--accent-faint)]"
          >
            Create account
          </Link>
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

          <p className="mx-auto mb-5 max-w-[420px] text-[12px] text-text3">
            Sign in or create a profile to run diagnostics, save reports, and track jobs.
          </p>
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
            <Link
              href="/login"
              className="inline-block rounded-[4px] border border-accent bg-[var(--accent-dim)] px-6 py-2.5 font-head text-[14px] font-semibold uppercase tracking-[0.1em] text-accent transition-colors hover:bg-[var(--accent-faint)]"
            >
              Sign in →
            </Link>
            <Link
              href="/signup"
              className="inline-block rounded-[4px] border border-border2 px-6 py-2.5 font-head text-[14px] font-semibold uppercase tracking-[0.1em] text-text2 transition-colors hover:border-accent hover:text-accent"
            >
              Create account
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
