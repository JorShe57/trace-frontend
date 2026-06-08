'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/ask', label: 'Ask Trace' },
  { href: '/reports', label: 'Reports' },
  { href: '/customers', label: 'Customers' },
  { href: '/jobs', label: 'Jobs' },
  { href: '/tools', label: 'Tools' },
];

/** Primary in-app navigation. Highlights the active section. */
export function AppNav() {
  const pathname = usePathname();
  return (
    <nav className="flex items-center gap-1">
      {LINKS.map((link) => {
        const active =
          link.href === '/'
            ? pathname === '/'
            : pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-[3px] px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] transition-colors ${
              active
                ? 'border border-accent/40 bg-[var(--accent-dim)] text-accent'
                : 'border border-transparent text-text3 hover:text-text2'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
