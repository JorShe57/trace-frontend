import type { EquipmentContext } from './types';

/**
 * Equipment identity captured at intake. None of this routes the diagnostic
 * tree — it's metadata that sharpens the AI's reasoning and is saved with the
 * report. Shared by the intake UI, the AI/enrichment context builders, and the
 * save handlers so the option lists and formatting stay in one place.
 */

/** Common HVAC/R manufacturers, plus an "Other" escape hatch for free text. */
export const MANUFACTURERS = [
  'Carrier',
  'Trane',
  'Lennox',
  'Goodman / Amana',
  'Rheem / Ruud',
  'York',
  'Bryant',
  'American Standard',
  'Bosch',
  'Mitsubishi',
  'Daikin',
  'Other',
] as const;

/** Age brackets — a new unit and an old unit have very different likely causes. */
export const AGE_BRACKETS = [
  '< 1 yr',
  '1–5 yr',
  '5–10 yr',
  '10–15 yr',
  '15+ yr',
  'Unknown',
] as const;

/** True when any equipment field is present. */
export function hasEquipmentContext(ctx: EquipmentContext | undefined | null): ctx is EquipmentContext {
  return Boolean(ctx && (ctx.manufacturer || ctx.model || ctx.ageBracket));
}

/**
 * One-line human summary, e.g. "Carrier 25HBC060 · 10–15 yr". Used in the AI
 * prompt context, the history trail, and the saved session notes.
 */
export function formatEquipmentContext(ctx: EquipmentContext | undefined | null): string {
  if (!hasEquipmentContext(ctx)) return '';
  const brandModel = [ctx.manufacturer, ctx.model].filter(Boolean).join(' ');
  return [brandModel, ctx.ageBracket].filter(Boolean).join(' · ');
}
