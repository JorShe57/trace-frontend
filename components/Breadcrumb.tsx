/** Phase breadcrumb (Controls › Equipment › Performance …). */
export function Breadcrumb({ crumbs }: { crumbs: string[] }) {
  if (crumbs.length === 0) return null;
  return (
    <nav aria-label="Diagnostic phases" className="mb-[22px] flex flex-wrap items-center gap-1">
      {crumbs.map((p, i) => {
        const current = i === crumbs.length - 1;
        return (
          <span key={p} className="flex items-center gap-1">
            <span
              className={`font-mono text-[9px] tracking-[0.06em] ${current ? 'text-accent' : 'text-text3'}`}
              aria-current={current ? 'step' : undefined}
            >
              {p}
            </span>
            {i < crumbs.length - 1 && (
              <span className="font-mono text-[9px] text-text3">›</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
