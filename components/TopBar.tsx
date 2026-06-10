'use client';

import Link from 'next/link';
import { LogoMark, WordMark } from './Logo';
import { ThemeToggle } from './ThemeToggle';

interface TopBarProps {
  unitLabel: string;
  canGoBack: boolean;
  onBack: () => void;
  onRestart: () => void;
}

const barButton =
  'rounded-lg border border-border2 px-3 py-1.5 text-[12.5px] font-medium text-text2 transition-colors hover:bg-bg3 hover:text-text';

/** Sticky application header: brand, current unit, back / restart, theme. */
export function TopBar({ unitLabel, canGoBack, onBack, onRestart }: TopBarProps) {
  return (
    <header className="sticky top-0 z-[100] flex h-[56px] items-center gap-3 border-b border-border bg-bg2/90 px-5 backdrop-blur">
      <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90" title="Back to home">
        <LogoMark />
        <div className="leading-tight">
          <WordMark />
          <div className="text-[11px] text-text3">Field Diagnostics</div>
        </div>
      </Link>

      <span className="mx-1 hidden h-5 w-px bg-border2 sm:block" />
      <div className="hidden text-[13px] text-text2 sm:block">{unitLabel || '—'}</div>

      <div className="ml-auto flex items-center gap-2">
        <Link href="/" className={barButton}>
          Home
        </Link>
        {canGoBack && (
          <button type="button" onClick={onBack} className={barButton}>
            ← Back
          </button>
        )}
        <button type="button" onClick={onRestart} className={barButton}>
          ↺ Restart
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
