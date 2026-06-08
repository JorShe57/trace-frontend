import Link from 'next/link';
import { Badge, ButtonLink, Card, EmptyState, PageHeading, SectionLabel } from '@/components/ui';
import { createClient } from '@/lib/supabase/server';
import { getNode } from '@/lib/engine';
import type { Job } from '@/lib/db/types';
import type { StoredSession } from '@/lib/db/sessions';

export const metadata = { title: 'Dashboard · T.R.A.C.E.' };

function startOfWeek(): string {
  const d = new Date();
  const day = (d.getDay() + 6) % 7; // Monday-based
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

  const [openJobs, weekJobs, customerCount, reportCount, recentJobsRes, recentSessionsRes] =
    await Promise.all([
      supabase.from('jobs').select('id', { count: 'exact', head: true }).neq('status', 'done').neq('status', 'cancelled'),
      supabase.from('jobs').select('id', { count: 'exact', head: true }).gte('scheduled_for', startOfWeek()),
      supabase.from('customers').select('id', { count: 'exact', head: true }),
      supabase.from('diagnostic_sessions').select('id', { count: 'exact', head: true }),
      supabase.from('jobs').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('diagnostic_sessions').select('*').order('created_at', { ascending: false }).limit(5),
    ]);

  const recentJobs = (recentJobsRes.data ?? []) as Job[];
  const recentSessions = (recentSessionsRes.data ?? []) as StoredSession[];

  return (
    <div>
      <PageHeading
        title="Dashboard"
        subtitle="Your field workload at a glance."
        action={<ButtonLink href="/diagnostic/start">Start a diagnostic →</ButtonLink>}
      />

      <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Kpi label="Open jobs" value={openJobs.count ?? 0} href="/jobs" />
        <Kpi label="Scheduled this week" value={weekJobs.count ?? 0} href="/jobs" />
        <Kpi label="Customers" value={customerCount.count ?? 0} href="/customers" />
        <Kpi label="Saved reports" value={reportCount.count ?? recentSessions.length} href="/reports" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <section>
          <SectionLabel>Recent jobs</SectionLabel>
          {recentJobs.length === 0 ? (
            <EmptyState
              title="No jobs yet"
              hint="Create a work order to start tracking visits."
              action={<ButtonLink href="/jobs/new">+ New job</ButtonLink>}
            />
          ) : (
            <Card className="divide-y divide-border">
              {recentJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-bg3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] text-text">{job.title}</div>
                    <div className="font-mono text-[9px] text-text3">
                      {new Date(job.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge tone={job.status}>{job.status.replace('_', ' ')}</Badge>
                </Link>
              ))}
            </Card>
          )}
        </section>

        <section>
          <SectionLabel>Recent diagnostics</SectionLabel>
          {recentSessions.length === 0 ? (
            <EmptyState
              title="No saved reports yet"
              hint="Finish a diagnostic and tap “Save report” to keep it here."
              action={<ButtonLink href="/diagnostic/start">Start a diagnostic →</ButtonLink>}
            />
          ) : (
            <Card className="divide-y divide-border">
              {recentSessions.map((s) => (
                <Link
                  key={s.id}
                  href={`/reports/${s.id}`}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-bg3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] text-text">{outcomeTitle(s)}</div>
                    <div className="font-mono text-[9px] text-text3">
                      {new Date(s.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  {s.enrichment && <Badge tone="open">AI</Badge>}
                </Link>
              ))}
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}
