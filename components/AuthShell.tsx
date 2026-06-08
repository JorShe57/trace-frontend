import type { ReactNode } from 'react';
import { LogoMark, WordMark } from '@/components/Logo';

/** Centred branded frame shared by the sign-in / sign-up screens. */
export function AuthShell({ tagline, children }: { tagline: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 py-12">
      <div className="mb-6 flex flex-col items-center gap-3 text-center">
        <LogoMark className="h-[38px] w-[38px]" />
        <div>
          <WordMark />
          <div className="mt-0.5 font-mono text-[9px] tracking-[0.08em] text-text3">{tagline}</div>
        </div>
      </div>
      <div className="w-full max-w-[380px]">{children}</div>
    </div>
  );
}
