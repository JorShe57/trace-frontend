import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AppNav } from '@/components/AppNav';
import { LogoMark, WordMark } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { createClient } from '@/lib/supabase/server';
import { signOut } from '@/app/login/actions';
import type { Profile } from '@/lib/db/types';

const newDiagnosticButton =
  'flex items-center justify-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-[13px] font-medium text-[var(--accent-contrast)] transition-colors hover:bg-accent2';

/**
 * Authenticated shell for the project-tracker side of the app. The middleware
 * already gates these routes; this layout is the belt-and-braces redirect plus
 * the chrome (sidebar on desktop, top bar on mobile) shared by every
 * signed-in page.
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
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[232px] flex-shrink-0 flex-col border-r border-border bg-bg2 px-3 py-4 md:flex">
        <Link href="/dashboard" className="mb-5 flex items-center gap-2.5 px-2" title="Dashboard">
          <LogoMark />
          <WordMark />
        </Link>

        <Link href="/diagnostic/ai" className={`${newDiagnosticButton} mb-5`}>
          + New diagnostic
        </Link>

        <AppNav vertical />

        <div className="mt-auto border-t border-border pt-3">
          <Link
            href="/account"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-text2 transition-colors hover:bg-bg3 hover:text-text"
            title={displayName}
          >
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-bg4 text-[11px] font-semibold uppercase text-text2">
              {displayName.charAt(0)}
            </span>
            <span className="truncate">{displayName}</span>
          </Link>
          <div className="mt-1 flex items-center justify-between px-3 pb-1">
            <form action={signOut}>
              <button
                type="submit"
                className="text-[12.5px] font-medium text-text3 transition-colors hover:text-text"
              >
                Sign out
              </button>
            </form>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile header */}
        <header className="sticky top-0 z-[100] border-b border-border bg-bg2/90 backdrop-blur md:hidden">
          <div className="flex h-[56px] items-center gap-3 px-4">
            <Link href="/dashboard" className="flex items-center gap-2.5" title="Dashboard">
              <LogoMark />
              <WordMark />
            </Link>
            <div className="ml-auto flex items-center gap-2">
              <Link href="/diagnostic/ai" className={`${newDiagnosticButton} px-2.5 py-1.5`}>
                + New
              </Link>
              <ThemeToggle />
            </div>
          </div>
          <div className="border-t border-border px-2 py-1.5">
            <AppNav />
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1080px] flex-1 px-5 py-8 md:px-10 md:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
