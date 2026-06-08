import Link from 'next/link';
import { Card, PageHeading } from '@/components/ui';

export const metadata = { title: 'Tools · T.R.A.C.E.' };

/** Field tools and calculators techs reach for on the job. */
const TOOLS = [
  {
    href: '/tools/refrigerant-calculator',
    name: 'Refrigerant Calculator',
    blurb: 'Superheat & subcooling from gauge pressure and line temperatures.',
  },
  {
    href: '/tools/epa-study-guide',
    name: 'EPA 608 Study Guide',
    blurb: 'Flashcards by certification section to prep for the refrigerant exam.',
  },
  {
    href: '/tools/epa-quiz',
    name: 'EPA 608 Practice Quiz',
    blurb: 'Scored multiple-choice practice test with instant feedback and review.',
  },
];

export default function ToolsPage() {
  return (
    <div>
      <PageHeading
        title="Tools"
        subtitle="Calculators and utilities for the field."
      />

      <Card className="divide-y divide-border">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-bg3"
          >
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] text-text">{tool.name}</div>
              <div className="mt-0.5 font-mono text-[9px] text-text3">{tool.blurb}</div>
            </div>
            <span className="font-mono text-[12px] text-text3">→</span>
          </Link>
        ))}
      </Card>
    </div>
  );
}
