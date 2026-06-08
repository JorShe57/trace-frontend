'use client';

import { startTransition, useEffect, useRef, useState } from 'react';
import { enrichDiagnosis } from '@/lib/api/client';
import type { EnrichDiagnosisResponse } from '@/lib/api/types';
import type { Diagnostic } from '@/lib/useDiagnostic';
import type { OutcomeNode } from '@/lib/types';

interface UseEnrichedOutcomeResult {
  data: EnrichDiagnosisResponse | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export function useEnrichedOutcome(
  diagnostic: Diagnostic,
  node: OutcomeNode,
): UseEnrichedOutcomeResult {
  const [data, setData] = useState<EnrichDiagnosisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  const retry = () => setTick((t) => t + 1);

  // Re-fetch only when the outcome's identity changes (which path/node we're
  // looking at), not when unrelated diagnostic fields mutate. The other values
  // read below are a stable snapshot for a given node, so they're intentionally
  // excluded from the dependency array.
  const pathKey = diagnostic.path.join('/');

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    startTransition(() => {
      setLoading(true);
      setError(null);
    });

    enrichDiagnosis({
      path: diagnostic.path,
      history: diagnostic.history,
      unit: diagnostic.unit
        ? { id: diagnostic.unit.id, name: diagnostic.unit.name }
        : null,
      outcome: {
        nodeId: diagnostic.currentId,
        title: node.title,
        finding: node.finding,
        safety: node.safety,
        steps: node.steps,
        tools: node.tools,
      },
      equipment: diagnostic.equipment,
    })
      .then((result) => {
        if (controller.signal.aborted) return;
        setData(result);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : 'Enrichment failed');
        setData(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional identity-only key; see comment above
  }, [pathKey, diagnostic.currentId, diagnostic.unit?.id, node.title, tick]);

  return { data, loading, error, retry };
}
