/** The TRACE waveform logo mark: a solid accent tile with the pulse line. */
export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <span
      className={`flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-lg bg-accent ${className}`}
    >
      <svg
        viewBox="0 0 16 16"
        className="h-[15px] w-[15px]"
        fill="none"
        stroke="var(--accent-contrast)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="1,12 4,6 7,10 10,4 13,8 15,5" />
      </svg>
    </span>
  );
}

/** Wordmark: tight all-caps with a single accent full stop. */
export function WordMark({ className = '' }: { className?: string }) {
  return (
    <span className={`text-[16px] font-semibold tracking-[0.04em] text-text ${className}`}>
      TRACE<span className="text-accent">.</span>
    </span>
  );
}
