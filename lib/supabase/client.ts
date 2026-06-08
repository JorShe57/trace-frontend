'use client';

import { createBrowserClient } from '@supabase/ssr';

/**
 * Browser Supabase client. Reads/writes the auth session from cookies so it
 * stays in sync with the server (via middleware). Use this in Client
 * Components for interactive auth (sign in/up, sign out).
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
