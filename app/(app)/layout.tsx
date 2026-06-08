import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AppNav } from '@/components/AppNav';
import { LogoMark } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui';
import { createClient } from '@/lib/supabase/server';
import { signOut } from '@/app/login/actions';
import type { Profile } from '@/lib/db/types';

/**
 * Authenticated shell for the project-tracker side of the app. The middleware
 * already gates these routes; this layout is the belt-and-braces redirect plus
 * the chrome (brand, nav, account menu) shared by every signed-in page.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle<Profile>();

  const displayName = profile?.full_name || user.email || 'Account';

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-[100] flex h-[52px] items-center gap-4 border-b border-border bg-bg2 px-5">
        <Link href="/dashboard" className="flex items-center gap-2">
          <LogoMark />
          <span className="font-head text-[15px] font-bold tracking-[0.18em] text-text">
            T<span className="text-accent">.</span>R<span className="text-accent">.</span>A
            <span className="text-accent">.</span>C<span className="text-accent">.</span>E
            <span className="text-accent">.</span>
          </span>
        </Link>

        <div className="ml-2 hidden sm:block">
          <AppNav />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/diagnostic/ai"
            className="hidden rounded-[3px] border border-accent bg-[var(--accent-dim)] px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-accent transition-colors hover:bg-[var(--accent-faint)] sm:inline-block"
          >
            + New diagnostic
          </Link>
          <Link
            href="/account"
            className="max-w-[140px] truncate font-mono text-[10px] text-text2 hover:text-accent"
            title={displayName}
          >
            {displayName}
          </Link>
          <ThemeToggle />
          <form action={signOut}>
            <Button type="submit" variant="ghost" className="px-2.5 py-1.5">
              Sign out
            </Button>
          </form>
        </div>
      </header>

      {/* Mobile nav */}
      <div className="border-b border-border bg-bg2 px-3 py-2 sm:hidden">
        <AppNav />
      </div>

      <main className="mx-auto w-full max-w-[920px] flex-1 px-5 py-7">{children}</main>
    </div>
  );
}
