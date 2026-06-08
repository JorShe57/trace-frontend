import { NextResponse } from 'next/server';
import { z } from 'zod';
import { buildReportContext } from '@/lib/ai/build-report-context';
import { runFollowUpChat } from '@/lib/ai/follow-up-chat';
import { getUserSession } from '@/lib/db/sessions';
import { hasAnthropicApiKey, isAiDiagnosisEnabled } from '@/lib/env';
import { createClient } from '@/lib/supabase/server';

const messageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(8000),
});

const requestSchema = z.object({
  messages: z.array(messageSchema).min(1).max(50),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
  }

  const session = await getUserSession(supabase, id);
  if (!session) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }

  if (!isAiDiagnosisEnabled() || !hasAnthropicApiKey()) {
    return NextResponse.json(
      { error: 'AI assistant is not available. Check your API configuration.' },
      { status: 503 },
    );
  }

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

  try {
    const reportContext = buildReportContext(session);
    const reply = await runFollowUpChat(reportContext, parsed.data.messages);
    return NextResponse.json({ reply });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI request failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
