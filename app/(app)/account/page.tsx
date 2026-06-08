import { Button, Card, Field, Input, PageHeading, SectionLabel } from '@/components/ui';
import { createClient } from '@/lib/supabase/server';
import type { Profile } from '@/lib/db/types';
import { updateProfile } from './actions';

export const metadata = { title: 'Account · T.R.A.C.E.' };

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .maybeSingle<Profile>();

  return (
    <div className="mx-auto max-w-[520px]">
      <PageHeading title="Account" subtitle="Your profile and sign-in." />

      {saved && (
        <div className="mb-3 rounded-[4px] border border-accent/30 bg-[var(--accent-faint)] px-3 py-2 text-[12px] text-accent">
          Profile saved.
        </div>
      )}

      <Card className="px-5 py-5">
        <form action={updateProfile} className="flex flex-col gap-3">
          <Field label="Full name" name="full_name">
            <Input id="full_name" name="full_name" defaultValue={profile?.full_name ?? ''} />
          </Field>
          <Field label="Company" name="company">
            <Input id="company" name="company" defaultValue={profile?.company ?? ''} />
          </Field>
          <Field label="Phone" name="phone">
            <Input id="phone" name="phone" type="tel" defaultValue={profile?.phone ?? ''} />
          </Field>
          <Button type="submit" className="mt-1 w-full justify-center">
            Save profile
          </Button>
        </form>
      </Card>

      <Card className="mt-4 px-5 py-4">
        <SectionLabel>Sign-in</SectionLabel>
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[11px] text-text2">{user?.email}</span>
          <span className="font-mono text-[9px] text-text3">Role: {profile?.role ?? 'tech'}</span>
        </div>
      </Card>
    </div>
  );
}
