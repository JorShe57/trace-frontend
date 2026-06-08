'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { diagnoseStep } from '@/lib/api/client';
import { TREE, ROOT_ID } from '@/lib/engine';
import type {
  AiDiagnosticStep,
  AiQAEntry,
  AiQuestionStep,
} from '@/lib/api/types';
import type { ChoiceNode, EquipmentContext, UnitOption } from '@/lib/types';

export type AiPhase = 'equipment' | 'equipment-info' | 'complaint' | 'diagnosing';

export interface ComplaintOption {
  label: string;
  sub?: string;
}

interface AnsweredStep {
  step: AiQuestionStep;
  answer: string;
}

export interface AiDiagnostic {
  phase: AiPhase;
  units: UnitOption[];
  unit: UnitOption | null;
  equipment: EquipmentContext;
  complaints: ComplaintOption[];
  complaint: string | null;
  /** Answered questions in order (for the history trail). */
  answered: AnsweredStep[];
  /** The step currently on screen while diagnosing. */
  current: AiDiagnosticStep | null;
  isOutcome: boolean;
  loading: boolean;
  error: string | null;
  /** 'claude' once the model has produced a step; null before the first fetch. */
  source: 'claude' | 'unavailable' | null;
  model?: string;
  promptVersion?: string;
  selectUnit: (unit: UnitOption) => void;
  setEquipment: (equipment: EquipmentContext) => void;
  selectComplaint: (complaint: string) => void;
  answer: (value: string) => void;
  back: () => void;
  restart: () => void;
  retry: () => void;
  /** Drop the persisted resume snapshot for this job (e.g. once saved). */
  clearResume: () => void;
}

/* Per-job resume: an in-progress AI diagnostic is mirrored into localStorage so
 * clicking "Diagnose" on the same job picks up where you left off instead of
 * starting over. Only stable (non-loading) states are persisted; the snapshot
 * is cleared on Restart and once the outcome is saved as a report. */

interface AiSnapshot {
  v: number;
  phase: AiPhase;
  unit: UnitOption | null;
  equipment: EquipmentContext;
  complaint: string | null;
  answered: AnsweredStep[];
  current: AiDiagnosticStep | null;
  source: 'claude' | 'unavailable' | null;
  model?: string;
  promptVersion?: string;
}

const AI_KEY_PREFIX = 'trace.ai.';
const SNAPSHOT_VERSION = 1;

function aiKey(jobId: string): string {
  return `${AI_KEY_PREFIX}${jobId}`;
}

function loadAiSnapshot(jobId: string): AiSnapshot | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(aiKey(jobId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AiSnapshot;
    if (parsed && parsed.v === SNAPSHOT_VERSION) return parsed;
  } catch {
    /* corrupt or unavailable storage — ignore and start fresh */
  }
  return null;
}

function saveAiSnapshot(jobId: string, snap: Omit<AiSnapshot, 'v'>): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(aiKey(jobId), JSON.stringify({ v: SNAPSHOT_VERSION, ...snap }));
  } catch {
    /* storage may be full or unavailable (private mode) — non-fatal */
  }
}

export function clearAiSnapshot(jobId: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(aiKey(jobId));
  } catch {
    /* ignore */
  }
}

function unitOptions(): UnitOption[] {
  const start = TREE[ROOT_ID];
  return start && start.type === 'unit-select' ? start.units : [];
}

function complaintOptions(unit: UnitOption | null): ComplaintOption[] {
  if (!unit) return [];
  const node = TREE[unit.next] as ChoiceNode | undefined;
  if (!node || node.type !== 'choice') return [];
  return node.answers.map((a) => ({ label: a.label, sub: a.sub }));
}

/**
 * Drives an AI-led diagnostic session. Equipment and complaint come from the
 * existing tree (a sensible fixed entry point); everything after is reasoned by
 * the model one step at a time. State lives in React rather than the URL because
 * AI steps are generated, not addressable nodes — but `back` is instant because
 * we keep every answered question, so popping never re-calls the model.
 */
