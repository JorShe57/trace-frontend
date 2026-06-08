import type {
  DiagnosticSessionPayload,
  EnrichDiagnosisRequest,
  EnrichDiagnosisResponse,
  SaveSessionResponse,
} from './types';

async function parseJson<T>(res: Response): Promise<T> {
  const data = (await res.json()) as T & { error?: string };
  if (!res.ok) {
    throw new Error(
      typeof data === 'object' && data && 'error' in data && data.error
        ? String(data.error)
        : `Request failed (${res.status})`,
    );
  }
  return data;
}

export async function enrichDiagnosis(
  payload: EnrichDiagnosisRequest,
): Promise<EnrichDiagnosisResponse> {
  const res = await fetch('/api/diagnose/enrich', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return parseJson<EnrichDiagnosisResponse>(res);
}

export async function saveSession(
  payload: DiagnosticSessionPayload,
): Promise<SaveSessionResponse> {
  const res = await fetch('/api/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return parseJson<SaveSessionResponse>(res);
}
