import type { AnswerStyle, PipColor } from '@/lib/types';

/** Tailwind background class for a phase pip colour. */
export function pipClass(color: PipColor): string {
  switch (color) {
    case 'yellow':
      return 'bg-warn';
    case 'red':
      return 'bg-danger';
    case 'green':
      return 'bg-accent';
    case 'grey':
    default:
      return 'bg-text3';
  }
}

/**
 * Border + hover treatment for an answer button, keyed on its intent.
 * Base styling (padding, layout) lives on the element; this adds the accent.
 */
export function answerClass(style: AnswerStyle | undefined): string {
  switch (style) {
    case 'yes':
      return 'border-accent/30 hover:border-accent hover:bg-[var(--accent-dim)]';
    case 'no':
      return 'border-danger/20 hover:border-danger hover:bg-[var(--red-bg)] hover:text-danger';
    case 'warn':
      return 'border-warn/20 hover:border-warn hover:bg-[var(--yellow-bg)] hover:text-warn';
    default:
      return 'border-border2 hover:border-accent hover:bg-[var(--accent-dim)]';
  }
}
