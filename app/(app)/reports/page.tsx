import Link from 'next/link';
import { Badge, ButtonLink, Card, EmptyState, PageHeading } from '@/components/ui';
import { createClient } from '@/lib/supabase/server';
import { listUserSessions, type StoredSession } from '@/lib/db/sessions';
import { getNode, selectedUnit } from '@/lib/engine';

export const metadata = { title: 'Reports · TRACE' };

function title(s: StoredSession): string {
  if (s.title) return s.title;
  const node = s.outcome_id ? getNode(s.outcome_id) : undefined;
  return node && node.type === 'outcome' ? node.title : 'Diagnostic';
}

export default async function ReportsPage() {
  const supabase = await createClient();
  const sessions = await listUserSessions(supabase);

  return (
    <div>
      <PageHeading
        title="Reports"
        subtitle="Every diagnostic you've saved."
        action={<ButtonLink href="/diagnostic/ai">Start a diagnostic →</ButtonLink>}
      />

      {sessions.length === 0 ? (
        <EmptyState
          title="No saved reports yet"
          hint="Walk a complaint to an outcome, then tap “Save report” to keep it here for the customer or the office."
          action={<ButtonLink href="/diagnostic/ai">Start a diagnostic →</ButtonLink>}
        />
      ) : (
        <Card className="divide-y divide-border">
          {sessions.map((s) => {
            const unit = selectedUnit(s.path);
            return (
              <div
                key={s.id}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-bg3"
              >
                <Link href={`/reports/${s.id}`} className="min-w-0 flex-1">
                  <div className="truncate text-[13px] text-text">{title(s)}</div>
                  <div className="mt-0.5 text-[12px] text-text3">
                    {[unit ? unit.name : null, new Date(s.created_at).toLocaleString()]
                      .filter(Boolean)
                      .join(' · ')}
                  </div>
                </Link>
                {s.enrichment?.confidence && <Badge tone="open">{s.enrichment.confidence}</Badge>}
                {s.enrichment && <Badge tone="open">AI</Badge>}
                <ButtonLink href={`/reports/${s.id}/chat`} variant="ghost" className="px-2 py-1">
                  Ask Trace
                </ButtonLink>
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}
