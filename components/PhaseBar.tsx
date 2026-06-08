import type { PipColor } from '@/lib/types';
import { pipClass } from './styles';

interface PhaseBarProps {
  phase?: string;
  pip?: PipColor;
  step?: number;
}

/** The thin header strip on a step card: pip + phase label + step number. */
export function PhaseBar({ phase, pip = 'grey', step }: PhaseBarProps) {
  return (
    <div className="flex items-center gap-[7px] border-b border-border bg-white/[0.02] px-3.5 py-[7px]">
      <span className={`h-[14px] w-[3px] flex-shrink-0 rounded-[2px] ${pipClass(pip)}`} />
      <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-text3">
        {phase}
      </span>
      {step != null && (
        <span className="ml-auto font-mono text-[8px] tracking-[0.06em] text-text3">
          Step {step}
        </span>
      )}
    </div>
  );
}
