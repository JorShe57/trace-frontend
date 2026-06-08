/** Thin progress indicator under the top bar. */
export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-[2px] flex-shrink-0 bg-border" role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100}>
      <div
        className="h-full bg-accent transition-[width] duration-500 ease-out"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
