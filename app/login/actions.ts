'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

function safeRedirect(target: FormDataEntryValue | null): string {
  const value = typeof target === 'string' ? target : '';
  // Only allow internal redirects.
  return value.startsWith('/') && !value.startsWith('//') ? value : '/dashboard';
}

export async function signIn(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const redirectTo = safeRedirect(formData.get('redirect'));

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}&redirect=${encodeURIComponent(redirectTo)}`);
  }
  redirect(redirectTo);
}

export async function signUp(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const fullName = String(formData.get('full_name') ?? '').trim();
  const company = String(formData.get('company') ?? '').trim();
  const redirectTo = safeRedirect(formData.get('redirect'));

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, company },
    },
  });

  if (error) {
    redirect(
      `/signup?error=${encodeURIComponent(error.message)}&redirect=${encodeURIComponent(redirectTo)}`,
    );
  }

  // When email confirmation is enabled there is no active session yet.
  if (!data.session) {
    redirect(
      '/login?notice=' +
        encodeURIComponent('Check your email to confirm your account, then sign in.') +
        '&redirect=' +
        encodeURIComponent(redirectTo),
    );
  }
  redirect(redirectTo);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
