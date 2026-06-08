import type { SupabaseClient } from '@supabase/supabase-js';
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
  user_id: string | null;
  equipment_id: string | null;
  job_id: string | null;
  title: string | null;
}

/** Map an API payload onto a `diagnostic_sessions` row (sans user_id). */
function toRow(payload: DiagnosticSessionPayload) {
  return {
    path: payload.path,
    unit_id: payload.unitId ?? null,
    outcome_id: payload.outcomeId ?? null,
    completed_at: payload.completedAt ?? new Date().toISOString(),
    notes: payload.notes ?? null,
    enrichment: payload.enrichment ?? null,
    claude_model: payload.claudeModel ?? null,
    prompt_version: payload.promptVersion ?? null,
    equipment_id: payload.equipmentId ?? null,
    job_id: payload.jobId ?? null,
    title: payload.title ?? null,
  };
}

/**
 * Persist a completed session. When a `client` + `userId` are supplied the
 * row is written through the user's RLS-scoped client and tagged with their
 * id; otherwise it falls back to an anonymous service-role write (legacy /
 * signed-out behaviour).
 */
export async function insertSession(
  payload: DiagnosticSessionPayload,
  options?: { client?: SupabaseClient; userId?: string },
): Promise<{ id: string }> {
  const supabase = options?.client ?? getSupabaseAdmin();
  const { data, error } = await supabase
    .from('diagnostic_sessions')
    .insert({ ...toRow(payload), user_id: options?.userId ?? null })
    .select('id')
    .single();

  if (error) throw error;
  return { id: data.id };
}

/** All sessions for the signed-in user, newest first (RLS-scoped client). */
export async function listUserSessions(
  client: SupabaseClient,
  limit = 100,
): Promise<StoredSession[]> {
  const { data, error } = await client
    .from('diagnostic_sessions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as StoredSession[];
}

/** A single session by id (RLS ensures it belongs to the caller). */
export async function getUserSession(
  client: SupabaseClient,
  id: string,
): Promise<StoredSession | null> {
  const { data, error } = await client
    .from('diagnostic_sessions')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return (data as StoredSession) ?? null;
}
