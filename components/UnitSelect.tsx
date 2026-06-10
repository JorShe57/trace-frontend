'use client';

import type { UnitSelectNode } from '@/lib/types';
import { PhaseBar } from './PhaseBar';

interface UnitSelectProps {
  node: UnitSelectNode;
  onSelect: (nextId: string) => void;
}

/** The entry node: a grid of equipment types. */
export function UnitSelect({ node, onSelect }: UnitSelectProps) {
  return (
    <section
      data-screen-label="Equipment select"
      className="mb-4 overflow-hidden rounded-card border border-border2 bg-bg2"
    >
      <PhaseBar phase={node.phase} pip={node.phasePip} />
      <div className="px-4 pb-3.5 pt-[18px]">
        <h1 className="mb-1.5 text-[19px] font-semibold leading-[1.35] tracking-[-0.01em] text-text">
          {node.question}
        </h1>
        {node.context && (
          <p className="mb-4 text-[12px] leading-[1.55] text-text2">{node.context}</p>
        )}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {node.units.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => onSelect(u.next)}
              className="flex flex-col items-start gap-1.5 rounded-[6px] border border-border bg-bg3 px-2.5 py-[13px] text-left transition-colors hover:border-border2 hover:bg-bg4"
            >
              <span className="flex items-center gap-2">
                <span className="flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-md border border-border bg-bg2 text-[13px]">
                  {u.icon}
                </span>
                <span className="text-[13px] font-semibold text-text">
                  {u.name}
                </span>
              </span>
              <span className="pl-[34px] text-[11px] leading-[1.3] text-text3">{u.sub}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
