import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Exchanges the `code` from an email-confirmation or magic-link for a session
 * cookie, then sends the user on to their destination. Supabase redirects here
 * after the user clicks the link in their inbox.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next.startsWith('/') ? next : '/dashboard'}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Could not sign you in. Try again.')}`);
}
