import { DiagnosticView } from '@/components/DiagnosticView';
import { ROOT_ID } from '@/lib/engine';

/**
 * URL-driven diagnostic. The optional catch-all maps the path segments
 * (e.g. /diagnostic/start/complaint_ac/power_check) straight onto the
 * tree's node-id chain, so every step is deep-linkable and shareable.
 */
export default async function DiagnosticPage({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}) {
  const { path: pathSegments } = await params;
  const path = pathSegments && pathSegments.length > 0 ? pathSegments : [ROOT_ID];
  return <DiagnosticView path={path} />;
}
