import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ReportFollowUpChat } from '@/components/ReportFollowUpChat';
import { createClient } from '@/lib/supabase/server';
import { getUserSession } from '@/lib/db/sessions';
import { getNode, selectedUnit } from '@/lib/engine';

export const metadata = { title: 'Field assistant · TRACE' };

export default async function ReportChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const session = await getUserSession(supabase, id);
  if (!session) notFound();

  const outcomeNode = session.outcome_id ? getNode(session.outcome_id) : undefined;
  const outcome = outcomeNode && outcomeNode.type === 'outcome' ? outcomeNode : null;
  const unit = selectedUnit(session.path);
  const e = session.enrichment;

  const title = session.title || outcome?.title || 'Diagnostic report';
  const finding = e?.finding ?? outcome?.finding;
  const steps = e?.steps?.length ? e.steps : outcome?.steps;
  const firstStep = steps?.[0] ?? null;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <Link href={`/reports/${id}`} className="text-[12.5px] text-text3 hover:text-accent">
          ← Back to report
        </Link>
        {unit && (
          <span className="text-[12px] text-text3">{unit.name}</span>
        )}
      </div>

      <div className="mb-5">
        <h1 className="text-[20px] font-semibold tracking-[-0.02em] text-text">
          Continue with AI
        </h1>
        <p className="mt-1 text-[12px] text-text2">
          Talk through the repair steps for <span className="text-text">{title}</span>.
          The assistant has your full diagnostic path and report context.
        </p>
      </div>

      <ReportFollowUpChat
        reportId={id}
        reportTitle={title}
        finding={finding}
        firstStep={firstStep}
      />
    </div>
  );
}
