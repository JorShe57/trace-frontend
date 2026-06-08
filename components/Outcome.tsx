'use client';

import { useState } from 'react';
import Link from 'next/link';
import { saveSession } from '@/lib/api/client';
import type { EnrichedDiagnosis } from '@/lib/api/types';
import type { Diagnostic } from '@/lib/useDiagnostic';
import { useEnrichedOutcome } from '@/lib/useEnrichedOutcome';
import type { OutcomeNode } from '@/lib/types';

interface OutcomeProps {
  node: OutcomeNode;
  diagnostic: Diagnostic;
  unitName?: string;
  jobId?: string;
  onBack: () => void;
  onRestart: () => void;
}

/** Terminal diagnosis card: static tree content + Claude enrichment + save. */
export function Outcome({ node, diagnostic, unitName, jobId, onBack, onRestart }: OutcomeProps) {
  const { data, loading, error, retry } = useEnrichedOutcome(diagnostic, node);
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const enriched = data?.enriched;
  const danger = Boolean(node.safety || enriched?.safety);
  const safetyText = enriched?.safety ?? node.safety;
  const finding = enriched?.finding ?? node.finding;
  const steps = enriched?.steps?.length ? enriched.steps : node.steps;
  const tools = enriched?.tools?.length ? enriched.tools : node.tools;

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    try {
      const result = await saveSession({
        path: diagnostic.path,
        unitId: diagnostic.unit?.id,
        outcomeId: diagnostic.currentId,
        completedAt: new Date().toISOString(),
        enrichment: data?.enriched,
        claudeModel: data?.model,
        promptVersion: data?.promptVersion,
        title: node.title,
        jobId,
      });
      setSavedId(result.id);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section
      data-screen-label="Outcome"
      className={`overflow-hidden rounded-card border bg-bg2 ${danger ? 'border-danger' : 'border-accent'}`}
    >
      <header
        className={`flex items-center gap-2 border-b px-4 py-3 ${
          danger
            ? 'border-danger/20 bg-[var(--red-bg)]'
            : 'border-accent/20 bg-[var(--accent-dim)]'
        }`}
      >
        <span className="text-[18px]" aria-hidden="true">
          {node.icon || '◈'}
        </span>
        <div className="min-w-0 flex-1">
          <h1
            className={`font-head text-[18px] font-bold tracking-[0.06em] ${
              danger ? 'text-danger' : 'text-accent'
            }`}
          >
            {node.title}
          </h1>
          <div className="mt-px font-mono text-[9px] text-text2">
            {[node.phase, unitName].filter(Boolean).join(' · ')}
          </div>
        </div>
        {data?.source === 'claude' && (
          <span className="rounded-[3px] border border-accent/30 bg-[var(--accent-faint)] px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em] text-accent">
            AI enriched
          </span>
        )}
      </header>

      <div className="p-4">
        {safetyText && (
          <div className="mb-2.5 flex items-start gap-2 rounded-[4px] border border-danger/30 bg-[var(--red-bg)] px-3 py-[9px] text-[12px] leading-[1.5] text-danger">
            <span className="flex-shrink-0" aria-hidden="true">
              ⚠
            </span>
            <span>{safetyText}</span>
          </div>
        )}

        <AiPanel loading={loading} error={error} enriched={enriched} onRetry={retry} />

        <Section label="Finding">
          <p className="text-[13px] leading-[1.6] text-text">{finding}</p>
        </Section>

        {steps && steps.length > 0 && (
          <>
            <Divider />
            <Section label="Next steps">
              <ol className="flex flex-col gap-1.5">
                {steps.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 rounded-[4px] border border-border2 bg-bg3 px-3 py-[9px] text-[12px] leading-[1.5] text-text"
                  >
                    <span className="mt-px flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full border border-accent/30 bg-[var(--accent-dim)] font-mono text-[9px] text-accent">
                      {i + 1}
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </Section>
          </>
        )}

        {tools && tools.length > 0 && (
          <>
            <Divider />
            <Section label="Tools needed">
              <p className="font-mono text-[12px] leading-[1.6] text-accent">
                {tools.join(' · ')}
              </p>
            </Section>
          </>
        )}
      </div>

      <footer className="flex flex-wrap items-center gap-2 border-t border-border bg-bg3 px-4 py-2.5">
        <button
          type="button"
          onClick={onBack}
          className="rounded-[3px] border border-border2 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-text3 transition-colors hover:border-border hover:text-text2"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="rounded-[3px] border border-accent bg-[var(--accent-dim)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-accent transition-colors hover:bg-[var(--accent-dim)]"
        >
          ↺ Restart
        </button>
        <div className="ml-auto flex items-center gap-2">
          {savedId && (
            <Link href={`/reports/${savedId}`} className="font-mono text-[9px] text-accent hover:underline">
              Saved · View report →
            </Link>
          )}
          {saveError && (
            <span className="font-mono text-[9px] text-danger">{saveError}</span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading}
            className="rounded-[3px] border border-border2 bg-bg2 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-text2 transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save report'}
          </button>
        </div>
      </footer>
    </section>
  );
}

function AiPanel({
  loading,
  error,
  enriched,
  onRetry,
}: {
  loading: boolean;
  error: string | null;
  enriched: EnrichedDiagnosis | undefined;
  onRetry: () => void;
}) {
  if (loading) {
    return (
      <div className="mb-3.5 rounded-[4px] border border-border2 bg-bg3 px-3 py-3">
        <div className="mb-2 font-mono text-[8px] uppercase tracking-[0.12em] text-text3">
          Enriching diagnosis…
        </div>
        <div className="h-2 animate-pulse rounded bg-border2" />
        <div className="mt-1.5 h-2 w-4/5 animate-pulse rounded bg-border2" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-3.5 flex items-center justify-between gap-2 rounded-[4px] border border-border2 bg-bg3 px-3 py-2.5 text-[11px] text-text2">
        <span>AI enrichment unavailable — showing tree defaults.</span>
        <button
          type="button"
          onClick={onRetry}
          className="font-mono text-[9px] uppercase tracking-[0.08em] text-accent"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!enriched) return null;

  return (
    <div className="mb-3.5 rounded-[4px] border border-accent/20 bg-[var(--accent-faint)] px-3 py-3">
      <div className="mb-1.5 font-mono text-[8px] uppercase tracking-[0.12em] text-accent">
        Field context · {enriched.confidence} confidence
      </div>
      <p className="mb-2 text-[12px] leading-[1.55] text-text">{enriched.summary}</p>
      {enriched.rationale && (
        <p className="mb-2 text-[11px] leading-[1.5] text-text2">{enriched.rationale}</p>
      )}
      {enriched.watchouts.length > 0 && (
        <ul className="flex flex-col gap-1">
          {enriched.watchouts.map((w, i) => (
            <li key={i} className="text-[11px] leading-[1.45] text-warn before:mr-1 before:content-['▸']">
              {w}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3.5 last:mb-0">
      <div className="mb-1.5 font-mono text-[8px] uppercase tracking-[0.12em] text-text3">
        {label}
      </div>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="my-3 h-px bg-border" />;
}
