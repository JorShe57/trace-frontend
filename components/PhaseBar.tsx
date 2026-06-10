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
      <span className={`h-[14px] w-[3px] flex-shrink-0 rounded ${pipClass(pip)}`} />
      <span className="text-[11px] font-medium uppercase tracking-[0.05em] text-text3">
        {phase}
      </span>
      {step != null && (
        <span className="ml-auto text-[11px] tracking-[0.06em] text-text3">
          Step {step}
        </span>
      )}
    </div>
  );
}
