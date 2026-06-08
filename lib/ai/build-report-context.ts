import { buildHistory, getNode, selectedUnit } from '@/lib/engine';
import type { StoredSession } from '@/lib/db/sessions';

/** Compact context block for the follow-up field agent from a saved report. */
export function buildReportContext(session: StoredSession): string {
  const lines: string[] = [];
  const unit = selectedUnit(session.path);
  const history = buildHistory(session.path);
  const outcomeNode = session.outcome_id ? getNode(session.outcome_id) : undefined;
  const outcome = outcomeNode && outcomeNode.type === 'outcome' ? outcomeNode : null;
  const e = session.enrichment;

  const title = session.title || outcome?.title || 'Diagnostic report';
  lines.push(`Report: ${title}`);
  if (unit) lines.push(`Equipment: ${unit.name} (id: ${unit.id})`);
  if (session.completed_at) {
    lines.push(`Completed: ${new Date(session.completed_at).toLocaleString()}`);
  }

  lines.push('');
  lines.push('Diagnostic path taken:');
  if (history.length === 0) {
    lines.push('  (no prior steps recorded)');
  } else {
    for (const [i, entry] of history.entries()) {
      const phase = entry.phase ? `[${entry.phase}] ` : '';
      lines.push(`  ${i + 1}. ${phase}${entry.question} → ${entry.answer}`);
    }
  }

  lines.push('');
  lines.push('Diagnosis & recommendations:');
  if (e?.summary) lines.push(`  Summary: ${e.summary}`);
  const finding = e?.finding ?? outcome?.finding;
  if (finding) lines.push(`  Finding: ${finding}`);
  const safety = e?.safety ?? outcome?.safety;
  if (safety) lines.push(`  Safety: ${safety}`);
  const steps = e?.steps?.length ? e.steps : outcome?.steps;
  if (steps?.length) {
    lines.push('  Recommended steps:');
    steps.forEach((s, i) => lines.push(`    ${i + 1}. ${s}`));
  }
  const tools = e?.tools?.length ? e.tools : outcome?.tools;
  if (tools?.length) lines.push(`  Tools: ${tools.join(' · ')}`);
  if (e?.watchouts?.length) {
    lines.push('  Watch-outs:');
    e.watchouts.forEach((w) => lines.push(`    - ${w}`));
  }
  if (e?.rationale) lines.push(`  Rationale: ${e.rationale}`);
  if (e?.confidence) lines.push(`  Confidence: ${e.confidence}`);

  if (session.notes?.trim()) {
    lines.push('');
    lines.push(`Technician notes: ${session.notes.trim()}`);
  }

  return lines.join('\n');
}
