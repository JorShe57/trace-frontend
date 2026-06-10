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
            className={`rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors ${
              active
                ? 'bg-bg4 text-text'
                : 'text-text3 hover:bg-bg3 hover:text-text2'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
