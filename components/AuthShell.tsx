import type { ReactNode } from 'react';
import { LogoMark, WordMark } from '@/components/Logo';

/** Centred branded frame shared by the sign-in / sign-up screens. */
export function AuthShell({ tagline, children }: { tagline: string; children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-12">
      {/* Soft accent glow behind the card. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-220px] h-[420px] w-[640px] rounded-full bg-accent opacity-[0.07] blur-[120px]"
      />
      <div className="relative mb-7 flex flex-col items-center gap-3 text-center">
        <LogoMark className="h-[42px] w-[42px] rounded-xl" />
        <div>
          <WordMark className="text-[21px]" />
          <div className="mt-1 text-[13px] text-text3">{tagline}</div>
        </div>
      </div>
      <div className="relative w-full max-w-[392px]">{children}</div>
    </div>
  );
}
