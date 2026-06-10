'use client';

import { useCallback, useMemo, useState } from 'react';
import { Card } from '@/components/ui';
import { EPA_SECTIONS, type EpaSectionId } from '@/lib/epa608';
import { quizForSection, type QuizQuestion } from '@/lib/epa608-quiz';

/* A scored multiple-choice practice quiz for EPA 608. The tech picks a deck
   (all sections or one), answers one question at a time with immediate
   right/wrong feedback and a short explanation, then sees a score summary with
   a review of every question. Pure client-side state — nothing is persisted.

   Question order and the option order within each question are both shuffled
   at the start of a run so answers aren't memorized by position. */

type DeckId = 'all' | EpaSectionId;

const DECKS: { id: DeckId; label: string }[] = [
  { id: 'all', label: 'All' },
  ...EPA_SECTIONS.map((s) => ({ id: s.id as DeckId, label: s.label })),
];

/** Fisher–Yates shuffle returning a new array. */
function shuffle<T>(items: T[]): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** A question with its options pre-shuffled for display. */
type RunQuestion = QuizQuestion & { shuffledOptions: string[] };

function buildRun(deck: DeckId): RunQuestion[] {
  const base = quizForSection(deck === 'all' ? undefined : deck);
  return shuffle(base).map((q) => ({ ...q, shuffledOptions: shuffle(q.options) }));
}

const sectionLabel = (id: EpaSectionId) =>
  EPA_SECTIONS.find((s) => s.id === id)?.label ?? id;

