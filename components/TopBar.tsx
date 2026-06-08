'use client';

import { LogoMark, WordMark } from './Logo';
import { ThemeToggle } from './ThemeToggle';

interface TopBarProps {
  unitLabel: string;
  canGoBack: boolean;
  onBack: () => void;
  onRestart: () => void;
}

/** Sticky application header: brand, current unit, back / restart, theme. */
export function TopBar({ unitLabel, canGoBack, onBack, onRestart }: TopBarProps) {
  return (
    <header className="sticky top-0 z-[100] flex h-[52px] items-center gap-3 border-b border-border bg-bg2 px-5">
      <LogoMark />
      <div className="leading-tight">
        <WordMark />
        <div className="font-mono text-[9px] tracking-[0.08em] text-text3">
          Diagnostic Decision Tree
        </div>
      </div>

      <span className="mx-1 hidden h-5 w-px bg-border2 sm:block" />
      <div className="hidden font-mono text-[11px] text-text2 sm:block">
        {unitLabel || '—'}
      </div>

      <div className="ml-auto flex items-center gap-2.5">
        {canGoBack && (
          <button
            type="button"
            onClick={onBack}
            className="rounded-[3px] border border-border2 px-3 py-[5px] font-head text-[11px] font-semibold uppercase tracking-[0.1em] text-text3 transition-colors hover:border-accent hover:text-accent"
          >
            ← Back
          </button>
        )}
        <button
          type="button"
          onClick={onRestart}
          className="rounded-[3px] border border-border2 px-3 py-[5px] font-head text-[11px] font-semibold uppercase tracking-[0.1em] text-text3 transition-colors hover:border-accent hover:text-accent"
        >
          ↺ Restart
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
