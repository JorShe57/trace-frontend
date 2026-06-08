'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { useAiDiagnostic } from '@/lib/useAiDiagnostic';
import { TREE, ROOT_ID } from '@/lib/engine';
import type { ChoiceNode, HistoryEntry, UnitSelectNode } from '@/lib/types';
import { formatEquipmentContext } from '@/lib/equipment';
import { TopBar } from './TopBar';
import { ProgressBar } from './ProgressBar';
import { HistoryTrail } from './HistoryTrail';
import { StepCard } from './StepCard';
import { UnitSelect } from './UnitSelect';
import { EquipmentInfo } from './EquipmentInfo';
import { AiOutcome } from './AiOutcome';

const MAX_DEPTH = 8;

/**
 * AI-driven diagnostic. Equipment and complaint are picked from the existing
 * tree's entry data; from there the model reasons one step at a time. State is
 * held in React (AI steps aren't addressable URL nodes), but the look matches
 * the guided tree by reusing the same step components.
 */
/**
 * Gate the session behind a client-only mount check. This keeps the resume
 * snapshot read (localStorage, inside useAiDiagnostic) off the server render,
 * so there's no hydration mismatch and no setState-in-effect.
 */
export function AiDiagnosticView({ jobId }: { jobId?: string }) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  if (!mounted) return <div className="min-h-screen" aria-hidden />;
  return <AiDiagnosticSession jobId={jobId} />;
}

function AiDiagnosticSession({ jobId }: { jobId?: string }) {
  const dx = useAiDiagnostic(jobId);
  const {
    phase,
    unit,
    equipment,
    complaints,
    complaint,
    answered,
    current,
    isOutcome,
    loading,
    error,
    source,
    model,
    promptVersion,
    selectUnit,
    setEquipment,
    selectComplaint,
    answer,
    back,
    restart,
    retry,
    clearResume,
  } = dx;

  const startNode = TREE[ROOT_ID] as UnitSelectNode;
  const canGoBack = phase !== 'equipment';

  const progress = isOutcome
    ? 100
    : phase === 'equipment'
      ? 0
      : Math.min(((answered.length + 1) / MAX_DEPTH) * 100, 95);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [phase, answered.length, isOutcome]);

  // History trail: completed AI questions with the chosen answer + its style.
  const history: HistoryEntry[] = answered.map((a, i) => {
    const chosen = a.step.answers.find((opt) => opt.label === a.answer);
    return {
      nodeId: `ai-${i}`,
      question: a.step.question,
      answer: a.answer,
      style: chosen?.style ?? '',
      phase: a.step.phase,
    };
  });
  if (complaint) {
    history.unshift({
      nodeId: 'complaint',
      question: 'Customer complaint',
      answer: complaint,
      style: '',
      phase: 'Intake',
    });
  }
  const equipmentLine = formatEquipmentContext(equipment);
  if (equipmentLine) {
    history.unshift({
      nodeId: 'equipment-info',
      question: 'Equipment',
      answer: equipmentLine,
      style: '',
      phase: 'Intake',
    });
  }

  // The current AI question rendered through the shared StepCard.
  const questionNode: ChoiceNode | null =
    current?.kind === 'question'
      ? {
          type: 'choice',
          question: current.question,
          context: current.context || undefined,
          tip: current.tip || undefined,
          phase: current.phase || 'Diagnosing',
          phasePip: 'grey',
          answers: current.answers.map((opt) => ({
            label: opt.label,
            sub: opt.sub || undefined,
            style: opt.style,
            next: opt.label,
          })),
        }
      : null;

  // The complaint picker, sourced from the tree but rendered as a step.
  const complaintNode: ChoiceNode = {
    type: 'choice',
    question: 'What is the customer’s complaint?',
    context: `${unit?.name ?? ''} — what are they reporting? This is where the AI starts reasoning.`,
    phase: 'Customer Intake',
    phasePip: 'grey',
    answers: complaints.map((c) => ({
      label: c.label,
      sub: c.sub,
      style: '' as const,
      next: c.label,
    })),
  };

  return (
    <div className="min-h-screen">
      <TopBar
        unitLabel={unit ? `${unit.icon} ${unit.name}` : ''}
        canGoBack={canGoBack}
        onBack={back}
        onRestart={restart}
      />
      <ProgressBar value={progress} />

      <main className="mx-auto max-w-shell px-5 pb-16 pt-7">
        <HistoryTrail history={history} />

        {phase === 'equipment' && (
          <UnitSelect
            node={startNode}
            onSelect={(next) => {
              const u = dx.units.find((x) => x.next === next);
              if (u) selectUnit(u);
            }}
          />
        )}

        {phase === 'equipment-info' && (
          <EquipmentInfo unitName={unit?.name} step={1} onSubmit={setEquipment} />
        )}

        {phase === 'complaint' && (
          <StepCard node={complaintNode} step={1} onAnswer={selectComplaint} />
        )}

        {phase === 'diagnosing' && (
          <>
            {loading && <ThinkingCard count={answered.length + 1} />}

            {!loading && error && (
              <ErrorCard message={error} onRetry={retry} />
            )}

            {!loading && !error && questionNode && (
              <StepCard node={questionNode} step={answered.length + 1} onAnswer={answer} />
            )}

            {!loading && !error && current?.kind === 'outcome' && (
              <AiOutcome
                step={current}
                unitId={unit?.id}
                unitName={unit?.name}
                complaint={complaint ?? undefined}
                equipment={equipment}
                source={source}
                model={model}
                promptVersion={promptVersion}
                jobId={jobId}
                onBack={back}
                onRestart={restart}
                onSaved={clearResume}
              />
            )}
          </>
        )}

        <p className="mt-5 text-center font-mono text-[9px] tracking-[0.06em] text-text3">
          AI-driven diagnosis · the model adapts each question to your answers
        </p>
      </main>
    </div>
  );
}

function ThinkingCard({ count }: { count: number }) {
  return (
    <section className="mb-4 overflow-hidden rounded-card border border-border bg-bg2">
      <div className="flex items-center gap-[7px] border-b border-border bg-white/[0.02] px-3.5 py-[7px]">
        <span className="h-[14px] w-[3px] flex-shrink-0 rounded-[2px] bg-accent" />
        <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-text3">
          Reasoning
        </span>
        <span className="ml-auto font-mono text-[8px] tracking-[0.06em] text-text3">
          Step {count}
        </span>
      </div>
      <div className="px-4 pb-5 pt-[18px]">
        <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.12em] text-text3">
          Working out the next check…
        </div>
        <div className="h-2.5 animate-pulse rounded bg-border2" />
        <div className="mt-2 h-2.5 w-4/5 animate-pulse rounded bg-border2" />
        <div className="mt-2 h-2.5 w-3/5 animate-pulse rounded bg-border2" />
      </div>
    </section>
  );
}

function ErrorCard({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <section className="mb-4 overflow-hidden rounded-card border border-danger/40 bg-bg2">
      <div className="px-4 py-5">
        <h2 className="mb-1.5 font-head text-[15px] font-semibold text-danger">
          Couldn&rsquo;t get the next step
        </h2>
        <p className="mb-4 text-[12px] leading-[1.55] text-text2">{message}</p>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-[3px] border border-accent bg-[var(--accent-dim)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-accent"
        >
          Retry
        </button>
      </div>
    </section>
  );
}
