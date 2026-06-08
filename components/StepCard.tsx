'use client';

import type { ChoiceNode, YesNoNode } from '@/lib/types';
import { PhaseBar } from './PhaseBar';
import { answerClass } from './styles';

interface StepCardProps {
  node: YesNoNode | ChoiceNode;
  step: number;
  onAnswer: (nextId: string) => void;
}

/** A question step — renders a Yes/No pair or a list of choices. */
export function StepCard({ node, step, onAnswer }: StepCardProps) {
  return (
    <section
      data-screen-label={`Step ${step}`}
      className="mb-4 overflow-hidden rounded-card border border-border bg-bg2"
    >
      <PhaseBar phase={node.phase} pip={node.phasePip} step={step} />

      <div className="px-4 pb-3.5 pt-[18px]">
        <h1 className="mb-1.5 font-head text-[20px] font-semibold leading-[1.3] tracking-[0.03em] text-text">
          {node.question}
        </h1>
        {node.context && (
          <p className="mb-4 text-[12px] leading-[1.55] text-text2">{node.context}</p>
        )}
        {node.tip && (
          <div
            className="rich mb-4 rounded-[0_4px_4px_0] border-l-2 border-accent bg-[var(--accent-faint)] px-3 py-2 text-[11px] leading-[1.5] text-text2"
            dangerouslySetInnerHTML={{ __html: node.tip }}
          />
        )}

        {node.type === 'yn' ? (
          <YesNo node={node} onAnswer={onAnswer} />
        ) : (
          <ChoiceList node={node} onAnswer={onAnswer} />
        )}
      </div>
    </section>
  );
}

function YesNo({ node, onAnswer }: { node: YesNoNode; onAnswer: (id: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        data-answer="yes"
        onClick={() => onAnswer(node.yes)}
        className="rounded-[5px] border border-border2 bg-bg3 py-3.5 text-center font-head text-[18px] font-bold tracking-[0.06em] text-accent transition-colors hover:border-accent hover:bg-[var(--accent-dim)]"
      >
        Yes
      </button>
      <button
        type="button"
        data-answer="no"
        onClick={() => onAnswer(node.no)}
        className="rounded-[5px] border border-border2 bg-bg3 py-3.5 text-center font-head text-[18px] font-bold tracking-[0.06em] text-danger transition-colors hover:border-danger hover:bg-[var(--red-bg)]"
      >
        No
      </button>
      {node.unsure && (
        <button
          type="button"
          data-answer="unsure"
          onClick={() => onAnswer(node.unsure!)}
          className="col-span-2 rounded-[5px] border border-border2 bg-bg3 py-3.5 text-center font-body text-[13px] text-text3 transition-colors hover:border-border hover:text-text2"
        >
          Not sure / Need to check
        </button>
      )}
    </div>
  );
}

function ChoiceList({ node, onAnswer }: { node: ChoiceNode; onAnswer: (id: string) => void }) {
  return (
    <div className="flex flex-col gap-[7px]">
      {node.answers.map((a, i) => (
        <button
          key={`${a.next}-${i}`}
          type="button"
          onClick={() => onAnswer(a.next)}
          className={`flex items-center gap-2.5 rounded-[5px] border bg-bg3 px-4 py-3 text-left text-[13px] leading-[1.4] text-text transition-colors ${answerClass(a.style)}`}
        >
          <span className="flex-1">
            {a.label}
            {a.sub && <span className="mt-0.5 block text-[10px] text-text3">{a.sub}</span>}
          </span>
        </button>
      ))}
    </div>
  );
}
