import { getCurrentUser } from '@/lib/supabase/server';
import { HomeLanding } from '@/components/HomeLanding';

/** Landing screen: brand intro, auth or diagnostic CTAs, and resume-last-session. */
export default async function Home() {
  const user = await getCurrentUser();
  return <HomeLanding isSignedIn={!!user} />;
}
