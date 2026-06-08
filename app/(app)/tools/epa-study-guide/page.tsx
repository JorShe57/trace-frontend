import Link from 'next/link';
import { Card, PageHeading, SectionLabel } from '@/components/ui';
import { EpaFlashcards } from '@/components/EpaFlashcards';
import { EPA_SECTIONS, cardsForSection } from '@/lib/epa608';

export const metadata = { title: 'EPA 608 Study Guide · T.R.A.C.E.' };

export default function EpaStudyGuidePage() {
  return (
    <div>
      <PageHeading
        title="EPA 608 Study Guide"
        subtitle="Flashcards and section breakdown for the refrigerant certification exam."
        action={
          <Link
            href="/tools"
            className="font-mono text-[10px] uppercase tracking-[0.08em] text-text3 hover:text-text2"
          >
            ← Tools
          </Link>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Link
          href="/tools/epa-quiz"
          className="font-mono text-[10px] uppercase tracking-[0.08em] text-accent hover:underline"
        >
          Test yourself with the practice quiz →
        </Link>
      </div>

      {/* What the exam covers */}
      <Card className="mb-5 p-4">
        <SectionLabel>How the exam is structured</SectionLabel>
        <p className="mb-3 text-[12px] leading-relaxed text-text2">
          EPA Section 608 has a required <span className="text-text">Core</span> section plus three
          equipment-type sections. Pass Core and all three to earn{' '}
          <span className="text-text">Universal</span> certification. Certification is good for life.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {EPA_SECTIONS.map((s) => (
            <div key={s.id} className="rounded-[4px] border border-border2 bg-bg3 px-3 py-2.5">
              <div className="flex items-baseline justify-between gap-2">
                <div className="text-[12px] font-medium text-text">{s.name}</div>
                <div className="font-mono text-[8px] uppercase tracking-[0.1em] text-text3">
                  {cardsForSection(s.id).length} cards
                </div>
              </div>
              <p className="mt-1 text-[10px] leading-relaxed text-text3">{s.blurb}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Flashcards */}
      <div className="mb-2">
        <SectionLabel>Flashcards</SectionLabel>
      </div>
      <EpaFlashcards />

      <p className="mt-5 px-1 text-[10px] leading-relaxed text-text3">
        Study aid only — not affiliated with or endorsed by the EPA. Regulatory thresholds (leak
        rates, required recovery vacuum levels, phase-out dates) are updated periodically; always
        confirm the current numbers against the EPA&apos;s published Section 608 rule and your
        equipment manufacturer&apos;s specifications before relying on them in the field.
      </p>
    </div>
  );
}
