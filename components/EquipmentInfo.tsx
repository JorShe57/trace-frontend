'use client';

import { useState } from 'react';
import { AGE_BRACKETS, MANUFACTURERS } from '@/lib/equipment';
import type { EquipmentContext } from '@/lib/types';
import { PhaseBar } from './PhaseBar';

interface EquipmentInfoProps {
  unitName?: string;
  step: number;
  onSubmit: (ctx: EquipmentContext) => void;
}

/**
 * Optional intake step: capture manufacturer, age, and model. None of it routes
 * the tree — it's metadata that sharpens the AI's reasoning (a 2-week-old unit
 * and a 15-year-old unit have very different likely causes) and is saved with
 * the report. Everything is skippable.
 */
export function EquipmentInfo({ unitName, step, onSubmit }: EquipmentInfoProps) {
  const [manufacturer, setManufacturer] = useState<string | null>(null);
  const [otherBrand, setOtherBrand] = useState('');
  const [ageBracket, setAgeBracket] = useState<string | null>(null);
  const [model, setModel] = useState('');

  function build(): EquipmentContext {
    const brand =
      manufacturer === 'Other' ? otherBrand.trim() || undefined : manufacturer ?? undefined;
    return {
      manufacturer: brand,
      model: model.trim() || undefined,
      ageBracket: ageBracket ?? undefined,
    };
  }

  return (
    <section
      data-screen-label={`Step ${step}`}
      className="mb-4 overflow-hidden rounded-card border border-border bg-bg2"
    >
      <PhaseBar phase="Equipment Details" pip="grey" step={step} />

      <div className="px-4 pb-4 pt-[18px]">
        <h1 className="mb-1.5 font-head text-[20px] font-semibold leading-[1.3] tracking-[0.03em] text-text">
          What unit are you on?
        </h1>
        <p className="mb-4 text-[12px] leading-[1.55] text-text2">
          Optional, but it sharpens the diagnosis{unitName ? ` for this ${unitName.toLowerCase()}` : ''}.
          A fix for a two-week-old unit (install, config, warranty) is different from a
          fifteen-year-old one (wear, fouling, end-of-life parts).
        </p>

        <FieldLabel>Manufacturer</FieldLabel>
        <div className="mb-1.5 flex flex-wrap gap-1.5">
          {MANUFACTURERS.map((m) => (
            <Chip key={m} selected={manufacturer === m} onClick={() => setManufacturer(m)}>
              {m}
            </Chip>
          ))}
        </div>
        {manufacturer === 'Other' && (
          <input
            type="text"
            value={otherBrand}
            onChange={(e) => setOtherBrand(e.target.value)}
            placeholder="Brand name"
            className="mb-3 w-full rounded-[5px] border border-border2 bg-bg3 px-3 py-2 text-[13px] text-text placeholder:text-text3 focus:border-accent focus:outline-none"
          />
        )}

        <FieldLabel className="mt-3">Age</FieldLabel>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {AGE_BRACKETS.map((a) => (
            <Chip key={a} selected={ageBracket === a} onClick={() => setAgeBracket(a)}>
              {a}
            </Chip>
          ))}
        </div>

        <FieldLabel>Model # (optional)</FieldLabel>
        <input
          type="text"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="e.g. 25HBC060A003"
          className="mb-4 w-full rounded-[5px] border border-border2 bg-bg3 px-3 py-2 font-mono text-[13px] text-text placeholder:text-text3 focus:border-accent focus:outline-none"
        />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSubmit(build())}
            className="flex-1 rounded-[5px] border border-accent bg-[var(--accent-dim)] py-3 text-center font-head text-[14px] font-bold tracking-[0.06em] text-accent transition-colors hover:bg-[var(--accent-faint)]"
          >
            Continue
          </button>
          <button
            type="button"
            onClick={() => onSubmit({})}
            className="rounded-[5px] border border-border2 bg-bg3 px-4 py-3 text-center font-mono text-[10px] uppercase tracking-[0.08em] text-text3 transition-colors hover:border-border hover:text-text2"
          >
            Skip
          </button>
        </div>
      </div>
    </section>
  );
}

function FieldLabel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mb-1.5 font-mono text-[8px] uppercase tracking-[0.12em] text-text3 ${className}`}>
      {children}
    </div>
  );
}

function Chip({
  children,
  selected,
  onClick,
}: {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[5px] border px-2.5 py-1.5 text-[12px] transition-colors ${
        selected
          ? 'border-accent bg-[var(--accent-dim)] text-accent'
          : 'border-border2 bg-bg3 text-text2 hover:border-border hover:text-text'
      }`}
    >
      {children}
    </button>
  );
}
