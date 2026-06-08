import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseServiceRoleKey, getSupabaseUrl } from '@/lib/env';

let admin: SupabaseClient | null = null;

/** Service-role client for Route Handlers only — bypasses RLS. */
export function getSupabaseAdmin(): SupabaseClient {
  if (!admin) {
    admin = createClient(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return admin;
}
