import { NextResponse } from 'next/server';
import { z } from 'zod';
import { enrichDiagnosis } from '@/lib/ai/enrich';
import type { EnrichDiagnosisRequest } from '@/lib/api/types';

const historyEntrySchema = z.object({
  nodeId: z.string(),
  question: z.string(),
  answer: z.string(),
  style: z.enum(['', 'yes', 'warn', 'no']),
  phase: z.string(),
});

const requestSchema = z.object({
  path: z.array(z.string()).min(1),
  history: z.array(historyEntrySchema),
  unit: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .nullable(),
  outcome: z.object({
    nodeId: z.string(),
    title: z.string(),
    finding: z.string().optional(),
    safety: z.string().nullable().optional(),
    steps: z.array(z.string()).optional(),
    tools: z.array(z.string()).optional(),
  }),
  equipment: z
    .object({
      manufacturer: z.string().optional(),
      model: z.string().optional(),
      ageBracket: z.string().optional(),
    })
    .optional(),
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

  const payload = parsed.data as EnrichDiagnosisRequest;
  const result = await enrichDiagnosis(payload);
  return NextResponse.json(result);
}
