import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/server';
import { HomeLanding } from '@/components/HomeLanding';

/** Landing screen: brand intro, auth CTAs. Signed-in users go straight to the dashboard. */
export default async function Home() {
  const user = await getCurrentUser();
  if (user) redirect('/dashboard');
  return <HomeLanding />;
}
