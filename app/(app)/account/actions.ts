'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

function str(v: FormDataEntryValue | null): string | null {
  const s = typeof v === 'string' ? v.trim() : '';
  return s.length ? s : null;
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      full_name: str(formData.get('full_name')),
      company: str(formData.get('company')),
      phone: str(formData.get('phone')),
    });

  revalidatePath('/account');
  redirect('/account?saved=1');
}
