import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge, Button, ButtonLink, Card, SectionLabel } from '@/components/ui';
import { createClient } from '@/lib/supabase/server';
import { getUserSession } from '@/lib/db/sessions';
import { buildHistory, getNode, selectedUnit } from '@/lib/engine';
import { deleteReport } from '../actions';

export const metadata = { title: 'Report · TRACE' };

export default async function ReportDetailPage({
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
  const history = buildHistory(session.path);
  const e = session.enrichment;

  const title = session.title || outcome?.title || 'Diagnostic report';
  const finding = e?.finding ?? outcome?.finding;
  const steps = e?.steps?.length ? e.steps : outcome?.steps;
  const tools = e?.tools?.length ? e.tools : outcome?.tools;
  const safety = e?.safety ?? outcome?.safety;
  const danger = Boolean(safety);

  return (
    <div>
      <div className="mb-4">
        <Link href="/reports" className="text-[12.5px] text-text3 hover:text-accent">
          ← All reports
        </Link>
      </div>

      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-text">{title}</h1>
          <div className="mt-1 text-[12.5px] text-text3">
            {[unit?.name, new Date(session.created_at).toLocaleString()].filter(Boolean).join(' · ')}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {e?.confidence && <Badge tone="open">{e.confidence} confidence</Badge>}
          <ButtonLink href={`/reports/${session.id}/chat`}>
            Continue with AI →
          </ButtonLink>
        </div>
      </div>

      {safety && (
        <div className="mb-4 flex items-start gap-2 rounded-card border border-danger/30 bg-[var(--red-bg)] px-4 py-3 text-[12px] leading-[1.5] text-danger">
          <span aria-hidden="true">⚠</span>
          <span>{safety}</span>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-[1fr_240px]">
        <div className="flex flex-col gap-5">
          {e?.summary && (
            <Card className="border-accent/20 px-4 py-3">
              <SectionLabel>Field context</SectionLabel>
              <p className="text-[13px] leading-[1.6] text-text">{e.summary}</p>
              {e.rationale && <p className="mt-2 text-[11px] leading-[1.5] text-text2">{e.rationale}</p>}
            </Card>
          )}

          {finding && (
            <Card className="px-4 py-3">
              <SectionLabel>Finding</SectionLabel>
              <p className="text-[13px] leading-[1.6] text-text">{finding}</p>
            </Card>
          )}

          {steps && steps.length > 0 && (
            <Card className="px-4 py-3">
              <div className="mb-2 flex items-center justify-between">
                <SectionLabel>Next steps</SectionLabel>
                <ButtonLink href={`/reports/${session.id}/chat`} variant="ghost" className="px-2 py-1">
                  Talk through these →
                </ButtonLink>
              </div>
              <ol className="flex flex-col gap-1.5">
                {steps.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 rounded-lg border border-border2 bg-bg3 px-3 py-[9px] text-[12px] leading-[1.5] text-text"
                  >
                    <span className="mt-px flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full border border-accent/30 bg-[var(--accent-dim)] text-[12px] text-accent">
                      {i + 1}
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </Card>
          )}

          {tools && tools.length > 0 && (
            <Card className="px-4 py-3">
              <SectionLabel>Tools needed</SectionLabel>
              <p className="text-[13px] leading-[1.6] text-accent">{tools.join(' · ')}</p>
            </Card>
          )}

          {e?.watchouts && e.watchouts.length > 0 && (
            <Card className="px-4 py-3">
              <SectionLabel>Watch-outs</SectionLabel>
              <ul className="flex flex-col gap-1">
                {e.watchouts.map((w, i) => (
                  <li key={i} className="text-[11px] leading-[1.45] text-warn before:mr-1 before:content-['▸']">
                    {w}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {session.notes && (
            <Card className="px-4 py-3">
              <SectionLabel>Technician notes</SectionLabel>
              <p className="whitespace-pre-wrap text-[12px] leading-[1.5] text-text2">{session.notes}</p>
            </Card>
          )}
        </div>

        <aside className="flex flex-col gap-4">
          <Card className="px-4 py-3">
            <SectionLabel>Path walked</SectionLabel>
            <ol className="flex flex-col gap-1.5">
              {history.map((h, i) => (
                <li key={i} className="text-[11px] leading-[1.4]">
                  <span className="text-text3">{h.question}</span>
                  <br />
                  <span className="text-text">→ {h.answer}</span>
                </li>
              ))}
            </ol>
          </Card>

          <form action={deleteReport}>
            <input type="hidden" name="id" value={session.id} />
            <Button type="submit" variant="danger" className="w-full justify-center">
              Delete report
            </Button>
          </form>
        </aside>
      </div>
    </div>
  );
}
