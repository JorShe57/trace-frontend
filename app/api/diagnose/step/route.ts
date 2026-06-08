import { NextResponse } from 'next/server';
import { z } from 'zod';
import { runDiagnoseStep } from '@/lib/ai/diagnose-step';
import type { AiDiagnoseRequest } from '@/lib/api/types';

const requestSchema = z.object({
  unit: z.object({ id: z.string(), name: z.string() }),
  complaint: z.string().min(1),
  history: z
    .array(z.object({ question: z.string(), answer: z.string() }))
    .max(20),
  technicianNotes: z.string().optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const result = await runDiagnoseStep(parsed.data as AiDiagnoseRequest);
  return NextResponse.json(result);
}
