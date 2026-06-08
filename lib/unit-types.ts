/**
 * Equipment-type options for the project tracker. Values mirror the unit ids
 * in the diagnostic tree's entry node (lib/tree.ts) so an equipment record can
 * line up with a diagnostic walk later on.
 */
export interface UnitTypeOption {
  value: string;
  label: string;
}

export const UNIT_TYPE_OPTIONS: UnitTypeOption[] = [
  { value: 'ac', label: '❄️ A/C — central split' },
  { value: 'hp', label: '🔄 Heat Pump' },
  { value: 'pkg', label: '📦 Package / RTU' },
  { value: 'furnace', label: '🔥 Gas Furnace' },
  { value: 'boiler', label: '♨️ Boiler' },
  { value: 'mini', label: '🌡️ Mini-Split' },
  { value: 'ref', label: '🧊 Comm. Refrigeration' },
  { value: 'ahu', label: '💨 Air Handler' },
  { value: 'other', label: '🔧 Other / Advanced' },
];

export function unitTypeLabel(value: string | null | undefined): string | null {
  if (!value) return null;
  return UNIT_TYPE_OPTIONS.find((u) => u.value === value)?.label ?? value;
}
