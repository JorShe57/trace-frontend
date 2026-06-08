'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
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
export function useAiDiagnostic(): AiDiagnostic {
  const [phase, setPhase] = useState<AiPhase>('equipment');
  const [unit, setUnit] = useState<UnitOption | null>(null);
  const [equipment, setEquipmentState] = useState<EquipmentContext>({});
  const [complaint, setComplaint] = useState<string | null>(null);
  const [answered, setAnswered] = useState<AnsweredStep[]>([]);
  const [current, setCurrent] = useState<AiDiagnosticStep | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'claude' | 'unavailable' | null>(null);
  const [model, setModel] = useState<string | undefined>(undefined);
  const [promptVersion, setPromptVersion] = useState<string | undefined>(undefined);

  const abortRef = useRef<AbortController | null>(null);

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
  }, []);

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
  };
}
