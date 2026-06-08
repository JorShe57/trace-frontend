import type { EnrichDiagnosisRequest } from '@/lib/api/types';
import { formatEquipmentContext } from '@/lib/equipment';

/** Compact, structured context for the Claude prompt. */
export function buildDiagnosisContext(req: EnrichDiagnosisRequest): string {
  const lines: string[] = [];

  if (req.unit) {
    lines.push(`Equipment: ${req.unit.name} (id: ${req.unit.id})`);
  }
  const equipment = formatEquipmentContext(req.equipment);
  if (equipment) {
    lines.push(`Equipment details: ${equipment} (tailor likely causes to brand/model/age)`);
  }

  lines.push('');
  lines.push('Diagnostic path taken:');
  if (req.history.length === 0) {
    lines.push('  (no prior steps recorded)');
  } else {
    for (const [i, entry] of req.history.entries()) {
      const phase = entry.phase ? `[${entry.phase}] ` : '';
      lines.push(`  ${i + 1}. ${phase}${entry.question} → ${entry.answer}`);
    }
  }

  lines.push('');
  lines.push('Tree outcome (do not contradict unless safety-critical):');
  lines.push(`  Title: ${req.outcome.title}`);
  if (req.outcome.finding) lines.push(`  Finding: ${req.outcome.finding}`);
  if (req.outcome.safety) lines.push(`  Safety: ${req.outcome.safety}`);
  if (req.outcome.steps?.length) {
    lines.push('  Base steps:');
    req.outcome.steps.forEach((s, i) => lines.push(`    ${i + 1}. ${s}`));
  }
  if (req.outcome.tools?.length) {
    lines.push(`  Base tools: ${req.outcome.tools.join(' · ')}`);
  }

  if (req.technicianNotes?.trim()) {
    lines.push('');
    lines.push(`Technician notes: ${req.technicianNotes.trim()}`);
  }

  return lines.join('\n');
}