export function useAiDiagnostic(jobId?: string): AiDiagnostic {
  // Resume snapshot read once at mount. The component gates this hook behind a
  // client-only mount check, so reading localStorage here is SSR-safe and
  // doesn't cause a hydration mismatch.
  const saved = useMemo(() => (jobId ? loadAiSnapshot(jobId) : null), [jobId]);

  const [phase, setPhase] = useState<AiPhase>(saved?.phase ?? 'equipment');
  const [unit, setUnit] = useState<UnitOption | null>(saved?.unit ?? null);
  const [equipment, setEquipmentState] = useState<EquipmentContext>(saved?.equipment ?? {});
  const [complaint, setComplaint] = useState<string | null>(saved?.complaint ?? null);
  const [answered, setAnswered] = useState<AnsweredStep[]>(saved?.answered ?? []);
  const [current, setCurrent] = useState<AiDiagnosticStep | null>(saved?.current ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'claude' | 'unavailable' | null>(saved?.source ?? null);
  const [model, setModel] = useState<string | undefined>(saved?.model);
  const [promptVersion, setPromptVersion] = useState<string | undefined>(saved?.promptVersion);

  const abortRef = useRef<AbortController | null>(null);

  // Mirror the live state into localStorage so the next visit can resume.
  // Writing to storage (not setState) keeps this a plain external-system sync.
  useEffect(() => {
    if (!jobId || loading) return;
    // Nothing worth resuming until the user is past the equipment picker.
    if (phase === 'equipment' && !unit) return;
    saveAiSnapshot(jobId, {
      phase,
      unit,
      equipment,
      complaint,
      answered,
      current,
      source,
      model,
      promptVersion,
    });
  }, [jobId, loading, phase, unit, equipment, complaint, answered, current, source, model, promptVersion]);

  const units = useMemo(() => unitOptions(), []);
  const complaints = useMemo(() => complaintOptions(unit), [unit]);

  const fetchStep = useCallback(
    async (
      u: UnitOption,
      complaintText: string,
      history: AiQAEntry[],
      equipmentCtx: EquipmentContext,
    ) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);
      try {
        const res = await diagnoseStep({
          unit: { id: u.id, name: u.name },
          complaint: complaintText,
          history,
          equipment: equipmentCtx,
        });
        if (controller.signal.aborted) return;
        setCurrent(res.step);
        setSource(res.source);
        setModel(res.model);
        setPromptVersion(res.promptVersion);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : 'Diagnostic step failed');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    },
    [],
  );

  const selectUnit = useCallback((u: UnitOption) => {
    setUnit(u);
    setEquipmentState({});
    setComplaint(null);
    setAnswered([]);
    setCurrent(null);
    setPhase('equipment-info');
  }, []);

  const setEquipment = useCallback((ctx: EquipmentContext) => {
    setEquipmentState(ctx);
    setPhase('complaint');
  }, []);

  const selectComplaint = useCallback(
    (c: string) => {
      if (!unit) return;
      setComplaint(c);
      setAnswered([]);
      setCurrent(null);
      setPhase('diagnosing');
      void fetchStep(unit, c, [], equipment);
    },
    [unit, equipment, fetchStep],
  );

  const answer = useCallback(
    (value: string) => {
      if (!unit || !complaint || current?.kind !== 'question') return;
      const nextAnswered = [...answered, { step: current, answer: value }];
      const history: AiQAEntry[] = nextAnswered.map((a) => ({
        question: a.step.question,
        answer: a.answer,
      }));
      setAnswered(nextAnswered);
      setCurrent(null);
      void fetchStep(unit, complaint, history, equipment);
    },
    [unit, complaint, current, answered, equipment, fetchStep],
  );

  const back = useCallback(() => {
    // While diagnosing: pop the last answered question and re-show it without
    // re-calling the model. The current (unanswered) step is discarded.
    if (phase === 'diagnosing') {
      if (answered.length > 0) {
        const prev = answered[answered.length - 1];
        setAnswered((a) => a.slice(0, -1));
        setCurrent(prev.step);
        setError(null);
        return;
      }
      // No answers yet — step back to complaint selection.
      setPhase('complaint');
      setCurrent(null);
      setComplaint(null);
      return;
    }
    if (phase === 'complaint') {
      setPhase('equipment-info');
      return;
    }
    if (phase === 'equipment-info') {
      setPhase('equipment');
      setUnit(null);
    }
  }, [phase, answered]);

  const restart = useCallback(() => {
    abortRef.current?.abort();
    setPhase('equipment');
    setUnit(null);
    setEquipmentState({});
    setComplaint(null);
    setAnswered([]);
    setCurrent(null);
    setError(null);
    setSource(null);
    if (jobId) clearAiSnapshot(jobId);
  }, [jobId]);

  const clearResume = useCallback(() => {
    if (jobId) clearAiSnapshot(jobId);
  }, [jobId]);

  const retry = useCallback(() => {
    if (!unit || !complaint) return;
    const history: AiQAEntry[] = answered.map((a) => ({
      question: a.step.question,
      answer: a.answer,
    }));
    void fetchStep(unit, complaint, history, equipment);
  }, [unit, complaint, answered, equipment, fetchStep]);

  return {
    phase,
    units,
    unit,
    equipment,
    complaints,
    complaint,
    answered,
    current,
    isOutcome: current?.kind === 'outcome',
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
  };
}
