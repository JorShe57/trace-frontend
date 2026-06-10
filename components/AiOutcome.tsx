'use client';

import { useState } from 'react';
import Link from 'next/link';
import { saveSession } from '@/lib/api/client';
import type { AiOutcomeStep } from '@/lib/api/types';
import { formatEquipmentContext } from '@/lib/equipment';
import type { EquipmentContext } from '@/lib/types';

interface AiOutcomeProps {
  step: AiOutcomeStep;
  unitId?: string;
  unitName?: string;
  complaint?: string;
  equipment?: EquipmentContext;
  source: 'claude' | 'unavailable' | null;
  model?: string;
  promptVersion?: string;
  jobId?: string;
  onBack: () => void;
  onRestart: () => void;
  /** Called after a successful save so the in-progress resume state can clear. */
  onSaved?: () => void;
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 60) || 'ai_outcome';
}

/** Terminal diagnosis card for an AI-reasoned outcome. */
export function AiOutcome({
  step,
  unitId,
  unitName,
  complaint,
  equipment,
  source,
  model,
  promptVersion,
  jobId,
  onBack,
  onRestart,
  onSaved,
}: AiOutcomeProps) {
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const danger = Boolean(step.safety);

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    try {
      const equipmentLine = formatEquipmentContext(equipment);
      const notes = [
        equipmentLine ? `Equipment: ${equipmentLine}` : '',
        complaint ? `Complaint: ${complaint}` : '',
      ]
        .filter(Boolean)
        .join('\n');
      const result = await saveSession({
        path: [unitId ?? 'ai', slug(step.title)],
        unitId,
        outcomeId: slug(step.title),
        completedAt: new Date().toISOString(),
        notes: notes || undefined,
        enrichment: {
          summary: step.finding,
          finding: step.finding,
          steps: step.steps,
          tools: step.tools,
          safety: step.safety,
          confidence: step.confidence,
          rationale: step.rationale,
          watchouts: step.watchouts,
        },
        claudeModel: model,
        promptVersion,
        title: step.title,
        jobId,
      });
      setSavedId(result.id);
      onSaved?.();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section
      data-screen-label="AI Outcome"
      className={`overflow-hidden rounded-card border bg-bg2 ${danger ? 'border-danger' : 'border-accent'}`}
    >
      <header
        className={`flex items-center gap-2 border-b px-4 py-3 ${
          danger ? 'border-danger/20 bg-[var(--red-bg)]' : 'border-accent/20 bg-[var(--accent-dim)]'
        }`}
      >
        <span className="text-[18px]" aria-hidden="true">
          {step.icon || '◈'}
        </span>
        <div className="min-w-0 flex-1">
          <h1
            className={`text-[16px] font-semibold tracking-[-0.01em] ${
              danger ? 'text-danger' : 'text-accent'
            }`}
          >
            {step.title}
          </h1>
          <div className="mt-px text-[12px] text-text2">
            {[step.phase, unitName].filter(Boolean).join(' · ')}
          </div>
        </div>
        {source === 'claude' ? (
          <span className="rounded-md border border-accent/30 bg-[var(--accent-faint)] px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.05em] text-accent">
            AI diagnosed
          </span>
        ) : (
          <span className="rounded-md border border-warn/30 bg-[var(--yellow-bg)] px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.05em] text-warn">
            Fallback
          </span>
        )}
      </header>

      <div className="p-4">
        {step.safety && (
          <div className="mb-2.5 flex items-start gap-2 rounded-lg border border-danger/30 bg-[var(--red-bg)] px-3 py-[9px] text-[12px] leading-[1.5] text-danger">
            <span className="flex-shrink-0" aria-hidden="true">
              ⚠
            </span>
            <span>{step.safety}</span>
          </div>
        )}

        {(step.rationale || step.watchouts.length > 0) && (
          <div className="mb-3.5 rounded-lg border border-accent/20 bg-[var(--accent-faint)] px-3 py-3">
            <div className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.05em] text-accent">
              Reasoning · {step.confidence} confidence
            </div>
            {step.rationale && (
              <p className="mb-2 text-[11px] leading-[1.5] text-text2">{step.rationale}</p>
            )}
            {step.watchouts.length > 0 && (
              <ul className="flex flex-col gap-1">
                {step.watchouts.map((w, i) => (
                  <li
                    key={i}
                    className="text-[11px] leading-[1.45] text-warn before:mr-1 before:content-['▸']"
                  >
                    {w}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <Section label="Finding">
          <p className="text-[13px] leading-[1.6] text-text">{step.finding}</p>
        </Section>

        {step.steps.length > 0 && (
          <>
            <Divider />
            <Section label="Next steps">
              <ol className="flex flex-col gap-1.5">
                {step.steps.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 rounded-lg border border-border2 bg-bg3 px-3 py-[9px] text-[12px] leading-[1.5] text-text"
                  >
                    <span className="mt-px flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full border border-accent/30 bg-[var(--accent-dim)] text-[12px] text-accent">
                      {i + 1}
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </Section>
          </>
        )}

        {step.tools.length > 0 && (
          <>
            <Divider />
            <Section label="Tools needed">
              <p className="text-[13px] leading-[1.6] text-accent">
                {step.tools.join(' · ')}
              </p>
            </Section>
          </>
        )}
      </div>

      <footer className="flex flex-wrap items-center gap-2 border-t border-border bg-bg3 px-4 py-2.5">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-border2 px-3 py-1.5 text-[12.5px] font-medium text-text3 transition-colors hover:border-border hover:text-text2"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="rounded-md border border-accent bg-[var(--accent-dim)] px-3 py-1.5 text-[12.5px] font-medium text-accent transition-colors hover:bg-[var(--accent-dim)]"
        >
          ↺ Restart
        </button>
        <div className="ml-auto flex items-center gap-2">
          {savedId && (
            <Link href={`/reports/${savedId}`} className="text-[12px] text-accent hover:underline">
              Saved · View report →
            </Link>
          )}
          {saveError && <span className="text-[12px] text-danger">{saveError}</span>}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-md border border-border2 bg-bg2 px-3 py-1.5 text-[12.5px] font-medium text-text2 transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save report'}
          </button>
        </div>
      </footer>
    </section>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3.5 last:mb-0">
      <div className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.05em] text-text3">
        {label}
      </div>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="my-3 h-px bg-border" />;
}
