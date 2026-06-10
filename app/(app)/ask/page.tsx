import { AskTraceChat } from '@/components/AskTraceChat';
import { PageHeading } from '@/components/ui';

export const metadata = { title: 'Ask Trace · TRACE' };

export default async function AskPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return (
    <div>
      <PageHeading
        title="Ask Trace"
        subtitle="Your HVAC/R field assistant — ask how to test, measure, or troubleshoot anything."
      />
      <AskTraceChat initialQuestion={q} />
    </div>
  );
}
