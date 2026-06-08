'use client';

import { useEffect } from 'react';
import { useDiagnostic } from '@/lib/useDiagnostic';
import { TopBar } from './TopBar';
import { ProgressBar } from './ProgressBar';
import { Breadcrumb } from './Breadcrumb';
import { HistoryTrail } from './HistoryTrail';
import { StepCard } from './StepCard';
import { UnitSelect } from './UnitSelect';
import { EquipmentInfo } from './EquipmentInfo';
import { Outcome } from './Outcome';

const MAX_DEPTH = 12;

/**
 * Top-level diagnostic screen. The URL's catch-all segments are passed in as
 * `path`; everything else (history, progress, keyboard nav) derives from it.
 */
export function DiagnosticView({ path: rawPath, jobId }: { path: string[]; jobId?: string }) {
  const dx = useDiagnostic(rawPath);
  const { current, history, unit, crumbs, isOutcome, needsEquipmentInfo, setEquipment, navigate, back, restart } = dx;

  const progress = isOutcome
    ? 100
    : Math.min((history.length / MAX_DEPTH) * 100, 95);

  // ── Keyboard navigation ──────────────────────────────────────────
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // ignore when typing in a field
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      const k = e.key.toLowerCase();

      // the equipment-info gate handles its own input — allow back/restart but
      // don't let number keys fall through to the complaint node underneath it
      if (needsEquipmentInfo && !['escape', 'backspace', 'arrowleft', 'r'].includes(k)) {
        return;
      }

      if (k === 'escape' || k === 'backspace' || k === 'arrowleft') {
        e.preventDefault();
        back();
        return;
      }
      if (k === 'r') {
        restart();
        return;
      }

      if (current.type === 'yn') {
        if (k === 'y') navigate(current.yes);
        else if (k === 'n') navigate(current.no);
        else if ((k === 'u' || k === 's') && current.unsure) navigate(current.unsure);
        return;
      }

      if (current.type === 'choice') {
        const idx = parseInt(e.key, 10) - 1;
        if (idx >= 0 && idx < current.answers.length) navigate(current.answers[idx].next);
        return;
      }

      if (current.type === 'unit-select') {
        const idx = parseInt(e.key, 10) - 1;
        if (idx >= 0 && idx < current.units.length) navigate(current.units[idx].next);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, navigate, back, restart, needsEquipmentInfo]);

  // keep the viewport at the top on each step change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [dx.currentId]);

  return (
    <div className="min-h-screen">
      <TopBar
        unitLabel={unit ? `${unit.icon} ${unit.name}` : ''}
        canGoBack={history.length > 0}
        onBack={back}
        onRestart={restart}
      />
      <ProgressBar value={progress} />

      <main className="mx-auto max-w-shell px-5 pb-16 pt-7">
        <HistoryTrail history={history} />
        <Breadcrumb crumbs={crumbs} />

        {needsEquipmentInfo ? (
          <EquipmentInfo unitName={unit?.name} step={history.length + 1} onSubmit={setEquipment} />
        ) : (
          <>
            {current.type === 'unit-select' && (
              <UnitSelect node={current} onSelect={navigate} />
            )}
            {(current.type === 'yn' || current.type === 'choice') && (
              <StepCard node={current} step={history.length + 1} onAnswer={navigate} />
            )}
            {current.type === 'outcome' && (
              <Outcome
                node={current}
                diagnostic={dx}
                unitName={unit?.name}
                jobId={jobId}
                onBack={back}
                onRestart={restart}
              />
            )}
          </>
        )}

        <KeyboardHint type={current.type} />
      </main>
    </div>
  );
}

function KeyboardHint({ type }: { type: string }) {
  let hint = '';
  if (type === 'yn') hint = 'Keys: Y / N · U not sure · ← back · R restart';
  else if (type === 'choice' || type === 'unit-select') hint = 'Keys: 1–9 select · ← back · R restart';
  else hint = '← back · R restart';
  return (
    <p className="mt-5 text-center font-mono text-[9px] tracking-[0.06em] text-text3">{hint}</p>
  );
}
