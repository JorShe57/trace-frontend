'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui';
import {
  EPA_SECTIONS,
  cardsForSection,
  type EpaSectionId,
  type Flashcard,
} from '@/lib/epa608';

/* An interactive flashcard deck for EPA 608 study. Techs pick a deck (all
   cards or a single certification section), flip each card to check their
   answer, and mark cards "known" — known cards drop out of the rotation so
   reviewing focuses on the ones still tripping them up. Everything is
   client-side state; nothing is persisted, so a refresh starts a clean run.

   Keyboard: ← / → step, Space/Enter flips, K marks known. */

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

export function EpaFlashcards() {
  const [deck, setDeck] = useState<DeckId>('all');
  // Card order for the active deck; reset whenever the deck changes.
  const [order, setOrder] = useState<Flashcard[]>(() => cardsForSection());
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  // Cards the tech has marked as known, keyed by question text.
  const [known, setKnown] = useState<Set<string>>(new Set());

  const loadDeck = useCallback((id: DeckId, opts?: { shuffle?: boolean }) => {
    const base = cardsForSection(id === 'all' ? undefined : id);
    setOrder(opts?.shuffle ? shuffle(base) : base);
    setIndex(0);
    setFlipped(false);
    setKnown(new Set());
  }, []);

  const selectDeck = (id: DeckId) => {
    setDeck(id);
    loadDeck(id);
  };

  const total = order.length;
  const card = order[index];
  const knownCount = useMemo(
    () => order.reduce((n, c) => (known.has(c.q) ? n + 1 : n), 0),
    [order, known],
  );
  const allKnown = total > 0 && knownCount === total;

  const step = useCallback(
    (dir: 1 | -1) => {
      if (total === 0) return;
      setFlipped(false);
      setIndex((i) => (i + dir + total) % total);
    },
    [total],
  );

  const toggleKnown = useCallback(() => {
    if (!card) return;
    setKnown((prev) => {
      const next = new Set(prev);
      if (next.has(card.q)) next.delete(card.q);
      else next.add(card.q);
      return next;
    });
  }, [card]);

  // Keyboard shortcuts for fast, hands-on-keys studying.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT'))
        return;
      if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.key.toLowerCase() === 'k') toggleKnown();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, toggleKnown]);

  const sectionLabel = (id: EpaSectionId) =>
    EPA_SECTIONS.find((s) => s.id === id)?.label ?? id;

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
          Card {total === 0 ? 0 : index + 1} / {total}
        </span>
        <span>
          {knownCount} known · {total - knownCount} to review
        </span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-bg3">
        <div
          className="h-full rounded-full bg-accent transition-all"
          style={{ width: total === 0 ? '0%' : `${(knownCount / total) * 100}%` }}
        />
      </div>

      {/* Card */}
      {card ? (
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          className="block w-full text-left"
          aria-label="Flip card"
        >
          <Card className="flex min-h-[220px] flex-col p-5 transition-colors hover:border-accent/40">
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-md border border-border2 bg-bg3 px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.05em] text-text2">
                {sectionLabel(card.section)}
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.05em] text-text3">
                {flipped ? 'Answer' : 'Question'}
              </span>
              {known.has(card.q) && (
                <span className="rounded-md border border-accent/30 bg-[var(--accent-faint)] px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.05em] text-accent">
                  Known
                </span>
              )}
            </div>
            <div className="flex flex-1 items-center">
              <p
                className={
                  flipped
                    ? 'text-[14px] leading-relaxed text-text2'
                    : 'text-[16px] font-medium leading-snug text-text'
                }
              >
                {flipped ? card.a : card.q}
              </p>
            </div>
            <div className="mt-4 text-[11px] font-medium uppercase tracking-[0.05em] text-text3">
              {flipped ? 'Tap to see question' : 'Tap to reveal answer'}
            </div>
          </Card>
        </button>
      ) : (
        <Card className="px-5 py-12 text-center">
          <p className="text-[13px] text-text2">No cards in this deck.</p>
        </Card>
      )}

      {/* Controls */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={total === 0}
          className="rounded-lg border border-border2 bg-bg2 px-3 py-2 text-[13px] font-medium text-text2 transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
        >
          ← Prev
        </button>
        <button
          type="button"
          onClick={toggleKnown}
          disabled={total === 0}
          className="rounded-lg border border-accent bg-[var(--accent-dim)] px-3 py-2 text-[13px] font-medium text-accent transition-colors hover:bg-[var(--accent-faint)] disabled:opacity-50"
        >
          {card && known.has(card.q) ? 'Unmark' : 'Got it'}
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={total === 0}
          className="rounded-lg border border-border2 bg-bg2 px-3 py-2 text-[13px] font-medium text-text2 transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
        >
          Next →
        </button>
        <button
          type="button"
          onClick={() => loadDeck(deck, { shuffle: true })}
          className="rounded-lg border border-border2 bg-bg2 px-3 py-2 text-[13px] font-medium text-text2 transition-colors hover:border-accent hover:text-accent"
        >
          ⟳ Shuffle
        </button>
      </div>

      {allKnown && (
        <Card className="px-5 py-6 text-center">
          <p className="text-[13px] text-text">Deck complete — every card marked known. 🎉</p>
          <button
            type="button"
            onClick={() => loadDeck(deck, { shuffle: true })}
            className="mx-auto mt-3 rounded-lg border border-accent bg-[var(--accent-dim)] px-3.5 py-2 text-[13px] font-medium text-accent transition-colors hover:bg-[var(--accent-faint)]"
          >
            Restart & shuffle
          </button>
        </Card>
      )}

      <p className="px-1 text-[11px] font-medium uppercase tracking-[0.05em] text-text3">
        Shortcuts: ← / → step · Space flips · K marks known
      </p>
    </div>
  );
}
