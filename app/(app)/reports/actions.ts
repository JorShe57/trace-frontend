'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/** Delete one of the caller's saved reports. RLS guarantees ownership. */
export async function deleteReport(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  if (!id) return;

  const supabase = await createClient();
  await supabase.from('diagnostic_sessions').delete().eq('id', id);

  revalidatePath('/reports');
  redirect('/reports');
}
