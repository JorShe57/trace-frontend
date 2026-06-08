import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AuthShell } from '@/components/AuthShell';
import { Button, Card, ErrorBanner, Field, Input } from '@/components/ui';
import { getCurrentUser } from '@/lib/supabase/server';
import { signUp } from '@/app/login/actions';

export const metadata = { title: 'Create account · T.R.A.C.E.' };

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  if (await getCurrentUser()) redirect('/dashboard');

  return (
    <AuthShell tagline="Field Diagnostics &amp; Project Tracker">
      <Card className="px-5 py-6">
        <h1 className="mb-1 font-head text-[18px] font-bold tracking-[0.06em] text-text">
          Create your account
        </h1>
        <p className="mb-4 text-[12px] text-text2">Start saving reports and tracking jobs.</p>

        <ErrorBanner message={error} />

        <form action={signUp} className="flex flex-col gap-3">
          <Field label="Full name" name="full_name">
            <Input id="full_name" name="full_name" type="text" autoComplete="name" required placeholder="Jordan Tech" />
          </Field>
          <Field label="Company" name="company" hint="Optional — your shop or employer.">
            <Input id="company" name="company" type="text" autoComplete="organization" placeholder="Acme HVAC" />
          </Field>
          <Field label="Email" name="email">
            <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" />
          </Field>
          <Field label="Password" name="password" hint="At least 6 characters.">
            <Input id="password" name="password" type="password" autoComplete="new-password" required minLength={6} />
          </Field>
          <Button type="submit" className="mt-1 w-full justify-center">
            Create account →
          </Button>
        </form>
      </Card>

      <p className="mt-4 text-center text-[12px] text-text2">
        Already have an account?{' '}
        <Link href="/login" className="text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
