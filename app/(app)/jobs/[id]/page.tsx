import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge, Button, ButtonLink, Card, SectionLabel, Select } from '@/components/ui';
import { createClient } from '@/lib/supabase/server';
import { JOB_STATUSES, type Customer, type Job } from '@/lib/db/types';
import { getNode } from '@/lib/engine';
import type { StoredSession } from '@/lib/db/sessions';
import { deleteJob, updateJobStatus } from '../actions';

export const metadata = { title: 'Job · T.R.A.C.E.' };

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: job } = await supabase.from('jobs').select('*').eq('id', id).maybeSingle<Job>();
  if (!job) notFound();

  const [{ data: customer }, { data: linkedSessions }] = await Promise.all([
    job.customer_id
      ? supabase.from('customers').select('*').eq('id', job.customer_id).maybeSingle<Customer>()
      : Promise.resolve({ data: null }),
    supabase.from('diagnostic_sessions').select('*').eq('job_id', id).order('created_at', { ascending: false }),
  ]);
  const sessions = (linkedSessions ?? []) as StoredSession[];

  const sessionTitle = (s: StoredSession) => {
    if (s.title) return s.title;
    const node = s.outcome_id ? getNode(s.outcome_id) : undefined;
    return node && node.type === 'outcome' ? node.title : 'Diagnostic';
  };

  return (
    <div>
      <div className="mb-4">
        <Link href="/jobs" className="font-mono text-[10px] text-text3 hover:text-accent">
          ← Jobs
        </Link>
      </div>

      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Badge tone={job.status}>{job.status.replace('_', ' ')}</Badge>
            {job.priority !== 'normal' && <Badge tone={job.priority}>{job.priority}</Badge>}
          </div>
          <h1 className="font-head text-[24px] font-bold tracking-[0.06em] text-text">{job.title}</h1>
          <div className="mt-1 font-mono text-[10px] text-text3">
            {[
              customer ? customer.name : null,
              job.scheduled_for ? `Scheduled ${new Date(job.scheduled_for).toLocaleString()}` : null,
            ]
              .filter(Boolean)
              .join(' · ') || `Created ${new Date(job.created_at).toLocaleDateString()}`}
          </div>
        </div>
        <form action={deleteJob}>
          <input type="hidden" name="id" value={job.id} />
          <Button type="submit" variant="danger" className="px-2.5 py-1.5">
            Delete
          </Button>
        </form>
      </div>

      <div className="grid gap-5 sm:grid-cols-[1fr_240px]">
        <div className="flex flex-col gap-5">
          {job.description && (
            <Card className="px-4 py-3">
              <SectionLabel>Description</SectionLabel>
              <p className="whitespace-pre-wrap text-[13px] leading-[1.6] text-text">{job.description}</p>
            </Card>
          )}

          <Card className="px-4 py-3">
            <div className="mb-2 flex items-center justify-between">
              <SectionLabel>Diagnostics on this job</SectionLabel>
              <ButtonLink
                href={`/diagnostic/ai?job=${job.id}`}
                variant="ghost"
                className="px-2 py-1"
              >
                + Run diagnostic
              </ButtonLink>
            </div>
            {sessions.length === 0 ? (
              <p className="py-2 text-[12px] text-text3">No diagnostics linked yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {sessions.map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-3 py-2.5">
                    <Link href={`/reports/${s.id}`} className="min-w-0 flex-1 hover:text-accent">
                      <span className="truncate text-[13px] text-text">{sessionTitle(s)}</span>
                      <span className="block font-mono text-[9px] text-text3">
                        {new Date(s.created_at).toLocaleDateString()}
                      </span>
                    </Link>
                    <ButtonLink href={`/reports/${s.id}/chat`} variant="ghost" className="px-2 py-1">
                      Ask AI
                    </ButtonLink>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <aside>
          <Card className="px-4 py-3">
            <SectionLabel>Update status</SectionLabel>
            <form action={updateJobStatus} className="flex flex-col gap-2">
              <input type="hidden" name="id" value={job.id} />
              <Select name="status" defaultValue={job.status}>
                {JOB_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </Select>
              <Button type="submit" className="w-full justify-center">
                Save
              </Button>
            </form>
            {job.completed_at && (
              <p className="mt-2 font-mono text-[9px] text-text3">
                Completed {new Date(job.completed_at).toLocaleString()}
              </p>
            )}
          </Card>
        </aside>
      </div>
    </div>
  );
}
