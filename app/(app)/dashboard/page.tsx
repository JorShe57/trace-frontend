import Link from 'next/link';
import { Badge, ButtonLink, Card, EmptyState, PageHeading, SectionLabel } from '@/components/ui';
import { createClient } from '@/lib/supabase/server';
import { getNode } from '@/lib/engine';
import type { Job } from '@/lib/db/types';
import type { StoredSession } from '@/lib/db/sessions';

export const metadata = { title: 'Dashboard · T.R.A.C.E.' };

const OPEN_STATUSES = ['open', 'in_progress', 'on_hold'];

function startOfWeek(): string {
  const d = new Date();
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function outcomeTitle(s: StoredSession): string {
  if (s.title) return s.title;
  const node = s.outcome_id ? getNode(s.outcome_id) : undefined;
  return node && node.type === 'outcome' ? node.title : 'Diagnostic';
}

function Kpi({ label, value, href }: { label: string; value: number | string; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-card border border-border2 bg-bg2 px-4 py-4 transition-colors hover:border-accent"
    >
      <div className="font-head text-[30px] font-bold leading-none text-text">{value}</div>
      <div className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-text3">{label}</div>
    </Link>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const [openJobs, weekJobs, customerCount, reportCount, openJobsRes, sessionsRes] =
    await Promise.all([
      supabase.from('jobs').select('id', { count: 'exact', head: true }).neq('status', 'done').neq('status', 'cancelled'),
      supabase.from('jobs').select('id', { count: 'exact', head: true }).gte('scheduled_for', startOfWeek()),
      supabase.from('customers').select('id', { count: 'exact', head: true }),
      supabase.from('diagnostic_sessions').select('id', { count: 'exact', head: true }),
      supabase
        .from('jobs')
        .select('*')
        .in('status', OPEN_STATUSES)
        .order('scheduled_for', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false })
        .limit(8),
      supabase.from('diagnostic_sessions').select('*').order('created_at', { ascending: false }).limit(8),
    ]);

  const openJobList = (openJobsRes.data ?? []) as Job[];
  const sessions = (sessionsRes.data ?? []) as StoredSession[];

  return (
    <div>
      <PageHeading
        title="Dashboard"
        subtitle="Your open work, saved reports, and diagnostics in one place."
        action={
          <div className="flex items-center gap-2">
            <ButtonLink href="/diagnostic/ai" variant="primary">
              Start diagnostic →
            </ButtonLink>
          </div>
        }
      />

      <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Kpi label="Open jobs" value={openJobs.count ?? 0} href="/jobs" />
        <Kpi label="Scheduled this week" value={weekJobs.count ?? 0} href="/jobs" />
        <Kpi label="Customers" value={customerCount.count ?? 0} href="/customers" />
        <Kpi label="Saved reports" value={reportCount.count ?? sessions.length} href="/reports" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <section>
          <div className="mb-2 flex items-center justify-between">
            <SectionLabel>Open jobs</SectionLabel>
            <Link href="/jobs" className="font-mono text-[9px] text-text3 hover:text-accent">
              View all →
            </Link>
          </div>
          {openJobList.length === 0 ? (
            <EmptyState
              title="No open jobs"
              hint="Create a work order to start tracking visits."
              action={<ButtonLink href="/jobs/new">+ New job</ButtonLink>}
            />
          ) : (
            <Card className="divide-y divide-border">
              {openJobList.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-bg3"
                >
                  <Link href={`/jobs/${job.id}`} className="min-w-0 flex-1">
                    <div className="truncate text-[13px] text-text">{job.title}</div>
                    <div className="font-mono text-[9px] text-text3">
                      {job.scheduled_for
                        ? `Scheduled ${new Date(job.scheduled_for).toLocaleDateString()}`
                        : `Created ${new Date(job.created_at).toLocaleDateString()}`}
                    </div>
                  </Link>
                  <Badge tone={job.status}>{job.status.replace('_', ' ')}</Badge>
                  <ButtonLink
                    href={`/diagnostic/ai?job=${job.id}`}
                    variant="ghost"
                    className="hidden px-2 py-1 sm:inline-flex"
                  >
                    Diagnose
                  </ButtonLink>
                </div>
              ))}
            </Card>
          )}
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <SectionLabel>Saved reports</SectionLabel>
            <Link href="/reports" className="font-mono text-[9px] text-text3 hover:text-accent">
              View all →
            </Link>
          </div>
          {sessions.length === 0 ? (
            <EmptyState
              title="No saved reports yet"
              hint="Run a diagnostic and tap “Save report” to keep it here."
              action={<ButtonLink href="/diagnostic/ai">Start a diagnostic →</ButtonLink>}
            />
          ) : (
            <Card className="divide-y divide-border">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-2 px-4 py-3 transition-colors hover:bg-bg3"
                >
                  <Link href={`/reports/${s.id}`} className="min-w-0 flex-1">
                    <div className="truncate text-[13px] text-text">{outcomeTitle(s)}</div>
                    <div className="font-mono text-[9px] text-text3">
                      {new Date(s.created_at).toLocaleDateString()}
                    </div>
                  </Link>
                  {s.enrichment && <Badge tone="open">AI</Badge>}
                  <ButtonLink
                    href={`/reports/${s.id}/chat`}
                    variant="ghost"
                    className="px-2 py-1"
                  >
                    Ask Trace
                  </ButtonLink>
                </div>
              ))}
            </Card>
          )}
        </section>
      </div>

      <div className="mt-5 rounded-card border border-border2 bg-bg2 px-4 py-3">
        <SectionLabel>Quick start</SectionLabel>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href="/diagnostic/ai">AI diagnostic</ButtonLink>
          <ButtonLink href="/jobs/new" variant="ghost">
            + New job
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