export function EpaQuiz() {
  const [deck, setDeck] = useState<DeckId>('all');
  const [run, setRun] = useState<RunQuestion[]>(() => buildRun('all'));
  const [index, setIndex] = useState(0);
  // Selected answer per question (null = not yet answered).
  const [responses, setResponses] = useState<(string | null)[]>(() =>
    new Array(run.length).fill(null),
  );
  const [finished, setFinished] = useState(false);

  const start = useCallback((id: DeckId) => {
    const next = buildRun(id);
    setRun(next);
    setResponses(new Array(next.length).fill(null));
    setIndex(0);
    setFinished(false);
  }, []);

  const selectDeck = (id: DeckId) => {
    setDeck(id);
    start(id);
  };

  const total = run.length;
  const current = run[index];
  const selected = responses[index];
  const answered = selected !== null;

  const score = useMemo(
    () => run.reduce((n, q, i) => (responses[i] === q.answer ? n + 1 : n), 0),
    [run, responses],
  );

  const choose = (option: string) => {
    if (answered) return; // lock the answer once chosen
    setResponses((prev) => {
      const next = prev.slice();
      next[index] = option;
      return next;
    });
  };

  const next = () => {
    if (index + 1 >= total) setFinished(true);
    else setIndex((i) => i + 1);
  };

  // ---- Results screen ----
  if (finished) {
    const pct = total === 0 ? 0 : Math.round((score / total) * 100);
    const passed = pct >= 70; // 70% is the common EPA 608 passing mark
    return (
      <div className="space-y-4">
        <Card className="p-5 text-center">
          <div className="text-[11px] font-medium uppercase tracking-[0.05em] text-text3">
            Your score
          </div>
          <div className="mt-1 font-mono text-[40px] font-bold tabular-nums text-accent">
            {pct}%
          </div>
          <div className="text-[12px] text-text2">
            {score} of {total} correct
          </div>
          <div
            className={`mt-3 inline-block rounded-md border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.05em] ${
              passed
                ? 'border-accent/40 bg-[var(--accent-dim)] text-accent'
                : 'border-yellow/30 bg-[var(--yellow-bg)] text-warn'
            }`}
          >
            {passed ? 'Passing (≥70%)' : 'Below passing (70%)'}
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => start(deck)}
              className="rounded-lg border border-accent bg-[var(--accent-dim)] px-3.5 py-2 text-[13px] font-medium text-accent transition-colors hover:bg-[var(--accent-faint)]"
            >
              Retake quiz
            </button>
          </div>
        </Card>

        <div className="text-[11px] font-medium uppercase tracking-[0.05em] text-text3">Review</div>
        <div className="space-y-2">
          {run.map((q, i) => {
            const yours = responses[i];
            const correct = yours === q.answer;
            return (
              <Card key={i} className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-md border border-border2 bg-bg3 px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.05em] text-text2">
                    {sectionLabel(q.section)}
                  </span>
                  <span
                    className={`text-[11px] font-medium uppercase tracking-[0.05em] ${
                      correct ? 'text-accent' : 'text-danger'
                    }`}
                  >
                    {correct ? '✓ Correct' : '✗ Incorrect'}
                  </span>
                </div>
                <p className="text-[13px] font-medium text-text">{q.q}</p>
                {!correct && (
                  <p className="mt-2 text-[11px] text-text3">
                    Your answer:{' '}
                    <span className="text-danger">{yours ?? 'skipped'}</span>
                  </p>
                )}
                <p className="mt-1 text-[11px] text-text3">
                  Correct answer: <span className="text-accent">{q.answer}</span>
                </p>
                <p className="mt-2 text-[11px] leading-relaxed text-text2">{q.explain}</p>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // ---- Question screen ----
  return (
    <div className="space-y-4">
      {/* Deck selector */}
      <div className="flex flex-wrap gap-1.5">
        {DECKS.map((d) => {
          const active = d.id === deck;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => selectDeck(d.id)}
              className={`rounded-md px-2.5 py-1.5 text-[12.5px] font-medium transition-colors ${
                active
                  ? 'border border-accent/40 bg-[var(--accent-dim)] text-accent'
                  : 'border border-border2 text-text3 hover:text-text2'
              }`}
            >
              {d.label}
            </button>
          );
        })}
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.05em] text-text3">
        <span>
          Question {total === 0 ? 0 : index + 1} / {total}
        </span>
        <span>Score {score}</span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-bg3">
        <div
          className="h-full rounded-full bg-accent transition-all"
          style={{ width: total === 0 ? '0%' : `${(index / total) * 100}%` }}
        />
      </div>

      {current ? (
        <>
          <Card className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-md border border-border2 bg-bg3 px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.05em] text-text2">
                {sectionLabel(current.section)}
              </span>
            </div>
            <p className="text-[15px] font-medium leading-snug text-text">{current.q}</p>

            <div className="mt-4 space-y-2">
              {current.shuffledOptions.map((option) => {
                const isCorrect = option === current.answer;
                const isChosen = option === selected;
                let tone =
                  'border-border2 bg-bg3 text-text2 hover:border-accent hover:text-accent';
                if (answered) {
                  if (isCorrect)
                    tone = 'border-accent bg-[var(--accent-dim)] text-accent';
                  else if (isChosen)
                    tone = 'border-danger/50 bg-[var(--red-bg)] text-danger';
                  else tone = 'border-border2 bg-bg3 text-text3 opacity-70';
                }
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => choose(option)}
                    disabled={answered}
                    className={`flex w-full items-center justify-between gap-3 rounded-lg border px-3.5 py-2.5 text-left text-[13px] transition-colors disabled:cursor-default ${tone}`}
                  >
                    <span>{option}</span>
                    {answered && isCorrect && <span className="text-[13px]">✓</span>}
                    {answered && isChosen && !isCorrect && (
                      <span className="text-[13px]">✗</span>
                    )}
                  </button>
                );
              })}
            </div>

            {answered && (
              <div className="mt-4 rounded-lg border border-border2 bg-bg3 px-3.5 py-3">
                <div
                  className={`text-[11px] font-medium uppercase tracking-[0.05em] ${
                    selected === current.answer ? 'text-accent' : 'text-danger'
                  }`}
                >
                  {selected === current.answer ? 'Correct' : 'Incorrect'}
                </div>
                <p className="mt-1 text-[12px] leading-relaxed text-text2">{current.explain}</p>
              </div>
            )}
          </Card>

          <button
            type="button"
            onClick={next}
            disabled={!answered}
            className="w-full rounded-lg border border-accent bg-[var(--accent-dim)] px-3.5 py-2.5 text-[13px] font-medium text-accent transition-colors hover:bg-[var(--accent-faint)] disabled:opacity-50"
          >
            {index + 1 >= total ? 'Finish & see score' : 'Next question →'}
          </button>
        </>
      ) : (
        <Card className="px-5 py-12 text-center">
          <p className="text-[13px] text-text2">No questions in this deck.</p>
        </Card>
      )}
    </div>
  );
}
