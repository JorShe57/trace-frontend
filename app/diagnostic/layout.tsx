import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/server';

/**
 * Diagnostic routes require a signed-in technician with a profile. The
 * middleware gate in proxy.ts handles the redirect; this layout is the
 * belt-and-braces check before rendering the tool.
 */
export default async function DiagnosticLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login?redirect=/diagnostic/ai');

  return children;
}
