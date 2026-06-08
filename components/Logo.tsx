/** The T.R.A.C.E. waveform logo mark. */
export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <span
      className={`relative flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-[4px] border-[1.5px] border-accent ${className}`}
    >
      <span className="pointer-events-none absolute inset-1 rounded-[2px] border border-accent/30" />
      <svg
        viewBox="0 0 16 16"
        className="relative z-[1] h-[14px] w-[14px]"
        fill="none"
        stroke="var(--accent)"
        strokeWidth={2.5}
        aria-hidden="true"
      >
        <polyline points="1,12 4,6 7,10 10,4 13,8 15,5" />
      </svg>
    </span>
  );
}

/** Wordmark with the green dotted separators. */
export function WordMark() {
  const letters = ['T', 'R', 'A', 'C', 'E'];
  return (
    <span className="font-head text-[19px] font-bold tracking-[0.2em] text-text">
      {letters.map((l, i) => (
        <span key={l}>
          {l}
          {i < letters.length - 1 && <span className="text-accent">.</span>}
        </span>
      ))}
      <span className="text-accent">.</span>
    </span>
  );
}
