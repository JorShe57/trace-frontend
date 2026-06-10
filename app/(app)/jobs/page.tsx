import Link from 'next/link';
import { Badge, ButtonLink, Card, EmptyState, PageHeading } from '@/components/ui';
import { createClient } from '@/lib/supabase/server';
import { JOB_STATUSES, type Job } from '@/lib/db/types';

export const metadata = { title: 'Jobs · TRACE' };

const OPEN_STATUSES = ['open', 'in_progress', 'on_hold'];

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from('jobs').select('*');
  if (status && status !== 'all') query = query.eq('status', status);
  const { data } = await query.order('scheduled_for', { ascending: true, nullsFirst: false }).order('created_at', { ascending: false });
  const jobs = (data ?? []) as Job[];

  const filters = [
    { value: 'all', label: 'All' },
    ...JOB_STATUSES.map((s) => ({ value: s.value, label: s.label })),
  ];
  const active = status ?? 'all';

  return (
    <div>
      <PageHeading
        title="Jobs"
        subtitle="Work orders and scheduled visits."
        action={<ButtonLink href="/jobs/new">+ New job</ButtonLink>}
      />

      <div className="mb-4 flex flex-wrap gap-1.5">
        {filters.map((f) => (
          <Link
            key={f.value}
            href={f.value === 'all' ? '/jobs' : `/jobs?status=${f.value}`}
            className={`rounded-md border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.05em] transition-colors ${
              active === f.value
                ? 'border-accent/40 bg-[var(--accent-dim)] text-accent'
                : 'border-border2 text-text3 hover:text-text2'
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          title="No jobs here"
          hint="Create a work order to schedule a visit and track it to completion."
          action={<ButtonLink href="/jobs/new">+ New job</ButtonLink>}
        />
      ) : (
        <Card className="divide-y divide-border">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-bg3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-[13px] text-text">{job.title}</span>
                  {job.priority !== 'normal' && OPEN_STATUSES.includes(job.status) && (
                    <Badge tone={job.priority}>{job.priority}</Badge>
                  )}
                </div>
                <div className="mt-0.5 text-[12px] text-text3">
                  {job.scheduled_for
                    ? `Scheduled ${new Date(job.scheduled_for).toLocaleString()}`
                    : `Created ${new Date(job.created_at).toLocaleDateString()}`}
                </div>
              </div>
              <Badge tone={job.status}>{job.status.replace('_', ' ')}</Badge>
            </Link>
          ))}
        </Card>
      )}
    </div>
  );
}
