import { NextResponse } from 'next/server';
import { z } from 'zod';
import { insertSession, listSessions } from '@/lib/db/sessions';
import { enrichedDiagnosisSchema } from '@/lib/ai/schemas';
import type { DiagnosticSessionPayload } from '@/lib/api/types';

const sessionSchema = z.object({
  path: z.array(z.string()).min(1),
  unitId: z.string().optional(),
  outcomeId: z.string().optional(),
  completedAt: z.string().optional(),
  notes: z.string().optional(),
  enrichment: enrichedDiagnosisSchema.optional(),
  claudeModel: z.string().optional(),
  promptVersion: z.string().optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = sessionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const payload = parsed.data as DiagnosticSessionPayload;
    const { id } = await insertSession(payload);
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/sessions]', error);
    const message = error instanceof Error ? error.message : 'Failed to save session';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const sessions = await listSessions();
    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('[GET /api/sessions]', error);
    const message = error instanceof Error ? error.message : 'Failed to load sessions';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
