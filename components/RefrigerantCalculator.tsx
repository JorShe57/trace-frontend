'use client';

import { useState } from 'react';
import { Card, Field, Input, SectionLabel, Select } from '@/components/ui';
import { REFRIGERANTS, getRefrigerant, satTempFromPressure } from '@/lib/refrigerants';

/* Superheat & subcooling are the two readings techs use to judge a system's
   charge. Both are temperature differences against the refrigerant's
   saturation temperature. New techs read pressure off the manifold gauge, so
   we take pressure (psig) as input and convert it to a saturation temperature
   using the built-in PT tables (lib/refrigerants.ts) — the low side uses the
   dew point, the high side the bubble point. The derived saturation temp is
   shown alongside each result so it doubles as a learning aid. */

/** Parse a numeric field; returns null when empty or not a number. */
function num(value: string): number | null {
  if (value.trim() === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function fmt(value: number | null): string {
  return value === null ? '—' : `${value.toFixed(1)}°F`;
}

function Result({
  label,
  value,
  satTemp,
  satEmpty,
  hint,
}: {
  label: string;
  value: number | null;
  satTemp: number | null;
  /** True when no pressure has been entered yet (vs. entered-but-out-of-range). */
  satEmpty: boolean;
  hint: string;
}) {
  return (
    <div className="rounded-lg border border-border2 bg-bg3 px-4 py-3">
      <div className="flex items-baseline justify-between gap-3">
        <div className="text-[11px] font-medium uppercase tracking-[0.05em] text-text3">{label}</div>
        <div className="text-[12px] text-text3">
          {satEmpty ? (
            'sat —'
          ) : satTemp === null ? (
            <span className="text-warn">pressure out of range</span>
          ) : (
            `sat ${satTemp.toFixed(1)}°F`
          )}
        </div>
      </div>
      <div className="mt-1 font-mono text-[28px] font-bold tabular-nums text-accent">
        {fmt(value)}
      </div>
      <div className="mt-1 text-[12px] text-text3">{hint}</div>
    </div>
  );
}

export function RefrigerantCalculator() {
  const [refrigerantId, setRefrigerantId] = useState(REFRIGERANTS[0].id);

  // Superheat (low side): dew-point saturation temp from suction pressure.
  const [suctionPsig, setSuctionPsig] = useState('');
  const [suctionLine, setSuctionLine] = useState('');

  // Subcooling (high side): bubble-point saturation temp from liquid pressure.
  const [liquidPsig, setLiquidPsig] = useState('');
  const [liquidLine, setLiquidLine] = useState('');

  const refrigerant = getRefrigerant(refrigerantId) ?? REFRIGERANTS[0];

  const sPsig = num(suctionPsig);
  const sLine = num(suctionLine);
  const lPsig = num(liquidPsig);
  const lLine = num(liquidLine);

  const suctionSat = sPsig === null ? null : satTempFromPressure(refrigerant, sPsig, 'dew');
  const liquidSat = lPsig === null ? null : satTempFromPressure(refrigerant, lPsig, 'bubble');

  const superheat = suctionSat !== null && sLine !== null ? sLine - suctionSat : null;
  const subcooling = liquidSat !== null && lLine !== null ? liquidSat - lLine : null;

  return (
    <div className="space-y-5">
      <Card className="p-4">
        <Field
          label="Refrigerant"
          name="refrigerant"
          hint="Pick the refrigerant in the system — its PT chart converts your gauge pressure to a saturation temperature."
        >
          <Select
            id="refrigerant"
            value={refrigerantId}
            onChange={(e) => setRefrigerantId(e.target.value)}
          >
            {REFRIGERANTS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.id}
                {r.glide >= 1 ? `  (glide ~${r.glide}°F)` : ''}
              </option>
            ))}
          </Select>
        </Field>
      </Card>

      <Card className="p-4">
        <SectionLabel>Superheat — low side</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Suction pressure (psig)"
            name="suction-psig"
            hint="Low-side gauge reading."
          >
            <Input
              id="suction-psig"
              type="number"
              inputMode="decimal"
              placeholder="e.g. 118"
              value={suctionPsig}
              onChange={(e) => setSuctionPsig(e.target.value)}
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
            satTemp={suctionSat}
            satEmpty={sPsig === null}
            hint="Line temp − saturation temp. Low superheat risks liquid flooding the compressor; high suggests undercharge or low load."
          />
        </div>
      </Card>

      <Card className="p-4">
        <SectionLabel>Subcooling — high side</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Liquid pressure (psig)"
            name="liquid-psig"
            hint="High-side gauge reading."
          >
            <Input
              id="liquid-psig"
              type="number"
              inputMode="decimal"
              placeholder="e.g. 365"
              value={liquidPsig}
              onChange={(e) => setLiquidPsig(e.target.value)}
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
            satTemp={liquidSat}
            satEmpty={lPsig === null}
            hint="Saturation temp − line temp. On a TXV system, 8–12°F is a common target — always confirm against the manufacturer's chart."
          />
        </div>
      </Card>

      <p className="px-1 text-[12px] text-text3">
        Saturation temps are looked up from the refrigerant&apos;s pressure-temperature
        chart (gauge psig). The low side uses the dew point and the high side the bubble
        point, which matters most on high-glide blends like R-407C. Always charge to the
        equipment manufacturer&apos;s specification.
      </p>
    </div>
  );
}
