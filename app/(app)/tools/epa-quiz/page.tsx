import Link from 'next/link';
import { PageHeading } from '@/components/ui';
import { EpaQuiz } from '@/components/EpaQuiz';

export const metadata = { title: 'EPA 608 Practice Quiz · T.R.A.C.E.' };

export default function EpaQuizPage() {
  return (
    <div>
      <PageHeading
        title="EPA 608 Practice Quiz"
        subtitle="Scored multiple-choice questions to test your readiness for the exam."
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
          href="/tools/epa-study-guide"
          className="font-mono text-[10px] uppercase tracking-[0.08em] text-accent hover:underline"
        >
          Study the flashcards first →
        </Link>
      </div>

      <EpaQuiz />

      <p className="mt-5 px-1 text-[10px] leading-relaxed text-text3">
        Practice tool only — not affiliated with or endorsed by the EPA, and not the actual
        certification exam. Questions are for self-study; always confirm current regulatory
        thresholds against the EPA&apos;s published Section 608 rule.
      </p>
    </div>
  );
}
