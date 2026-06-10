import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AuthShell } from '@/components/AuthShell';
import { Button, Card, ErrorBanner, Field, Input } from '@/components/ui';
import { getCurrentUser } from '@/lib/supabase/server';
import { signIn } from './actions';

export const metadata = { title: 'Sign in · TRACE' };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; notice?: string; redirect?: string }>;
}) {
  const { error, notice, redirect: redirectTo } = await searchParams;

  // Already signed in — skip the form.
  if (await getCurrentUser()) redirect(redirectTo || '/dashboard');

  return (
    <AuthShell tagline="Field Diagnostics &amp; Project Tracker">
      <Card className="px-6 py-7 shadow-pop">
        <h1 className="mb-1 text-[18px] font-semibold tracking-[-0.015em] text-text">Sign in</h1>
        <p className="mb-4 text-[12px] text-text2">Access your reports, customers and jobs.</p>

        {notice && (
          <div className="mb-3 rounded-lg border border-accent/30 bg-[var(--accent-faint)] px-3 py-2 text-[12px] text-accent">
            {notice}
          </div>
        )}
        <ErrorBanner message={error} />

        <form action={signIn} className="flex flex-col gap-3">
          <input type="hidden" name="redirect" value={redirectTo ?? ''} />
          <Field label="Email" name="email">
            <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" />
          </Field>
          <Field label="Password" name="password">
            <Input id="password" name="password" type="password" autoComplete="current-password" required />
          </Field>
          <Button type="submit" className="mt-1 w-full justify-center">
            Sign in →
          </Button>
        </form>
      </Card>

      <p className="mt-4 text-center text-[12px] text-text2">
        New here?{' '}
        <Link
          href={redirectTo ? `/signup?redirect=${encodeURIComponent(redirectTo)}` : '/signup'}
          className="text-accent hover:underline"
        >
          Create an account
        </Link>
      </p>
      <p className="mt-2 text-center text-[11px] text-text3">
        <Link href="/" className="hover:text-text2">
          ← Back to home
        </Link>
      </p>
    </AuthShell>
  );
}
