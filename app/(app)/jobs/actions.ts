'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { JobStatus } from '@/lib/db/types';

function str(v: FormDataEntryValue | null): string | null {
  const s = typeof v === 'string' ? v.trim() : '';
  return s.length ? s : null;
}

async function userClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  return { supabase, userId: user.id };
}

export async function createJob(formData: FormData) {
  const { supabase, userId } = await userClient();
  const title = str(formData.get('title'));
  if (!title) redirect('/jobs/new?error=' + encodeURIComponent('Title is required.'));

  const scheduledRaw = str(formData.get('scheduled_for'));

  const { data, error } = await supabase
    .from('jobs')
    .insert({
      user_id: userId,
      title,
      description: str(formData.get('description')),
      status: (str(formData.get('status')) as JobStatus) ?? 'open',
      priority: str(formData.get('priority')) ?? 'normal',
      customer_id: str(formData.get('customer_id')),
      site_id: str(formData.get('site_id')),
      equipment_id: str(formData.get('equipment_id')),
      scheduled_for: scheduledRaw ? new Date(scheduledRaw).toISOString() : null,
    })
    .select('id')
    .single();

  if (error) redirect('/jobs/new?error=' + encodeURIComponent(error.message));
  revalidatePath('/jobs');
  redirect(`/jobs/${data.id}`);
}

export async function updateJobStatus(formData: FormData) {
  const { supabase } = await userClient();
  const id = String(formData.get('id') ?? '');
  const status = String(formData.get('status') ?? '') as JobStatus;
  if (!id || !status) return;

  await supabase
    .from('jobs')
    .update({
      status,
      completed_at: status === 'done' ? new Date().toISOString() : null,
    })
    .eq('id', id);

  revalidatePath(`/jobs/${id}`);
  revalidatePath('/jobs');
}

export async function deleteJob(formData: FormData) {
  const { supabase } = await userClient();
  const id = String(formData.get('id') ?? '');
  if (id) await supabase.from('jobs').delete().eq('id', id);
  revalidatePath('/jobs');
  redirect('/jobs');
}
