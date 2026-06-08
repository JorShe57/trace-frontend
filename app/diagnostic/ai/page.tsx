import { AiDiagnosticView } from '@/components/AiDiagnosticView';

/**
 * AI-driven diagnostic. The model reasons one step at a time from the
 * equipment + complaint, so there is no addressable node path — state lives in
 * the client.
 */
export default async function AiDiagnosticPage({
  searchParams,
}: {
  searchParams: Promise<{ job?: string }>;
}) {
  const { job } = await searchParams;
  return <AiDiagnosticView jobId={job} />;
}
