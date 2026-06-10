'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { LogoMark, WordMark } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';

function FeatureIcon({ children }: { children: ReactNode }) {
  return (
    <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent-dim)] text-accent">
      <svg
        viewBox="0 0 24 24"
        className="h-[18px] w-[18px]"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {children}
      </svg>
    </span>
  );
}

const FEATURES = [
  {
    title: 'Guided diagnostics',
    blurb:
      'Walk a complaint through controls, equipment, visual and performance checks to a likely cause — with next steps and safety flags.',
    icon: (
      <FeatureIcon>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </FeatureIcon>
    ),
  },
  {
    title: 'AI on every call',
    blurb:
      'Trace asks the right next question for your exact unit and symptoms, then explains its reasoning in the final report.',
    icon: (
      <FeatureIcon>
        <path d="M12 2a7 7 0 0 1 7 7c0 2.4-1.2 4.5-3 5.7V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.3C6.2 13.5 5 11.4 5 9a7 7 0 0 1 7-7z" />
        <line x1="9" y1="22" x2="15" y2="22" />
      </FeatureIcon>
    ),
  },
  {
    title: 'Jobs & reports',
    blurb:
      'Customers, sites, equipment and work orders in one place — every saved diagnostic linked to the job it came from.',
    icon: (
      <FeatureIcon>
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </FeatureIcon>
    ),
  },
];

/** Public landing screen: hero, feature grid, and auth CTAs. */
export function HomeLanding() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-[100] flex h-[56px] items-center gap-3 border-b border-border bg-bg2/90 px-5 backdrop-blur">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <LogoMark />
          <WordMark />
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

      <main className="relative flex-1 overflow-hidden">
        {/* Soft accent glow behind the hero. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[-200px] mx-auto h-[460px] max-w-[820px] rounded-full bg-accent opacity-[0.08] blur-[120px]"
        />

        <div className="relative mx-auto w-full max-w-[980px] px-5 pb-16 pt-16 sm:pt-24">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border2 bg-bg2 px-3 py-1 text-[12px] font-medium text-text2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              HVAC/R field diagnostics, powered by AI
            </span>

            <h1 className="mx-auto mt-6 max-w-[680px] text-[40px] font-semibold leading-[1.08] tracking-[-0.03em] text-text sm:text-[54px]">
              Diagnose faster in the field
            </h1>

            <p className="mx-auto mt-5 max-w-[560px] text-[15.5px] leading-[1.65] text-text2">
              Start from the customer&rsquo;s complaint and let Trace walk you to a likely cause —
              with the next steps, safety flags and tools you need. Save the report, link it to
              the job, move on to the next call.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-block rounded-lg bg-accent px-6 py-3 text-[14.5px] font-medium text-[var(--accent-contrast)] transition-colors hover:bg-accent2"
              >
                Get started free →
              </Link>
              <Link
                href="/login"
                className="inline-block rounded-lg border border-border2 bg-bg2 px-6 py-3 text-[14.5px] font-medium text-text2 transition-colors hover:bg-bg3 hover:text-text"
              >
                Sign in
              </Link>
            </div>

            <p className="mt-4 text-[12.5px] text-text3">
              TRACE — Technician Reference &amp; Component Evaluation
            </p>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-card border border-border bg-bg2 p-5 text-left shadow-card"
              >
                {f.icon}
                <h3 className="text-[14.5px] font-semibold tracking-[-0.01em] text-text">
                  {f.title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-[1.6] text-text2">{f.blurb}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
