'use client';

import { useState } from 'react';
import { Card, Field, Input, SectionLabel, Select } from '@/components/ui';

/* Superheat & subcooling are the two readings techs use to judge a system's
   charge. Both are simple temperature differences once you know the saturation
   temperature, which is read straight off the manifold gauge's PT scale (or a
   PT chart) for the refrigerant in the system. We take the saturation temps as
   input so this stays accurate for any refrigerant without baking in a PT
   table we'd have to keep correct. */

const REFRIGERANTS = ['R-410A', 'R-22', 'R-134a', 'R-404A', 'R-407C', 'R-32', 'R-454B', 'Other'];

/** Parse a temperature field; returns null when empty or not a number. */
function num(value: string): number | null {
  if (value.trim() === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function Result({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | null;
  hint: string;
}) {
  return (
    <div className="rounded-[4px] border border-border2 bg-bg3 px-4 py-3">
      <div className="font-mono text-[8px] uppercase tracking-[0.12em] text-text3">{label}</div>
      <div className="mt-1 font-mono text-[28px] font-bold tabular-nums text-accent">
        {value === null ? '—' : `${value.toFixed(1)}°F`}
      </div>
      <div className="mt-1 text-[10px] text-text3">{hint}</div>
    </div>
  );
}

export function RefrigerantCalculator() {
  const [refrigerant, setRefrigerant] = useState('R-410A');

  // Superheat = suction line temp − suction saturation temp.
  const [suctionSat, setSuctionSat] = useState('');
  const [suctionLine, setSuctionLine] = useState('');

  // Subcooling = liquid saturation temp − liquid line temp.
  const [liquidSat, setLiquidSat] = useState('');
  const [liquidLine, setLiquidLine] = useState('');

  const ssat = num(suctionSat);
  const sline = num(suctionLine);
  const lsat = num(liquidSat);
  const lline = num(liquidLine);

  const superheat = ssat !== null && sline !== null ? sline - ssat : null;
  const subcooling = lsat !== null && lline !== null ? lsat - lline : null;

  return (
    <div className="space-y-5">
      <Card className="p-4">
        <Field label="Refrigerant" name="refrigerant" hint="Read saturation temps from this refrigerant's PT scale on your gauges.">
          <Select
            id="refrigerant"
            value={refrigerant}
            onChange={(e) => setRefrigerant(e.target.value)}
          >
            {REFRIGERANTS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
        </Field>
      </Card>

      <Card className="p-4">
        <SectionLabel>Superheat — low side</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Suction saturation temp (°F)"
            name="suction-sat"
            hint="Low-side gauge PT reading."
          >
            <Input
              id="suction-sat"
              type="number"
              inputMode="decimal"
              placeholder="e.g. 40"
              value={suctionSat}
              onChange={(e) => setSuctionSat(e.target.value)}
            />
          </Field>
          <Field
            label="Suction line temp (°F)"
            name="suction-line"
            hint="Clamp probe near the compressor."
          >
            <Input
              id="suction-line"
              type="number"
              inputMode="decimal"
              placeholder="e.g. 52"
              value={suctionLine}
              onChange={(e) => setSuctionLine(e.target.value)}
            />
          </Field>
        </div>
        <div className="mt-4">
          <Result
            label="Superheat"
            value={superheat}
            hint="Line temp − saturation temp. Low superheat risks flooding; high suggests undercharge or low load."
          />
        </div>
      </Card>

      <Card className="p-4">
        <SectionLabel>Subcooling — high side</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Liquid saturation temp (°F)"
            name="liquid-sat"
            hint="High-side gauge PT reading."
          >
            <Input
              id="liquid-sat"
              type="number"
              inputMode="decimal"
              placeholder="e.g. 105"
              value={liquidSat}
              onChange={(e) => setLiquidSat(e.target.value)}
            />
          </Field>
          <Field
            label="Liquid line temp (°F)"
            name="liquid-line"
            hint="Clamp probe near the condenser outlet."
          >
            <Input
              id="liquid-line"
              type="number"
              inputMode="decimal"
              placeholder="e.g. 95"
              value={liquidLine}
              onChange={(e) => setLiquidLine(e.target.value)}
            />
          </Field>
        </div>
        <div className="mt-4">
          <Result
            label="Subcooling"
            value={subcooling}
            hint="Saturation temp − line temp. On a TXV system, 8–12°F is a common target — check the manufacturer's chart."
          />
        </div>
      </Card>

      <p className="px-1 text-[10px] text-text3">
        Saturation temperatures come from the refrigerant&apos;s pressure-temperature
        relationship — read them off your manifold gauge&apos;s PT scale or a PT chart.
        Always charge to the equipment manufacturer&apos;s specification.
      </p>
    </div>
  );
}
