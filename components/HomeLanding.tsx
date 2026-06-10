'use client';

import Link from 'next/link';
import { LogoMark, WordMark } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';

/** Public landing screen: brand intro and sign-in / sign-up CTAs. */
export function HomeLanding() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-[100] flex h-[56px] items-center gap-3 border-b border-border bg-bg2/90 px-5 backdrop-blur">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <LogoMark />
          <div className="leading-tight">
            <WordMark />
            <div className="text-[11px] text-text3">Field Diagnostics</div>
          </div>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-lg px-3 py-1.5 text-[13px] font-medium text-text2 transition-colors hover:bg-bg3 hover:text-text"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-accent px-3 py-1.5 text-[13px] font-medium text-[var(--accent-contrast)] transition-colors hover:bg-accent2"
          >
            Create account
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-shell flex-1 flex-col justify-center px-5 py-12">
        <div className="rounded-card border border-border bg-bg2 px-6 py-10 text-center shadow-card">
          <div className="mb-4 flex justify-center">
            <LogoMark className="h-[44px] w-[44px] rounded-xl" />
          </div>
          <h1 className="mb-2 text-[28px] font-semibold tracking-[-0.02em] text-text">
            Diagnose faster in the field
          </h1>
          <div className="mb-4 text-[13px] text-text3">
            TRACE — Technician Reference &amp; Component Evaluation
          </div>
          <p className="mx-auto mb-7 max-w-[480px] text-[14px] leading-[1.65] text-text2">
            A guided field diagnostic. Start from the customer&rsquo;s complaint and walk the
            tree — controls, equipment, visual, then performance — to a likely cause, with the
            next steps, safety flags and tools you need.
          </p>

          <p className="mx-auto mb-5 max-w-[420px] text-[13px] text-text3">
            Sign in or create a profile to run diagnostics, save reports, and track jobs.
          </p>
          <div className="flex flex-col items-center gap-2.5 sm:flex-row sm:justify-center">
            <Link
              href="/login"
              className="inline-block rounded-lg bg-accent px-6 py-2.5 text-[14px] font-medium text-[var(--accent-contrast)] transition-colors hover:bg-accent2"
            >
              Sign in →
            </Link>
            <Link
              href="/signup"
              className="inline-block rounded-lg border border-border2 px-6 py-2.5 text-[14px] font-medium text-text2 transition-colors hover:bg-bg3 hover:text-text"
            >
              Create account
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
