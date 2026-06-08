import { DiagnosticView } from '@/components/DiagnosticView';
import { ROOT_ID } from '@/lib/engine';

/**
 * URL-driven diagnostic. The optional catch-all maps the path segments
 * (e.g. /diagnostic/start/complaint_ac/power_check) straight onto the
 * tree's node-id chain, so every step is deep-linkable and shareable.
 */
export default function DiagnosticPage({ params }: { params: { path?: string[] } }) {
  const path = params.path && params.path.length > 0 ? params.path : [ROOT_ID];
  return <DiagnosticView path={path} />;
}
