import Link from 'next/link';
import type { ReactNode } from 'react';
import { PageHeading } from '@/components/ui';

export const metadata = { title: 'Tools · TRACE' };

function ToolIcon({ children }: { children: ReactNode }) {
  return (
    <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent-dim)] text-accent">
      <svg
        viewBox="0 0 24 24"
        className="h-[18px] w-[18px]"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {children}
      </svg>
    </span>
  );
}

/** Field tools and calculators techs reach for on the job. */
const TOOLS = [
  {
    href: '/tools/refrigerant-calculator',
    name: 'Refrigerant Calculator',
    blurb: 'Superheat & subcooling from gauge pressure and line temperatures.',
    icon: (
      <ToolIcon>
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="8" y1="6" x2="16" y2="6" />
        <line x1="8" y1="11" x2="8" y2="11.01" />
        <line x1="12" y1="11" x2="12" y2="11.01" />
        <line x1="16" y1="11" x2="16" y2="11.01" />
        <line x1="8" y1="15" x2="8" y2="15.01" />
        <line x1="12" y1="15" x2="12" y2="15.01" />
        <line x1="16" y1="15" x2="16" y2="18" />
        <line x1="8" y1="18" x2="8" y2="18.01" />
        <line x1="12" y1="18" x2="12" y2="18.01" />
      </ToolIcon>
    ),
  },
  {
    href: '/tools/epa-study-guide',
    name: 'EPA 608 Study Guide',
    blurb: 'Flashcards by certification section to prep for the refrigerant exam.',
    icon: (
      <ToolIcon>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </ToolIcon>
    ),
  },
  {
    href: '/tools/epa-quiz',
    name: 'EPA 608 Practice Quiz',
    blurb: 'Scored multiple-choice practice test with instant feedback and review.',
    icon: (
      <ToolIcon>
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </ToolIcon>
    ),
  },
];

export default function ToolsPage() {
  return (
    <div>
      <PageHeading title="Tools" subtitle="Calculators and utilities for the field." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="rounded-card border border-border bg-bg2 p-5 shadow-card transition-colors hover:border-border2 hover:bg-bg3"
          >
            {tool.icon}
            <div className="text-[14.5px] font-semibold tracking-[-0.01em] text-text">
              {tool.name}
            </div>
            <div className="mt-1.5 text-[13px] leading-[1.6] text-text2">{tool.blurb}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
