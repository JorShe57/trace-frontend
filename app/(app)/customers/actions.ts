'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

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

export async function createCustomer(formData: FormData) {
  const { supabase, userId } = await userClient();
  const name = str(formData.get('name'));
  if (!name) redirect('/customers/new?error=' + encodeURIComponent('Name is required.'));

  const { data, error } = await supabase
    .from('customers')
    .insert({
      user_id: userId,
      name,
      contact_name: str(formData.get('contact_name')),
      email: str(formData.get('email')),
      phone: str(formData.get('phone')),
      address: str(formData.get('address')),
      notes: str(formData.get('notes')),
    })
    .select('id')
    .single();

  if (error) redirect('/customers/new?error=' + encodeURIComponent(error.message));
  revalidatePath('/customers');
  redirect(`/customers/${data.id}`);
}

export async function createSite(formData: FormData) {
  const { supabase, userId } = await userClient();
  const customerId = String(formData.get('customer_id') ?? '');
  const name = str(formData.get('name'));
  if (!name || !customerId) redirect(`/customers/${customerId}`);

  await supabase.from('sites').insert({
    user_id: userId,
    customer_id: customerId,
    name,
    address: str(formData.get('address')),
    notes: str(formData.get('notes')),
  });

  revalidatePath(`/customers/${customerId}`);
  redirect(`/customers/${customerId}`);
}

export async function createEquipment(formData: FormData) {
  const { supabase, userId } = await userClient();
  const customerId = String(formData.get('customer_id') ?? '');
  const siteId = String(formData.get('site_id') ?? '');
  const label = str(formData.get('label'));
  if (!label || !siteId) redirect(`/customers/${customerId}`);

  await supabase.from('equipment').insert({
    user_id: userId,
    site_id: siteId,
    label,
    unit_type: str(formData.get('unit_type')),
    manufacturer: str(formData.get('manufacturer')),
    model: str(formData.get('model')),
    serial: str(formData.get('serial')),
    notes: str(formData.get('notes')),
  });

  revalidatePath(`/customers/${customerId}`);
  redirect(`/customers/${customerId}`);
}

export async function deleteCustomer(formData: FormData) {
  const { supabase } = await userClient();
  const id = String(formData.get('id') ?? '');
  if (id) await supabase.from('customers').delete().eq('id', id);
  revalidatePath('/customers');
  redirect('/customers');
}
