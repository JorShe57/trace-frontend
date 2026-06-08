import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { getSupabaseAnonKey, getSupabaseUrl } from '@/lib/env';

/**
 * Server Supabase client, bound to the request's cookies. Honours row-level
 * security as the signed-in user, so queries automatically scope to the
 * current technician. Use in Server Components, Route Handlers and Server
 * Actions. (In a Server Component the cookie `set` calls are no-ops, which is
 * expected — the middleware is what refreshes the session cookie.)
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component — safe to ignore; middleware
          // refreshes the session cookie on the response.
        }
      },
    },
  });
}

/** Convenience: the current authenticated user, or null. */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
