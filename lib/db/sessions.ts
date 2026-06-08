import { getSupabaseAdmin } from '@/lib/supabase/admin';
import type { DiagnosticSessionPayload } from '@/lib/api/types';

export interface StoredSession {
  id: string;
  path: string[];
  unit_id: string | null;
  outcome_id: string | null;
  completed_at: string | null;
  notes: string | null;
  enrichment: DiagnosticSessionPayload['enrichment'] | null;
  claude_model: string | null;
  prompt_version: string | null;
  created_at: string;
}

export async function insertSession(
  payload: DiagnosticSessionPayload,
): Promise<{ id: string }> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('diagnostic_sessions')
    .insert({
      path: payload.path,
      unit_id: payload.unitId ?? null,
      outcome_id: payload.outcomeId ?? null,
      completed_at: payload.completedAt ?? new Date().toISOString(),
      notes: payload.notes ?? null,
      enrichment: payload.enrichment ?? null,
      claude_model: payload.claudeModel ?? null,
      prompt_version: payload.promptVersion ?? null,
    })
    .select('id')
    .single();

  if (error) throw error;
  return { id: data.id };
}

export async function listSessions(limit = 50): Promise<StoredSession[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('diagnostic_sessions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as StoredSession[];
}
